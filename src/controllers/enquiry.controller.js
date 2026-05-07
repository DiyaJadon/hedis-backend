import db from "../database/db.js";
import { sendEnquiryMail } from "../services/mail.service.js";

export const submitEnquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      organization,
      category,
      message,
      product,
      type,
    } = req.body;

    // ================= DATABASE SAVE =================
    db.prepare(`
      INSERT INTO enquiries
      (name, email, phone, organization, category, message, product, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      email,
      phone,
      organization || "",
      category || "",
      message,
      product || "",
      type || "general"
    );

    // ================= INSTANT RESPONSE =================
    res.json({
      success: true,
      message: "Enquiry submitted successfully",
    });

    // ================= SEND EMAIL IN BACKGROUND =================
    sendEnquiryMail({
      name,
      email,
      phone,
      organization,
      category,
      message,
      product,
      type,
    });

  } catch (error) {
    console.error("❌ ENQUIRY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit enquiry",
    });
  }
};