// Environment configuration for different deployment environments

const config = {
  development: {
    API_URL: 'http://localhost:3001',
    SOCKET_URL: 'http://localhost:3001',
    NODE_ENV: 'development'
  },
  production: {
    // Use environment variable or fallback to default Render URL
    API_URL: process.env.BACKEND_URL || 'https://battleship-backend-your-app.onrender.com',
    SOCKET_URL: process.env.BACKEND_URL || 'https://battleship-backend-your-app.onrender.com',
    NODE_ENV: 'production'
  }
};

// Detect environment - check if we're running on localhost or production
const isLocalhost = window.location.hostname.includes('localhost') || 
                    window.location.hostname.includes('127.0.0.1') ||
                    window.location.hostname.includes('0.0.0.0') ||
                    window.location.hostname.includes('192.168.');

const isProduction = !isLocalhost;
const currentEnv = isProduction ? 'production' : 'development';

console.log(`🌍 Environment: ${currentEnv}`, {
  hostname: window.location.hostname,
  protocol: window.location.protocol,
  origin: window.location.origin,
  backendURL: config[currentEnv].API_URL,
  config: config[currentEnv]
});

export default config[currentEnv];