import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is provided
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  No MONGODB_URI provided. Running without database connection.');
      console.log('💡 To connect to MongoDB, add MONGODB_URI to your .env file');
      return null;
    }

    // Clear any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection options for MongoDB Atlas
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      // Timeout settings - more generous for cloud connections
      serverSelectionTimeoutMS: 30000, // 30 seconds for Atlas
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 30000, // 30 seconds
      
      // Buffer settings
      bufferCommands: false,
      
      // Connection pool settings for Atlas
      maxPoolSize: 10,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
      
      // Additional Atlas-specific options
      ssl: true,
      authSource: 'admin'
    });

    console.log(`✅ MongoDB Atlas Connected Successfully!`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState}`);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB Atlas');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB Atlas');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 Mongoose reconnected to MongoDB Atlas');
    });

    // Handle process termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    
    // Provide specific error guidance
    if (error.message.includes('authentication failed')) {
      console.log('🔐 Authentication Error: Check your username and password');
    } else if (error.message.includes('network')) {
      console.log('🌐 Network Error: Check your internet connection and MongoDB Atlas network access');
    } else if (error.message.includes('timeout')) {
      console.log('⏱️  Timeout Error: MongoDB Atlas might be slow to respond');
    }
    
    console.log('💡 Troubleshooting tips:');
    console.log('   1. Verify your MongoDB Atlas connection string');
    console.log('   2. Check if your IP address is whitelisted in Atlas');
    console.log('   3. Ensure your Atlas cluster is running');
    console.log('   4. Verify username and password are correct');
    
    // Return null instead of throwing to allow server to continue
    return null;
  }
};

export default connectDB;