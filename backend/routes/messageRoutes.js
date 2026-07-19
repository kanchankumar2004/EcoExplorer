import express from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
  getUnreadCount,
  deleteMessage,
  deleteConversation,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/unread-count', protect, getUnreadCount);
router.delete('/conversation/:userId', protect, deleteConversation);
router.delete('/:messageId', protect, deleteMessage);
router.get('/:userId', protect, getMessages);
router.post('/', protect, sendMessage);
router.put('/read/:userId', protect, markAsRead);

export default router;
