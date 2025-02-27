// server.js - Backend for TheraBot
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(cors({
  // Allow requests from GitHub Pages
  origin: ['http://localhost:3000', 'http://localhost:3002', 'https://yourusername.github.io'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Serve static files from the build folder for production
app.use(express.static(path.join(__dirname, 'build')));

// Initialize Anthropic client
let anthropic;
try {
  const Anthropic = require('@anthropic-ai/sdk');
  anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
  console.log('Anthropic SDK initialized successfully with method 1');
} catch (error) {
  try {
    const { Anthropic } = require('@anthropic-ai/sdk');
    anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    console.log('Anthropic SDK initialized successfully with method 2');
  } catch (innerError) {
    console.error('Failed to initialize Anthropic SDK:', innerError);
  }
}

// Route to handle chat requests
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;
    
    console.log('Received request with system prompt:', systemPrompt);
    console.log('Number of messages:', messages.length);
    
    if (!anthropic) {
      throw new Error('Anthropic client was not initialized properly');
    }
    
    // Make the API call to Claude
    const response = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      system: systemPrompt || "You are TheraBot, a helpful, empathetic AI assistant focused on providing supportive conversations.",
      messages: messages,
      max_tokens: 4000,
    });
    
    console.log('Claude API response received');
    console.log('Response structure:', Object.keys(response));
    
    // Send the response back to the client
    res.json(response);
  } catch (error) {
    console.error('Error calling Claude API:', error);
    console.error('Error details:', error.message);
    
    // Send detailed error information back to the client
    res.status(500).json({ 
      error: error.message,
      details: error.toString(),
      stack: error.stack
    });
  }
});

// Serve the React app for any other routes in production
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Key configured: ${process.env.ANTHROPIC_API_KEY ? 'Yes' : 'No'}`);
});