import SupportMessage from "../models/supportMessage.js";
import { sendSupportEmails } from "../config/email.js";

// POST /support — submit a support message
export async function submitSupportMessage(req, res) {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email, and message are required" });
        }

        const supportMsg = new SupportMessage({
            name: name.trim(),
            email: email.trim(),
            subject: subject?.trim() || 'general',
            message: message.trim(),
        });
        await supportMsg.save();

        // Send confirmation to user + notification to support inbox
        sendSupportEmails({
            name: name.trim(),
            email: email.trim(),
            subject: subject?.trim() || 'general',
            message: message.trim(),
        }).catch(err => console.error("Email send failed (non-blocking):", err.message));

        res.status(201).json({ message: "Support message submitted successfully" });
    } catch (error) {
        console.error("Error submitting support message:", error);
        res.status(500).json({ message: "Failed to submit support message" });
    }
}
