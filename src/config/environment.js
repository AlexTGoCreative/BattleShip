// Environment configuration for different deployment environments

const config = {
  development: {
    API_URL: 'http://localhost:3000',
    SOCKET_URL: 'http://localhost:3000',
    NODE_ENV: 'development'
  },
  production: {
    // These will be set by the hosting platform
    API_URL: window.location.origin,
    SOCKET_URL: window.location.origin,
    NODE_ENV: 'production'
  }
};

// Detect environment - check if we're running on localhost or production
const isLocalhost = window.location.hostname.includes('localhost') || 
                    window.location.hostname.includes('127.0.0.1') ||
                    window.location.hostname.includes('0.0.0.0');

const isProduction = !isLocalhost;

const currentEnv = isProduction ? 'production' : 'development';

console.log(`🌍 Environment: ${currentEnv}`, {
  hostname: window.location.hostname,
  protocol: window.location.protocol,
  origin: window.location.origin,
  config: config[currentEnv]
});

export default config[currentEnv];