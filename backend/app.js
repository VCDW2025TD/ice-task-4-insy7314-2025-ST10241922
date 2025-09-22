// backend/src/server.js
const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const app = require('./app');

const PORT = process.env.PORT || 5000;

// SSL options - expects backend/ssl/privatekey.pem and backend/ssl/certificate.pem
const sslOptions = {
  key: fs.existsSync(path.resolve(__dirname, '../ssl/privatekey.pem'))
    ? fs.readFileSync(path.resolve(__dirname, '../ssl/privatekey.pem'))
    : null,
  cert: fs.existsSync(path.resolve(__dirname, '../ssl/certificate.pem'))
    ? fs.readFileSync(path.resolve(__dirname, '../ssl/certificate.pem'))
    : null,
};

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not set in environment. Exiting.');
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI, {
    // these options can be adjusted
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    if (sslOptions.key && sslOptions.cert) {
      https.createServer(sslOptions, app).listen(PORT, () => {
        console.log(Secure server running at https://localhost:${PORT});
      });
    } else {
      // Fallback to HTTP if SSL files are missing (makes local testing easier)
      const http =   require('http');
      http.createServer(app).listen(PORT, () => {
        console.log(Server running at http://localhost:${PORT} (no SSL files found));
      });
    }
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });