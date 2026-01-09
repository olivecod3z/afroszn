require("dotenv").config();

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

admin.initializeApp();

// ===== STRIPE WEBHOOK =====
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        console.log('Payment successful:', session.id);
        
        try {
            // Get customer details
            const customerEmail = session.customer_details.email;
            const customerName = session.customer_details.name;
            const amountPaid = session.amount_total / 100; // Convert from cents
            const currency = session.currency.toUpperCase();
            
            // Extract ticket info from metadata (we'll add this later)
            const ticketType = session.metadata.ticketType || 'General Admission';
            const quantity = parseInt(session.metadata.quantity) || 1;
            const eventName = session.metadata.eventName || 'AFRO SEASON VOLUME 4';
            const eventDate = session.metadata.eventDate || 'TBA';
            
            // Generate unique ticket ID
            const ticketId = uuidv4();
            
            // Save order to Firestore
            await admin.firestore().collection('orders').doc(session.id).set({
                orderId: session.id,
                ticketId: ticketId,
                customerEmail: customerEmail,
                customerName: customerName,
                ticketType: ticketType,
                quantity: quantity,
                eventName: eventName,
                eventDate: eventDate,
                amountPaid: amountPaid,
                currency: currency,
                paymentMethod: 'stripe',
                paymentStatus: 'completed',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                ticketSent: false
            });
            
            console.log('Order saved to Firestore:', session.id);
            
           // Generate individual tickets for each quantity
const tickets = [];
for (let i = 1; i <= quantity; i++) {
  const individualTicketId = `${uuidv4()}-${i}`;
  tickets.push({
    ticketId: individualTicketId,
    ticketNumber: i,
    totalTickets: quantity,
  });
}

    // Save order with all ticket IDs to Firestore
    await admin.firestore().collection("orders").doc(session.id).set({
    orderId: session.id,
    tickets: tickets,
    customerEmail: customerEmail,
    customerName: customerName,
    ticketType: ticketType,
    quantity: quantity,
    eventName: eventName,
    eventDate: eventDate,
    amountPaid: amountPaid,
    currency: currency,
    paymentMethod: "stripe",
    paymentStatus: "completed",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    ticketsSent: false,
    });

    console.log("Order saved to Firestore:", session.id);

    // Generate and send individual tickets
    await generateAndSendTickets({
    orderId: session.id,
    tickets: tickets,
    customerEmail: customerEmail,
    customerName: customerName,
    ticketType: ticketType,
    quantity: quantity,
    eventName: eventName,
    eventDate: eventDate,
    amountPaid: amountPaid,
    currency: currency,
    });

    // Mark tickets as sent
    await admin.firestore().collection("orders").doc(session.id).update({
    ticketsSent: true,
    ticketsSentAt: admin.firestore.FieldValue.serverTimestamp(),
    });
            
            // Mark ticket as sent
            await admin.firestore().collection('orders').doc(session.id).update({
                ticketSent: true,
                ticketSentAt: admin.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('Ticket sent successfully to:', customerEmail);
            
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    }
    
    res.json({ received: true });
});

