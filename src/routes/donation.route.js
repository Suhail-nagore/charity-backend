import express, { application } from "express";

import { createDonation, donationWebhook } from "../controllers/donation.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createDonation);
router.post("/webhook", express.raw({type:'application/json'}), donationWebhook);

export default router;