# 🎮 Battleship User Registration System Setup

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** installed and running locally
3. **NPM** (comes with Node.js)

## 🗄️ MongoDB Setup

### Option 1: MongoDB Community Server (Recommended)
1. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Windows (as Administrator)
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   # or
   brew services start mongodb-community
   ```

### Option 2: MongoDB with Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🚀 Running the Application

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the application**:
   ```bash
   npm start
   ```
   
   This will start both:
   - **Backend server** on `http://localhost:3000`
   - **Frontend client** on `http://localhost:8080`

## 🔧 Environment Configuration

Create a `.env` file in the root directory (optional):
```env
MONGODB_URI=mongodb://localhost:27017/battleship
PORT=3000
NODE_ENV=development
SOCKET_CORS_ORIGIN=http://localhost:8080
```

## 🎯 How It Works

### User Registration Flow:
1. **Page Load**: Connection status indicator appears
2. **Auto-Connect**: Frontend automatically connects to backend server
3. **Registration Modal**: User enters username (2-20 characters, alphanumeric + _ -)
4. **Validation**: Real-time username validation and availability check
5. **Database Storage**: User stored in MongoDB with socket connection
6. **Game Access**: User can now play the game

### Auto-Cleanup:
- **On Disconnect**: User is automatically removed from database
- **On Browser Close**: Socket disconnect triggers user cleanup
- **On Manual Logout**: User can manually logout (removes from DB)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Frontend      │◄──►│   Backend       │◄──►│   MongoDB       │
│   (React-like)  │    │   (Express.js)  │    │   (Local DB)    │
│                 │    │                 │    │                 │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • User UI       │    │ • Socket.IO     │    │ • User Schema   │
│ • Socket Client │    │ • REST API      │    │ • Auto-cleanup  │
│ • Registration  │    │ • User Manager  │    │ • Validation    │
│ • Game Logic    │    │ • MongoDB Conn  │    │ • Indexing      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔌 API Endpoints

### REST API:
- `GET /api/users/online` - Get all online users
- `GET /api/users/check/:username` - Check username availability
- `GET /api/users/stats/:username` - Get user statistics
- `POST /api/users/cleanup` - Manual cleanup utility

### Socket Events:
- `register-user` - Register new user
- `logout` - Manual logout
- `user-joined` - Broadcast when user joins
- `user-left` - Broadcast when user leaves
- `disconnect` - Auto-cleanup on disconnect

## 🔍 Testing the System

1. **Open Multiple Browsers**: Test with different browser windows
2. **Username Validation**: Try invalid characters, too short/long names
3. **Duplicate Names**: Attempt to register same username twice
4. **Connection Status**: Check connection indicator behavior
5. **Auto-Cleanup**: Close browser and verify user is removed
6. **Online Users**: See real-time user list updates

## 🛠️ Troubleshooting

### MongoDB Connection Issues:
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"

# Start MongoDB if not running (Windows)
net start MongoDB

# Check MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### Port Conflicts:
- Backend runs on port 3000
- Frontend runs on port 8080
- MongoDB runs on port 27017

### Common Errors:
1. **"Connection failed"**: MongoDB not running
2. **"Port 3000 in use"**: Another app using port 3000
3. **"Registration failed"**: Username validation error

## 📊 Database Schema

```javascript
User: {
  username: String,      // 2-20 chars, alphanumeric + _ -
  socketId: String,      // Unique socket connection ID
  isOnline: Boolean,     // Connection status
  lastSeen: Date,        // Last activity timestamp
  gamesPlayed: Number,   // Game statistics
  gamesWon: Number,      // Win count
  createdAt: Date,       // Account creation
  updatedAt: Date        // Last update
}
```

## 🎮 Features

✅ **Real-time Registration**: Instant username validation  
✅ **Auto-Cleanup**: Users deleted on disconnect  
✅ **Online Users**: Live player count and list  
✅ **Connection Status**: Visual connection feedback  
✅ **Input Validation**: Comprehensive username rules  
✅ **Error Handling**: User-friendly error messages  
✅ **Modern UI**: Beautiful registration modal  
✅ **Socket Integration**: Real-time communication  

The user registration system is now fully integrated with your modern Battleship game! 🚀⚓
