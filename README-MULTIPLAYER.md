# 🚢 Battleship Multiplayer 

A real-time multiplayer naval combat game built with JavaScript, WebSockets, and MongoDB. Challenge friends to epic battles on the high seas!

![Battleship Multiplayer](./src/images/final-project-screenshot.png)

## ✨ Features

### 🎮 Multiplayer Gameplay
- **Real-time battles** with WebSocket communication
- **Live player invitations** and matchmaking
- **Turn-based combat** with instant feedback
- **Automatic game cleanup** when players disconnect

### 🏗️ Modern Architecture
- **Express.js backend** with Socket.IO for real-time communication
- **MongoDB database** for user and game management
- **Responsive UI** with modern CSS and animations
- **Modular frontend** with ES6 modules

### 🎨 Enhanced UI/UX
- **Glassmorphism design** with beautiful gradients
- **Smooth animations** and transitions
- **Real-time notifications** system
- **Mobile-responsive** layout
- **Dark theme** with neon accents

### 🔐 User Management
- **Simple username-based** authentication
- **Auto-cleanup** of users on page exit
- **Online status** tracking
- **Session management** with automatic expiration

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd battleship-multiplayer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up MongoDB**
   
   **Option A: Local MongoDB**
   - Install MongoDB locally
   - Start MongoDB service
   - Database will be created automatically

   **Option B: MongoDB Atlas (Cloud)**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string
   - Set environment variable:
     ```bash
     export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/battleship-multiplayer"
     ```

4. **Start the application**
   ```bash
   npm start
   ```

   This will start both the server and client development servers:
   - **Server**: http://localhost:3000
   - **Client**: http://localhost:8080 (auto-opens)

### Alternative Start Methods

**Development (separate terminals):**
```bash
# Terminal 1 - Server
npm run server

# Terminal 2 - Client  
npm run client
```

**Production build:**
```bash
npm run build
npm run server
```

## 🎯 How to Play

### 1. **Join the Battle**
   - Enter a unique username (3-20 characters)
   - Connect to the multiplayer lobby

### 2. **Find an Opponent**
   - See all online players in the lobby
   - Send an invitation to challenge someone
   - Accept incoming invitations from other players

### 3. **Set Up Your Fleet**
   - Place your ships on the 10x10 grid:
     - **Carrier** (5 cells)
     - **Battleship** (4 cells)  
     - **Destroyer** (3 cells)
     - **Submarine** (3 cells)
     - **Patrol Boat** (2 cells)
   - Use manual placement or auto-placement
   - Click "Ready for Battle!" when done

### 4. **Battle!**
   - Take turns attacking your opponent's grid
   - Click on enemy waters to fire
   - First to sink all enemy ships wins!

## 🏗️ Project Structure

```
battleship-multiplayer/
├── server/                 # Backend server
│   └── server.js          # Express + Socket.IO server
├── src/                   # Frontend source
│   ├── dom_module/        # UI components
│   │   ├── login-screen.js
│   │   ├── lobby-screen.js
│   │   └── multiplayer-game-setup.js
│   ├── services/          # Client services
│   │   └── socket-client.js
│   ├── styles/            # CSS styles
│   │   └── multiplayer.css
│   ├── main-multiplayer.js # App entry point
│   └── ...               # Game logic files
├── dist/                  # Built files
├── __tests__/            # Test files
└── webpack configs       # Build configuration
```

## 🔧 Configuration

### Environment Variables

```bash
# Server Configuration
PORT=3000                    # Server port (default: 3000)
NODE_ENV=development         # Environment mode

# Database Configuration  
MONGODB_URI=mongodb://localhost:27017/battleship-multiplayer
```

### MongoDB Collections

The app automatically creates these collections:

- **`users`** - Online players (auto-expires after 24h)
- **`games`** - Active games (auto-expires after 2h)  
- **`invitations`** - Game invitations (auto-expires after 5min)

## 🛠️ Development

### Available Scripts

```bash
npm start          # Start both server and client
npm run server     # Start server only
npm run client     # Start client only (webpack dev server)
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Lint code
npm run format     # Format code with Prettier
```

### Adding Features

1. **New UI Screen**: Add to `src/dom_module/`
2. **Game Logic**: Extend existing classes in `src/`
3. **Server Events**: Add to `server/server.js`
4. **Client Events**: Update `src/services/socket-client.js`

### Testing

```bash
# Run all tests
npm test

# Watch mode for development
npm run watch-tests

# Test specific file
npm test game-board.test.js
```

## 🌐 Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set environment variables**
   ```bash
   export NODE_ENV=production
   export MONGODB_URI="your-production-mongodb-uri"
   export PORT=3000
   ```

3. **Start the server**
   ```bash
   npm run server
   ```

### Deployment Platforms

**Heroku:**
- Connect your MongoDB Atlas cluster
- Set environment variables in Heroku dashboard
- Deploy with Git push

**DigitalOcean/AWS:**
- Use PM2 for process management
- Set up reverse proxy with Nginx
- Configure SSL certificates

**Vercel/Netlify:**
- For static client-only deployment
- Requires separate server hosting

## 🔍 Troubleshooting

### Common Issues

**Connection Failed**
- Check MongoDB connection string
- Verify MongoDB service is running
- Check firewall settings

**Players Can't Connect**
- Verify server is running on correct port
- Check WebSocket connection in browser dev tools
- Ensure CORS is properly configured

**Game Not Starting**
- Both players must click "Ready for Battle!"
- Check that all ships are placed
- Verify WebSocket connection is stable

### Debug Mode

Enable debug logging:
```javascript
// In browser console
localStorage.setItem('debug', 'socket.io-client:*');
location.reload();
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Test multiplayer functionality with multiple browser tabs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **The Odin Project** - Original curriculum inspiration
- **Socket.IO** - Real-time communication
- **MongoDB** - Database solution
- **Material Design Icons** - UI icons
- Original Battleship game concept

## 🆚 Single Player vs Multiplayer

This project includes both versions:

- **Single Player** (`src/main.js`) - Original game vs AI
- **Multiplayer** (`src/main-multiplayer.js`) - Real-time PvP

Switch between them by changing the webpack entry point in `webpack.common.js`.

---

**Ready to battle? Deploy your fleet and challenge players worldwide!** ⚓🌊
