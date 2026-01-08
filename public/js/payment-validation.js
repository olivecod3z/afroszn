// ============================================
// AFROSZN – STRIPE CHECKOUT HANDLER (CLEAN)
// ============================================

let currentPaymentMethod = "card";

/**
 * Handle Stripe redirect
 */
function handlePayment(event) {
    event.preventDefault();

    const btn = event.target;
    btn.disabled = true;
    btn.textContent = "Redirecting…";

    const params = new URLSearchParams({
        email: sessionStorage.getItem("buyerEmail") || "",
        eventId: sessionStorage.getItem("eventId") || "",
        ticketTier: sessionStorage.getItem("ticketTier") || "",
        quantity: sessionStorage.getItem("quantity") || "1",
    });

    window.location.href =
        "https://australia-southeast1-afroszn-web.cloudfunctions.net/createCheckoutSession?" +
        params.toString();
}

/**
 * Payment method switching (UI only)
 */
function initializePaymentMethods() {
    const options = document.querySelectorAll(".payment-option");
    const cardForm = document.getElementById("paymentForm");
    const gpayBtn = document.getElementById("gpayBtn");
    const applepayBtn = document.getElementById("applepayBtn");
    const paypalBtn = document.getElementById("paypalBtn");

    options.forEach(btn => {
        btn.addEventListener("click", function () {
            options.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            this.querySelector("input").checked = true;

            currentPaymentMethod = this.dataset.method;

            if (cardForm) cardForm.style.display = "none";
            if (gpayBtn) gpayBtn.style.display = "none";
            if (applepayBtn) applepayBtn.style.display = "none";
            if (paypalBtn) paypalBtn.style.display = "none";

            if (currentPaymentMethod === "card" && cardForm) {
                cardForm.style.display = "block";
            }
            if (currentPaymentMethod === "gpay" && gpayBtn) {
                gpayBtn.style.display = "block";
            }
            if (currentPaymentMethod === "applepay" && applepayBtn) {
                applepayBtn.style.display = "block";
            }
            if (currentPaymentMethod === "paypal" && paypalBtn) {
                paypalBtn.style.display = "block";
            }
        });
    });
}

/**
 * Alternative payment buttons → same Stripe flow
 */
function initializeAlternativePaymentButtons() {
    const gpayBtn = document.getElementById("gpayBtn");
    const applepayBtn = document.getElementById("applepayBtn");
    const paypalBtn = document.getElementById("paypalBtn");

    if (gpayBtn) gpayBtn.addEventListener("click", handlePayment);
    if (applepayBtn) applepayBtn.addEventListener("click", handlePayment);
    if (paypalBtn) paypalBtn.addEventListener("click", handlePayment);
}

/**
 * Init
 */
document.addEventListener("DOMContentLoaded", () => {
    initializePaymentMethods();
    initializeAlternativePaymentButtons();
});
