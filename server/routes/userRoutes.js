import express from 'express';
import { 
  getOnlineUsers, 
  getUserStats, 
  checkUsernameAvailability,
  cleanupDisconnectedUsers
} from '../controllers/userController.js';

const router = express.Router();

/**
 * @route GET /api/users/online
 * @desc Get all online users
 * @access Public
 */
router.get('/online', getOnlineUsers);

/**
 * @route GET /api/users/stats/:username
 * @desc Get user statistics
 * @access Public
 */
router.get('/stats/:username', getUserStats);

/**
 * @route GET /api/users/check/:username
 * @desc Check if username is available
 * @access Public
 */
router.get('/check/:username', checkUsernameAvailability);

/**
 * @route POST /api/users/cleanup
 * @desc Clean up disconnected users (admin utility)
 * @access Public (in production, this should be protected)
 */
router.post('/cleanup', async (req, res) => {
  try {
    await cleanupDisconnectedUsers();
    res.json({
      success: true,
      message: 'Cleanup completed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Cleanup failed',
      error: error.message
    });
  }
});

export default router;
