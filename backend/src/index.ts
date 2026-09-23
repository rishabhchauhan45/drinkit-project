import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { connectDB } from './config/database';
import { initSocket } from './controllers/socket';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';
import deliveryRoutes from './routes/deliveryRoutes';
import couponRoutes from './routes/couponRoutes';
import aiRoutes from './routes/aiRoutes';
import paymentRoutes from './routes/paymentRoutes';
import { paymentController } from './controllers/paymentController';
import { errorHandler } from './middleware/errorHandler';
import { connectKafka } from './config/kafka';
import { startDeliveryLocationConsumer } from './services/kafkaConsumer';

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development'
};

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(morgan('dev'));

// Webhook must be parsed as raw body for signature verification
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), paymentController.webhookHandler);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/coupons', couponRoutes);

// 404 handler for unknown API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    errors: []
  });
});

app.use(errorHandler);

connectDB().then(async () => {
  initSocket(server);
  await connectKafka();
  await startDeliveryLocationConsumer();
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});

// Restart nodemon
