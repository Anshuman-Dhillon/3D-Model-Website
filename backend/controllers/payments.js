import Stripe from "stripe";
import Model from "../models/model.js";
import User from "../models/user.js";

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

// POST /transactions/checkout — create a Stripe Checkout Session for cart items
export async function checkout(req, res) {
    if (!stripe) return res.status(503).json({ message: "Stripe is not configured" });
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate("orders.items");
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.orders.items.length) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Build Stripe line items from cart
        const lineItems = user.orders.items.map(model => ({
            price_data: {
                currency: "usd",
                product_data: {
                    name: model.name,
                    description: model.description?.substring(0, 500) || "3D Model",
                },
                unit_amount: Math.round(model.price * 100), // cents
            },
            quantity: 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.CLIENT_URL}/transactions?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
            metadata: {
                userId: userId.toString(),
                modelIds: JSON.stringify(user.orders.items.map(m => m._id.toString())),
            },
        });

        res.status(200).json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error("Error during checkout:", error);
        res.status(500).json({ message: "Checkout failed", error: error.message });
    }
}

// POST /transactions/webhook — Stripe webhook to fulfill orders
export async function stripeWebhook(req, res) {
    if (!stripe) return res.status(503).json({ message: "Stripe is not configured" });
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return res.status(400).json({ message: `Webhook Error: ${err.message}` });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const { userId, modelIds } = session.metadata;

        try {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            const parsedModelIds = JSON.parse(modelIds);

            for (const modelId of parsedModelIds) {
                const model = await Model.findById(modelId);
                if (!model) continue;

                user.transaction_history.push({
                    userId: user._id,
                    modelId: model._id,
                    modelName: model.name,
                    platform: "Stripe",
                    amount: model.price,
                    currency: "USD",
                    status: "completed",
                    metadata: {
                        stripeSessionId: session.id,
                        stripePaymentIntentId: session.payment_intent,
                    },
                });
                user.purchased_models.push(model._id);
            }

            // Clear cart
            user.orders.items = [];
            user.orders.total_cost = 0;
            await user.save();
        } catch (err) {
            console.error("Error fulfilling order:", err);
        }
    }

    res.status(200).json({ received: true });
}

// POST /transactions/confirm — confirm order after Stripe redirect (fallback for no webhook)
export async function confirmCheckout(req, res) {
    if (!stripe) return res.status(503).json({ message: "Stripe is not configured" });
    try {
        const { sessionId } = req.body;
        const userId = req.user.id;

        if (!sessionId) return res.status(400).json({ message: "Session ID required" });

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== "paid") {
            return res.status(400).json({ message: "Payment not completed" });
        }

        // Check if already fulfilled to prevent double-processing
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const alreadyFulfilled = user.transaction_history.some(
            t => t.metadata?.stripeSessionId === sessionId
        );

        if (alreadyFulfilled) {
            return res.status(200).json({ message: "Order already fulfilled", transactions: user.transaction_history });
        }

        // Fulfill the order
        const parsedModelIds = JSON.parse(session.metadata.modelIds);

        const transactions = [];
        for (const modelId of parsedModelIds) {
            const model = await Model.findById(modelId);
            if (!model) continue;

            const transaction = {
                userId: user._id,
                modelId: model._id,
                modelName: model.name,
                platform: "Stripe",
                amount: model.price,
                currency: "USD",
                status: "completed",
                metadata: {
                    stripeSessionId: sessionId,
                    stripePaymentIntentId: session.payment_intent,
                },
            };
            user.transaction_history.push(transaction);
            user.purchased_models.push(model._id);
            transactions.push(transaction);
        }

        user.orders.items = [];
        user.orders.total_cost = 0;
        await user.save();

        res.status(200).json({ message: "Checkout confirmed", transactions });
    } catch (error) {
        console.error("Error confirming checkout:", error);
        res.status(500).json({ message: "Confirmation failed", error: error.message });
    }
}

// GET /transactions — get user's transaction history
export async function getTransactions(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user.transaction_history);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Error fetching transactions" });
    }
}