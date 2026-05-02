import express from 'express';
import { register, login, updateProfile, changePassword, registerParent, loginParent } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/profile', updateProfile);
router.post('/change-password', changePassword);

// Parent routes
router.post('/parent/register', registerParent);
router.post('/parent/login', loginParent);

export default router;
