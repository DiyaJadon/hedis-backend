import express from "express";
import { submitEnquiry } from "../controllers/enquiry.controller.js";

const router = express.Router();

// POST /api/enquiry
router.post("/", submitEnquiry);

export default router;
