const express = require('express');
const AppDataSource = require('./db/dataSource');
const config = require('./utils/environment');
const middleWare = require('./middleware'); // all middlewares bundled
const router = require('./utils/router');

async function startServer() {
  try {
    // Initialize DB connection
    await AppDataSource.authenticate();
    console.log('✅ Database connected successfully!');

    // Create express app
    const app = express();

    // Register all middlewares dynamically
    Object.values(middleWare).forEach((mw) => app.use(mw));

    // Routes
    router(app);

    // Start server
    const server = app.listen(config.PORT || 9000, () => {
      console.log(`🚀 Server running on port ${config.PORT || 9000}`);
    });

    // Keep-alive configs
    server.keepAliveTimeout = 76 * 1000;
    server.headersTimeout = 77 * 1000;

  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

// Start app
startServer();
