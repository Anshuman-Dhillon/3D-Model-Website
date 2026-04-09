import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send a support confirmation email to the user and a notification to the team.
 */
export async function sendSupportEmails({ name, email, subject, message }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP not configured — skipping email send");
    return;
  }

  const subjectLabels = {
    general: "General Inquiry",
    billing: "Billing & Payments",
    technical: "Technical Issue",
    account: "Account Help",
    report: "Report a Problem",
    feedback: "Feedback & Suggestions",
  };
  const topicLabel = subjectLabels[subject] || subject;

  // 1. Confirmation email to the user
  await transporter.sendMail({
    from: `"3DModeller Support" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `We received your message — ${topicLabel}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #0f172a; color: #e2e8f0; border-radius: 12px;">
        <h2 style="color: #60a5fa; margin-top: 0;">Hi ${name},</h2>
        <p>Thanks for reaching out! We've received your <strong>${topicLabel}</strong> message and our team will get back to you within <strong>24 hours</strong>.</p>
        <div style="background: #1e293b; border-radius: 8px; padding: 16px; margin: 20px 0; border-left: 3px solid #3b82f6;">
          <p style="margin: 0; color: #94a3b8; font-size: 14px;"><strong>Your message:</strong></p>
          <p style="margin: 8px 0 0; color: #cbd5e1; font-size: 14px; white-space: pre-wrap;">${message}</p>
        </div>
        <p style="color: #64748b; font-size: 13px;">— The 3DModeller Team</p>
      </div>
    `,
  });

  // 2. Internal notification to the support inbox
  const supportInbox = process.env.SUPPORT_EMAIL || process.env.SMTP_USER;
  await transporter.sendMail({
    from: `"3DModeller System" <${process.env.SMTP_USER}>`,
    to: supportInbox,
    subject: `[Support] ${topicLabel} — from ${name}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 560px; padding: 24px;">
        <h3 style="margin-top: 0;">New Support Message</h3>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 6px 12px 6px 0; color: #666; font-weight: 600;">Name</td><td style="padding: 6px 0;">${name}</td></tr>
          <tr><td style="padding: 6px 12px 6px 0; color: #666; font-weight: 600;">Email</td><td style="padding: 6px 0;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 6px 12px 6px 0; color: #666; font-weight: 600;">Topic</td><td style="padding: 6px 0;">${topicLabel}</td></tr>
        </table>
        <div style="background: #f8f9fa; border-radius: 6px; padding: 16px; margin-top: 16px; border-left: 3px solid #3b82f6;">
          <p style="margin: 0; white-space: pre-wrap;">${message}</p>
        </div>
      </div>
    `,
  });
}

/**
 * Send an email notification when a user receives a new message.
 */
export async function sendMessageNotificationEmail({ recipientEmail, recipientName, senderName, messageText, modelName }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP not configured — skipping message notification email");
    return;
  }

  const preview = messageText.length > 200 ? messageText.substring(0, 200) + "…" : messageText;
  const context = modelName ? `about <strong>${modelName}</strong>` : "via direct message";
  const siteUrl = process.env.CLIENT_URL || "http://localhost:5173";

  await transporter.sendMail({
    from: `"3DModeller" <${process.env.SMTP_USER}>`,
    to: recipientEmail,
    subject: `New message from ${senderName} — 3DModeller`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #0f172a; color: #e2e8f0; border-radius: 12px;">
        <h2 style="color: #60a5fa; margin-top: 0;">New Message</h2>
        <p>Hi <strong>${recipientName}</strong>,</p>
        <p><strong style="color: #60a5fa;">${senderName}</strong> sent you a message ${context}:</p>
        <div style="background: #1e293b; border-radius: 8px; padding: 16px; margin: 20px 0; border-left: 3px solid #3b82f6;">
          <p style="margin: 0; color: #cbd5e1; font-size: 14px; white-space: pre-wrap; line-height: 1.6;">${preview}</p>
        </div>
        <a href="${siteUrl}/messages" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-weight: 600; margin-top: 8px;">View Messages</a>
        <p style="color: #64748b; font-size: 13px; margin-top: 24px;">You're receiving this because you have email notifications enabled. You can change this in your <a href="${siteUrl}/settings/notifications" style="color: #60a5fa;">notification settings</a>.</p>
      </div>
    `,
  });
}
