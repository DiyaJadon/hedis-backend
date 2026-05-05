import nodemailer from "nodemailer";

export const sendEnquiryMail = async (enquiry) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Verify connection
    await transporter.verify();
    console.log("✅ Mail server is ready");

    // ================= DETERMINE TYPE =================
    const isProduct = enquiry.type === "product";

    // ================= SUBJECT =================
    const subject = isProduct
      ? `[HEDIS] 🛒 Product Enquiry - ${enquiry.product}`
      : `[HEDIS] 📩 General Enquiry`;

    // ================= EMAIL CONTENT =================
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

    // ================= MAIL OPTIONS =================
    const mailOptions = {
      from: `"HEDIS Website" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // ✅ fallback
      replyTo: enquiry.email,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);

    return true;

  } catch (error) {
    console.error("❌ Mail error:", error);
    return false;
  }
};