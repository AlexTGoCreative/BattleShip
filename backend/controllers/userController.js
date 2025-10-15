import User from '../models/User.js';

/**
 * Handle user connection and registration
 * @param {string} username - The username to register
 * @param {string} socketId - The socket ID for the connection
 * @returns {Object} The created or updated user
 */
export const handleUserConnection = async (username, socketId) => {
  try {
    // Validate username
    if (!username || typeof username !== 'string') {
      throw new Error('Valid username is required');
    }

    const trimmedUsername = username.trim().toLowerCase();
    
    if (trimmedUsername.length < 2) {
      throw new Error('Username must be at least 2 characters long');
    }

    if (trimmedUsername.length > 20) {
      throw new Error('Username must not exceed 20 characters');
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
      throw new Error('Username can only contain letters, numbers, underscores, and hyphens');
    }

    // Check if username is already taken by another online user
    const existingUser = await User.findOne({ 
      username: trimmedUsername, 
      isOnline: true 
    });

    if (existingUser) {
      throw new Error('Username is already taken by an online user');
    }

    // Remove any existing offline user with the same username
    await User.deleteMany({ 
      username: trimmedUsername, 
      isOnline: false 
    });

    // Create new user
    const newUser = new User({
      username: trimmedUsername,
      socketId: socketId,
      isOnline: true,
      lastSeen: new Date()
    });

    const savedUser = await newUser.save();
    console.log(`✅ User registered successfully: ${trimmedUsername}`);
    
    return savedUser;
  } catch (error) {
    console.error('❌ Error in handleUserConnection:', error.message);
    throw error;
  }
};

/**
 * Handle user disconnection
 * @param {string} username - The username to disconnect
 */
export const handleUserDisconnection = async (username) => {
  try {
    if (!username) {
      return;
    }

    const trimmedUsername = username.trim().toLowerCase();
    
    // Find and delete the user
    const deletedUser = await User.findOneAndDelete({ 
      username: trimmedUsername 
    });

    if (deletedUser) {
      console.log(`✅ User removed from database: ${trimmedUsername}`);
    } else {
      console.log(`⚠️ User not found in database: ${trimmedUsername}`);
    }
  } catch (error) {
    console.error('❌ Error in handleUserDisconnection:', error.message);
    throw error;
  }
};

/**
 * Get all online users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getOnlineUsers = async (req, res) => {
  try {
    const onlineUsers = await User.findOnlineUsers();
    res.json({
      success: true,
      count: onlineUsers.length,
      users: onlineUsers
    });
  } catch (error) {
    console.error('❌ Error getting online users:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch online users',
      error: error.message
    });
  }
};

/**
 * Get user statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserStats = async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    const userStats = await User.getUserStats(username.toLowerCase());
    
    if (!userStats) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: userStats
    });
  } catch (error) {
    console.error('❌ Error getting user stats:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
};

/**
 * Check if username is available
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.params;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    const trimmedUsername = username.trim().toLowerCase();
    
    // Validate username format
    if (trimmedUsername.length < 2 || trimmedUsername.length > 20) {
      return res.json({
        success: true,
        available: false,
        message: 'Username must be between 2 and 20 characters'
      });
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
      return res.json({
        success: true,
        available: false,
        message: 'Username can only contain letters, numbers, underscores, and hyphens'
      });
    }

    // Check if username is taken by an online user
    const existingUser = await User.findOne({ 
      username: trimmedUsername, 
      isOnline: true 
    });

    res.json({
      success: true,
      available: !existingUser,
      message: existingUser ? 'Username is already taken' : 'Username is available'
    });
  } catch (error) {
    console.error('❌ Error checking username availability:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to check username availability',
      error: error.message
    });
  }
};

/**
 * Clean up disconnected users (utility function)
 */
export const cleanupDisconnectedUsers = async () => {
  try {
    const result = await User.deleteMany({ isOnline: false });
    console.log(`🧹 Cleaned up ${result.deletedCount} disconnected users`);
  } catch (error) {
    console.error('❌ Error cleaning up disconnected users:', error.message);
  }
};
