import express from 'express'
import { registerUser, loginUser, getUserProfile, updateUserProfile } from '../controllers/user.controller.js'
import { protect } from '../middleware/auth.js'

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router;