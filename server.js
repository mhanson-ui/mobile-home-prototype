const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8000;

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static files from the root directory
app.use(express.static('.'));

// Simple health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Handle SPA routing - serve index.html for any route that doesn't match a file
app.get('*', (req, res) => {
  // If the request is for a specific file that exists, let express.static handle it
  if (req.path.includes('.')) {
    return res.status(404).send('File not found');
  }
  
  // For routes without extensions, serve index.html
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Mobile Home Prototype server running on port ${port}`);
  console.log(`📱 Access the demo launcher at http://localhost:${port}`);
  console.log(`🎯 Try the experiences:`);
  console.log(`   • Balanced: http://localhost:${port}/demo_balanced/`);
  console.log(`   • Sports: http://localhost:${port}/demo_sports/`);
});
