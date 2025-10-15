import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    minlength: [2, 'Username must be at least 2 characters long'],
    maxlength: [20, 'Username must not exceed 20 characters'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens']
  },
  socketId: {
    type: String,
    required: true,
    unique: true
  },
  isOnline: {
    type: Boolean,
    default: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  gamesPlayed: {
    type: Number,
    default: 0
  },
  gamesWon: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  toJSON: {
    transform: function(doc, ret) {
      // Remove sensitive data when converting to JSON
      delete ret.socketId;
      delete ret.__v;
      return ret;
    }
  }
});

// Index for faster queries
userSchema.index({ username: 1 });
userSchema.index({ socketId: 1 });
userSchema.index({ isOnline: 1 });

// Instance methods
userSchema.methods.updateLastSeen = function() {
  this.lastSeen = new Date();
  return this.save();
};

userSchema.methods.incrementGamesPlayed = function() {
  this.gamesPlayed += 1;
  return this.save();
};

userSchema.methods.incrementGamesWon = function() {
  this.gamesWon += 1;
  return this.save();
};

// Static methods
userSchema.statics.findByUsername = function(username) {
  return this.findOne({ username: username });
};

userSchema.statics.findOnlineUsers = function() {
  return this.find({ isOnline: true }).select('-socketId');
};

userSchema.statics.getUserStats = function(username) {
  return this.findOne({ username }).select('username gamesPlayed gamesWon createdAt lastSeen');
};

// Pre-save middleware
userSchema.pre('save', function(next) {
  if (this.isModified('username')) {
    // Convert username to lowercase for consistency
    this.username = this.username.toLowerCase();
  }
  next();
});

// Pre-remove middleware to clean up when user is deleted
userSchema.pre('remove', function(next) {
  console.log(`🗑️ Removing user: ${this.username}`);
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
