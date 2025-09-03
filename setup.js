#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

console.log('🚢 Battleship Multiplayer Setup');
console.log('================================\n');

async function checkNodeVersion() {
  try {
    const { stdout } = await execAsync('node --version');
    const version = stdout.trim();
    const majorVersion = parseInt(version.slice(1).split('.')[0]);
    
    if (majorVersion < 16) {
      console.log('❌ Node.js version 16 or higher is required');
      console.log(`   Current version: ${version}`);
      console.log('   Please upgrade Node.js from https://nodejs.org/');
      process.exit(1);
    }
    
    console.log(`✅ Node.js ${version} detected`);
  } catch (error) {
    console.log('❌ Node.js not found. Please install from https://nodejs.org/');
    process.exit(1);
  }
}

async function checkMongoDB() {
  try {
    await execAsync('mongod --version');
    console.log('✅ MongoDB detected locally');
    return true;
  } catch (error) {
    console.log('⚠️  MongoDB not detected locally');
    console.log('   You can either:');
    console.log('   1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/');
    console.log('   2. Use MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
    console.log('   3. The app will try to connect to mongodb://localhost:27017 by default\n');
    return false;
  }
}

async function installDependencies() {
  console.log('📦 Installing dependencies...');
  try {
    await execAsync('npm install');
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.log('❌ Failed to install dependencies');
    console.log('   Please run: npm install');
    process.exit(1);
  }
}

async function createDirectories() {
  const dirs = ['dist', 'logs'];
  
  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
      console.log(`✅ Created ${dir}/ directory`);
    }
  }
}

async function createEnvFile() {
  try {
    await fs.access('.env');
    console.log('✅ .env file already exists');
  } catch {
    const envContent = `# Battleship Multiplayer Environment Configuration

# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/battleship-multiplayer

# Optional: Debug logging
# DEBUG=socket.io:*`;

    await fs.writeFile('.env', envContent);
    console.log('✅ Created .env file with default configuration');
  }
}

async function showStartupInstructions() {
  console.log('\n🎮 Setup Complete! Ready to start playing!');
  console.log('==========================================\n');
  
  console.log('To start the multiplayer game:');
  console.log('  npm start');
  console.log('');
  
  console.log('Or start components separately:');
  console.log('  npm run server   # Start backend server');
  console.log('  npm run client   # Start frontend (in another terminal)');
  console.log('');
  
  console.log('The game will be available at:');
  console.log('  🌐 http://localhost:8080 (frontend)');
  console.log('  🔌 http://localhost:3000 (backend API)');
  console.log('');
  
  console.log('MongoDB connection:');
  console.log('  📁 Local: Check .env file for MONGODB_URI');
  console.log('  🌐 Atlas: Update MONGODB_URI in .env file');
  console.log('  ⚙️  Default: mongodb://localhost:27017/battleship-multiplayer');
  console.log('');
  
  console.log('For development:');
  console.log('  npm test         # Run tests');
  console.log('  npm run lint     # Check code quality');
  console.log('  npm run format   # Format code');
  console.log('');
  
  console.log('🎯 Open multiple browser tabs to test multiplayer functionality!');
  console.log('⚓ Enjoy your naval battles!');
}

async function main() {
  try {
    await checkNodeVersion();
    await checkMongoDB();
    await installDependencies();
    await createDirectories();
    await createEnvFile();
    await showStartupInstructions();
  } catch (error) {
    console.error('Setup failed:', error.message);
    process.exit(1);
  }
}

main();
