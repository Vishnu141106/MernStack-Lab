require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartstudy';

// Middleware
app.use(cors({
  origin: '*', // Allow frontend to connect smoothly
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Health check / MongoDB Status endpoint
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: isConnected ? 'online' : 'database_disconnected',
    database: 'smartstudy',
    collection: 'tasks',
    mongoUri: MONGO_URI,
    readyState: mongoose.connection.readyState,
    readyStateText: isConnected ? 'Connected to local MongoDB' : 'Disconnected from local MongoDB'
  });
});

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'SmartStudy Backend API is running',
    database: 'smartstudy',
    mongoUri: MONGO_URI,
    endpoints: {
      getAllTasks: 'GET /api/tasks',
      getSingleTask: 'GET /api/tasks/:id',
      createTask: 'POST /api/tasks',
      updateTask: 'PUT /api/tasks/:id',
      deleteTask: 'DELETE /api/tasks/:id',
      healthCheck: 'GET /api/health'
    }
  });
});

// Connect to Local MongoDB
// The backend connects using: mongoose.connect(process.env.MONGO_URI)
console.log('Connecting to Local MongoDB at:', MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('=============================================');
    console.log(' Successfully connected to Local MongoDB!');
    console.log(` Database:   smartstudy`);
    console.log(` Collection: tasks`);
    console.log(` URI:        ${MONGO_URI}`);
    console.log('=============================================');
  })
  .catch((err) => {
    console.error('=============================================');
    console.error(' MongoDB Connection Error:', err.message);
    console.error(' [Troubleshooting on Windows]');
    console.error(' 1. Check if MongoDB service is running:');
    console.error('    Open Command Prompt (as Administrator) and run:');
    console.error('    net start MongoDB');
    console.error(' 2. Or start mongod manually:');
    console.error('    mongod --dbpath "C:\\data\\db"');
    console.error(' 3. Open MongoDB Compass and connect to:');
    console.error(`    ${MONGO_URI}`);
    console.error('=============================================');
  });

// Start Express Server
app.listen(PORT, () => {
  console.log(` Express server listening on http://localhost:${PORT}`);
});
