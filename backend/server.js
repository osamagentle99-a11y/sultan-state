
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import propertyRoutes from './routes/propertyRoutes.js';
dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.get('/', (req, res) => {
  res.json({ message: 'SULTAN Real Estate API - ALL OVER KARACHI', logo: 'سلطان', version: '1.0 - MERN Stack', endpoints: { properties: '/api/properties', verify: '/api/properties/verify/:plotNo' } });
});
app.use('/api/properties', propertyRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`SULTAN Server running on port ${PORT} - ALL OVER KARACHI`));
