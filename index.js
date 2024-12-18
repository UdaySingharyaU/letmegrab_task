import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';

// Database connection & synchronization
import { sequelize, configConnection } from './config/connection.config.js';

// Routes
import employeeRoutes from './routes/employee.route.js';
import departmentRoutes from './routes/department.route.js';

dotenv.config();

const app = express();


// Middleware
app.use(cors()); // Allow all origins
app.use(express.json()); // Parse JSON request body
app.use(xss()); // Clean XSS attacks
app.use(mongoSanitize()); // Sanitize data to prevent MongoDB operator injection
app.use(cookieParser()); // Parse cookies

// Test Route
app.get('/', (req, res) => {
  res.status(200).send('Welcome to Node.js with SQL!');
});

// Routes
app.use('/api/employee', employeeRoutes);
app.use('/api/department', departmentRoutes);

// Sync Database & Start Server
sequelize.sync({ force: false }) // force: false prevents dropping tables if they exist
  .then(() => {
    app.listen(3000 || process.env.PORT, () => {
      console.log(`Server running on port ${ 3000 || process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error syncing the database:', error);
  });

// Connect to Database
configConnection.connect();

export default app;
