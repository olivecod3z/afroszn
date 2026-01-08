const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

// Initialize Firebase Admin once
admin.initializeApp();

// Initialize Stripe with conditional config for linting vs runtime
const getStripeInstance = () => {
  // During linting, functions.config() returns undefined
  // At runtime, it returns the actual config
  const config = functions.config();
  const stripeKey = (config && config.stripe && config.stripe.secret) ||
  "sk_test_placeholder_for_linting";
  return require("stripe")(stripeKey);
};

const stripe = getStripeInstance();

exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
  // Handle CORS
  return cors(req, res, async () => {
    try {
      // Only accept POST requests
      if (req.method !== "POST") {
        return res.status(405).json({error: "Method not allowed"});
      }

      // Get real data from the website
      const {email, eventId, eventTitle, ticketTier, amount} = req.body;

      // Basic validation
      if (!email || !eventId || !eventTitle || !ticketTier || !amount) {
        return res.status(400).json({
          error: "Missing required checkout fields",
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Invalid email format",
        });
      }

      // Validate amount
      if (typeof amount !== "number" || amount <= 0) {
        return res.status(400).json({
          error: "Invalid amount",
        });
      }

      console.log("Creating checkout session for:", {
        email,
        eventId,
        eventTitle,
        ticketTier,
        amount: "$" + (amount / 100).toFixed(2) + " AUD",
      });

      // Create Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: "aud",
              product_data: {
                name: eventTitle + " – " + ticketTier + " Ticket",
                description: "Ticket for " + eventTitle,
              },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        success_url: "https://afroszn.org/checkout-success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "https://afroszn.org/checkout-cancel",
        metadata: {
          eventId: eventId,
          ticketTier: ticketTier,
        },
      });

      console.log("Stripe session created:", session.id);

      // Save payment to Firestore
      const paymentDoc = await admin.firestore().collection("payments").add({
        email: email,
        eventId: eventId,
        eventTitle: eventTitle,
        ticketTier: ticketTier,
        amount: amount,
        currency: "aud",
        stripeSessionId: session.id,
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log("Payment record created:", paymentDoc.id);

      // Return the checkout URL
      return res.status(200).json({
        url: session.url,
        sessionId: session.id,
      });
    } catch (error) {
      console.error("Checkout error:", error);
      return res.status(500).json({
        error: error.message || "Failed to create checkout session",
      });
    }
  });
});

// Webhook handler
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const config = functions.config();
  const webhookSecret = (config && config.stripe &&
    config.stripe.webhook_secret) || "";

  let event;

  try {
    event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        webhookSecret,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send("Webhook Error: " + err.message);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;

      console.log("Payment successful:", session.id);

      const paymentsRef = admin.firestore().collection("payments");
      const snapshot = await paymentsRef
          .where("stripeSessionId", "==", session.id)
          .limit(1)
          .get();

      if (!snapshot.empty) {
        const paymentDoc = snapshot.docs[0];
        await paymentDoc.ref.update({
          status: "completed",
          paidAt: admin.firestore.FieldValue.serverTimestamp(),
          stripePaymentIntent: session.payment_intent,
        });

        console.log("Payment record updated:", paymentDoc.id);
      }
      break;
    }

    case "checkout.session.expired": {
      const expiredSession = event.data.object;

      const expiredRef = admin.firestore().collection("payments");
      const expiredSnapshot = await expiredRef
          .where("stripeSessionId", "==", expiredSession.id)
          .limit(1)
          .get();

      if (!expiredSnapshot.empty) {
        const paymentDoc = expiredSnapshot.docs[0];
        await paymentDoc.ref.update({
          status: "expired",
          expiredAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
      break;
    }

    default:
      console.log("Unhandled event type " + event.type);
  }

  res.json({received: true});
});