// ===== GENERATE AND SEND INDIVIDUAL TICKETS =====
async function generateAndSendTickets(orderData) {
  const emailHTMLs = [];
  const pdfBuffers = [];

  // Generate individual ticket for each quantity
  for (let i = 0; i < orderData.tickets.length; i++) {
    const ticket = orderData.tickets[i];

    // Generate unique QR code for this specific ticket
    const qrCodeData = JSON.stringify({
      ticketId: ticket.ticketId,
      orderId: orderData.orderId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      eventName: orderData.eventName,
      ticketType: orderData.ticketType,
      ticketNumber: ticket.ticketNumber,
      totalTickets: ticket.totalTickets,
      timestamp: Date.now(),
    });

    const qrCodeImage = await QRCode.toDataURL(qrCodeData, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 1,
      margin: 1,
      width: 400,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    // Create HTML for this individual ticket
    const ticketHTML = createIndividualTicketEmail(
        {
          ...orderData,
          ticketId: ticket.ticketId,
          ticketNumber: ticket.ticketNumber,
          totalTickets: ticket.totalTickets,
        },
        qrCodeImage
    );

    emailHTMLs.push(ticketHTML);

    // Generate PDF for this ticket
    const pdfBuffer = await generateTicketPDF({
      ...orderData,
      ticketId: ticket.ticketId,
      ticketNumber: ticket.ticketNumber,
      totalTickets: ticket.totalTickets,
      qrCodeImage: qrCodeImage,
    });

    pdfBuffers.push(pdfBuffer);
  }

  // Create email transporter
  const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Send separate email for each ticket with PDF attachment
  for (let i = 0; i < emailHTMLs.length; i++) {
    const ticket = orderData.tickets[i];

    const mailOptions = {
      from: `"AFRO SEASON" <${process.env.EMAIL_USER}>`,
      to: orderData.customerEmail,
      subject: `Your E-Ticket ${ticket.ticketNumber}/${orderData.quantity} - ${orderData.eventName}`,
      html: emailHTMLs[i],
      attachments: [
        {
          filename: `AFRO-SEASON-Ticket-${ticket.ticketNumber}-of-${orderData.quantity}.pdf`,
          content: pdfBuffers[i],
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log(
        `Ticket ${ticket.ticketNumber} with PDF sent to:`,
        orderData.customerEmail
    );
  }

  console.log(`All ${orderData.quantity} tickets with PDFs sent successfully!`);
}
// ===== GENERATE CALENDAR LINK =====
function generateCalendarLink(eventData) {
  const eventDate = encodeURIComponent(eventData.eventDate);
  const eventName = encodeURIComponent(eventData.eventName);
  const eventLocation = encodeURIComponent("Adelaide, SA");

  // Google Calendar link
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventName}&dates=20251001T103000Z/20251001T143000Z&details=Your+ticket+for+${eventName}&location=${eventLocation}`;

  return googleCalendarUrl;
}

// ===== CREATE TICKET EMAIL HTML =====
function createTicketEmail(orderData, qrCodeImage) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #0D0D0D;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #0D0D0D;
            padding: 20px;
        }
        .ticket-card {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border: 2px solid #F04400;
            border-radius: 12px;
            padding: 40px 30px;
            color: white;
            margin: 20px 0;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .event-name {
            font-size: 28px;
            font-weight: bold;
            color: #F04400;
            margin: 0 0 10px 0;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .event-date {
            font-size: 16px;
            color: #9AA4B2;
            margin: 0;
        }
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #F04400, transparent);
            margin: 30px 0;
        }
        .ticket-details {
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #333;
        }
        .detail-label {
            color: #9AA4B2;
            font-size: 14px;
        }
        .detail-value {
            color: white;
            font-weight: bold;
            font-size: 16px;
        }
        .qr-section {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: white;
            border-radius: 8px;
        }
        .qr-code {
            width: 200px;
            height: 200px;
            margin: 0 auto;
        }
        .qr-text {
            color: #333;
            font-size: 12px;
            margin-top: 10px;
        }
        .ticket-id {
            text-align: center;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            color: #9AA4B2;
            margin: 20px 0;
            letter-spacing: 2px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #333;
        }
        .footer-text {
            color: #9AA4B2;
            font-size: 12px;
            line-height: 1.6;
        }
        .important-note {
            background: #2a2a2d;
            border-left: 4px solid #F04400;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .important-note h3 {
            color: #F04400;
            margin: 0 0 10px 0;
            font-size: 16px;
        }
        .important-note p {
            color: #9AA4B2;
            margin: 5px 0;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="ticket-card">
            <div class="header">
                <h1 class="event-name">${orderData.eventName}</h1>
                <p class="event-date">${orderData.eventDate}</p>
            </div>
            
            <div class="divider"></div>
            
            <div class="ticket-details">
                <div class="detail-row">
                    <span class="detail-label">Ticket Holder</span>
                    <span class="detail-value">${orderData.customerName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Ticket Type</span>
                    <span class="detail-value">${orderData.ticketType}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Quantity</span>
                    <span class="detail-value">${orderData.quantity}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Amount Paid</span>
                    <span class="detail-value">${orderData.currency} $${orderData.amountPaid.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="divider"></div>
            
            <div class="qr-section">
                <img src="${qrCodeImage}" alt="QR Code" class="qr-code" />
                <p class="qr-text">Scan this QR code at the entrance</p>
            </div>
            
            <div class="ticket-id">
                TICKET ID: ${orderData.ticketId.toUpperCase().slice(0, 16)}
            </div>
            
            <div class="important-note">
                <h3>⚠️ Important Information</h3>
                <p>• Please arrive 30 minutes before the event starts</p>
                <p>• Present this QR code at the entrance (digital or printed)</p>
                <p>• Each ticket is valid for one entry only</p>
                <p>• No refunds or exchanges</p>
                <p>• ID verification may be required</p>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    Thank you for your purchase!<br>
                    For questions, contact us at support@afroseason.com<br>
                    <br>
                    See you at the event! 🎉
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
}
// ===== CREATE INDIVIDUAL TICKET EMAIL HTML =====
function createIndividualTicketEmail(ticketData, qrCodeImage) {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background: #000000;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: #000000;
            padding: 0;
        }
        .ticket-card {
            background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
            border: 3px solid #FFD700;
            border-radius: 20px;
            overflow: hidden;
            margin: 20px;
            box-shadow: 0 10px 40px rgba(255, 215, 0, 0.3);
        }
        .ticket-header {
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            padding: 30px;
            text-align: center;
            position: relative;
        }
        .ticket-counter {
            position: absolute;
            top: 15px;
            right: 20px;
            background: rgba(0,0,0,0.3);
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            color: #000;
        }
        .event-name {
            font-size: 32px;
            font-weight: bold;
            color: #000000;
            margin: 0;
            text-transform: uppercase;
            letter-spacing: 3px;
        }
        .event-date {
            font-size: 18px;
            color: #000000;
            margin: 10px 0 0 0;
            font-weight: 600;
        }
        .ticket-body {
            padding: 40px 30px;
        }
        .section-divider {
            height: 2px;
            background: linear-gradient(90deg, transparent, #FFD700, transparent);
            margin: 30px 0;
        }
        .detail-grid {
            display: table;
            width: 100%;
            margin: 20px 0;
        }
        .detail-row {
            display: table-row;
        }
        .detail-label {
            display: table-cell;
            color: #999;
            font-size: 14px;
            padding: 12px 0;
            border-bottom: 1px solid #222;
            font-weight: 600;
        }
        .detail-value {
            display: table-cell;
            color: #FFD700;
            font-weight: bold;
            font-size: 16px;
            padding: 12px 0;
            text-align: right;
            border-bottom: 1px solid #222;
        }
        .qr-section {
            text-align: center;
            margin: 30px 0;
            padding: 30px;
            background: #FFFFFF;
            border-radius: 15px;
        }
        .qr-code {
            width: 220px;
            height: 220px;
            margin: 0 auto;
            display: block;
        }
        .qr-text {
            color: #000;
            font-size: 14px;
            margin-top: 15px;
            font-weight: 600;
        }
        .ticket-id-section {
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background: rgba(255, 215, 0, 0.1);
            border-radius: 10px;
        }
        .ticket-id-label {
            color: #999;
            font-size: 12px;
            margin-bottom: 5px;
        }
        .ticket-id {
            font-family: 'Courier New', monospace;
            font-size: 18px;
            color: #FFD700;
            letter-spacing: 3px;
            font-weight: bold;
        }
        .important-box {
            background: rgba(255, 215, 0, 0.05);
            border-left: 4px solid #FFD700;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .important-box h3 {
            color: #FFD700;
            margin: 0 0 15px 0;
            font-size: 18px;
        }
        .important-box ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .important-box li {
            color: #CCC;
            margin: 8px 0;
            font-size: 14px;
            padding-left: 20px;
            position: relative;
        }
        .important-box li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #FFD700;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            padding: 30px;
            background: rgba(255, 215, 0, 0.05);
        }
        .footer-text {
            color: #999;
            font-size: 13px;
            line-height: 1.8;
        }
        .footer-logo {
            font-size: 24px;
            font-weight: bold;
            color: #FFD700;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="ticket-card">
            <div class="ticket-header">
                <div class="ticket-counter">Ticket ${ticketData.ticketNumber}/${ticketData.totalTickets}</div>
                <div class="event-name">${ticketData.eventName}</div>
                <div class="event-date">📅 ${ticketData.eventDate}</div>
            </div>
            
            <div class="ticket-body">
                <div class="section-divider"></div>
                
                <div class="detail-grid">
                    <div class="detail-row">
                        <div class="detail-label">🎫 Ticket Holder</div>
                        <div class="detail-value">${ticketData.customerName}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">🎟️ Ticket Type</div>
                        <div class="detail-value">${ticketData.ticketType}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">🔢 Ticket Number</div>
                        <div class="detail-value">${ticketData.ticketNumber} of ${ticketData.totalTickets}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">💰 Order Total</div>
                        <div class="detail-value">${ticketData.currency} $${ticketData.amountPaid.toFixed(2)}</div>
                    </div>
                </div>
                
                <div class="section-divider"></div>
                
                <div class="qr-section">
                    <img src="${qrCodeImage}" alt="QR Code" class="qr-code" />
                    <p class="qr-text">📱 Scan this code at the venue entrance</p>
                </div>
                
                <div class="ticket-id-section">
                    <div class="ticket-id-label">UNIQUE TICKET ID</div>
                    <div class="ticket-id">${ticketData.ticketId.toUpperCase().slice(0, 16)}</div>
                </div>
                
                <div class="important-box">
                    <h3>⚠️ Important Information</h3>
                    <ul>
                        <li>This is ticket ${ticketData.ticketNumber} of ${ticketData.totalTickets} in your order</li>
                        <li>Each ticket has a unique QR code - do not share</li>
                        <li>Please arrive 30 minutes before the event starts</li>
                        <li>Present this QR code at the entrance (digital or printed)</li>
                        <li>Each ticket is valid for ONE entry only</li>
                        <li>Valid ID may be required at the door</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <div class="footer-logo">AFRO SEASON</div>
                <p class="footer-text">
                    ${ticketData.totalTickets > 1 ? 
                      `You have received ${ticketData.totalTickets} separate ticket emails.<br>Each person must present their individual QR code.<br><br>` : 
                      ''}
                    Thank you for your purchase!<br>
                    For questions: support@afroseason.com
                </p>
            </div>
        </div>
    </div>
</body>
</html>
  `;
}
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// ===== GENERATE PDF TICKET =====
async function generateTicketPDF(ticketData) {
  return new Promise((resolve, reject) => {
    try {
      // Create PDF document
      const doc = new PDFDocument({
        size: [400, 600], // Ticket size
        margins: {top: 0, bottom: 0, left: 0, right: 0},
      });

      const chunks = [];

      // Collect PDF data
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // DESIGN THE PDF TICKET
      // Background
      doc.rect(0, 0, 400, 600).fill("#000000");

      // Gold header
      doc.rect(0, 0, 400, 120)
          .fillAndStroke("#FFD700", "#FFA500")
          .lineWidth(3);

      // Event name
      doc.fillColor("#000000")
          .fontSize(24)
          .font("Helvetica-Bold")
          .text(ticketData.eventName, 20, 30, {
            width: 360,
            align: "center",
          });

      // Event date
      doc.fontSize(14)
          .font("Helvetica")
          .text(ticketData.eventDate, 20, 70, {
            width: 360,
            align: "center",
          });

      // Ticket counter badge
      doc.roundedRect(300, 15, 80, 30, 15)
          .fillOpacity(0.3)
          .fill("#000000")
          .fillOpacity(1);

      doc.fontSize(12)
          .fillColor("#000000")
          .text(
              `${ticketData.ticketNumber}/${ticketData.totalTickets}`,
              300,
              23,
              {width: 80, align: "center"}
          );

      // Ticket details section
      let yPosition = 150;

      // Helper function for details
      const addDetail = (label, value) => {
        doc.fontSize(10)
            .fillColor("#999999")
            .text(label, 30, yPosition);

        doc.fontSize(12)
            .fillColor("#FFD700")
            .font("Helvetica-Bold")
            .text(value, 200, yPosition, {
              width: 170,
              align: "right",
            });

        doc.moveTo(30, yPosition + 20)
            .lineTo(370, yPosition + 20)
            .strokeColor("#222222")
            .stroke();

        yPosition += 35;
      };

      addDetail("Ticket Holder", ticketData.customerName);
      addDetail("Ticket Type", ticketData.ticketType);
      addDetail(
          "Ticket Number",
          `${ticketData.ticketNumber} of ${ticketData.totalTickets}`
      );
      addDetail(
          "Amount Paid",
          `${ticketData.currency} $${ticketData.amountPaid.toFixed(2)}`
      );

      // QR Code section - Convert base64 to buffer
      const qrImageBuffer = Buffer.from(
          ticketData.qrCodeImage.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
      );

      // White background for QR
      doc.roundedRect(100, yPosition + 20, 200, 200, 10).fill("#FFFFFF");

      // Add QR code
      doc.image(qrImageBuffer, 120, yPosition + 40, {
        width: 160,
        height: 160,
      });

      // QR instruction text
      doc.fontSize(10)
          .fillColor("#CCCCCC")
          .font("Helvetica")
          .text("Scan at venue entrance", 30, yPosition + 230, {
            width: 340,
            align: "center",
          });

      // Ticket ID
      doc.roundedRect(50, yPosition + 260, 300, 40, 8)
          .fillOpacity(0.1)
          .fill("#FFD700")
          .fillOpacity(1);

      doc.fontSize(8)
          .fillColor("#999999")
          .text("UNIQUE TICKET ID", 50, yPosition + 267, {
            width: 300,
            align: "center",
          });

      doc.fontSize(12)
          .fillColor("#FFD700")
          .font("Courier-Bold")
          .text(
              ticketData.ticketId.toUpperCase().slice(0, 16),
              50,
              yPosition + 282,
              {
                width: 300,
                align: "center",
              }
          );

      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
