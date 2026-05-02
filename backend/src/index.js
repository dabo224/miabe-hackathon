import app from './app.js';
import connectDB from './config/database.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Start Express Server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Backend server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`Accessible sur le réseau local à l'adresse : http://192.168.1.192:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
