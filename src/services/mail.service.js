import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEnquiryMail = async (enquiry) => {
  try {
    const isProduct = enquiry.type === "product";

    const subject = isProduct
      ? `[HEDIS] 🛒 Product Enquiry - ${enquiry.product}`
      : `[HEDIS] 📩 General Enquiry`;

    const html = isProduct
      ? `
        <div style="font-family:Arial,sans-serif;">
          <h2 style="color:#2563eb;">🛒 Product Enquiry</h2>

          <p><strong>Product:</strong> ${enquiry.product}</p>
          <hr/>

          <p><strong>Name:</strong> ${enquiry.name}</p>
          <p><strong>Email:</strong> ${enquiry.email}</p>
          <p><strong>Phone:</strong> ${enquiry.phone}</p>
          <p><strong>Organization:</strong> ${enquiry.organization || "-"}</p>
          <p><strong>Category:</strong> ${enquiry.category || "-"}</p>

          <p><strong>Message:</strong></p>
          <p>${enquiry.message}</p>
        </div>
      `
      : `
        <div style="font-family:Arial,sans-serif;">
          <h2 style="color:#f59e0b;">📩 General Enquiry</h2>

          <p><strong>Name:</strong> ${enquiry.name}</p>
          <p><strong>Email:</strong> ${enquiry.email}</p>
          <p><strong>Phone:</strong> ${enquiry.phone}</p>
          <p><strong>Organization:</strong> ${enquiry.organization || "-"}</p>
          <p><strong>Category:</strong> ${enquiry.category || "-"}</p>

          <p><strong>Message:</strong></p>
          <p>${enquiry.message}</p>
        </div>
      `;

    const response = await resend.emails.send({
      from: "onboarding@resend.dev", // ✅ test sender
      to: process.env.ADMIN_EMAIL,   // ✅ your email
      reply_to: enquiry.email,
      subject,
      html,
    });

    console.log("✅ Email sent:", response);

    return true;

  } catch (error) {
    console.error("❌ Email failed:", error);
    return false;
  }
};