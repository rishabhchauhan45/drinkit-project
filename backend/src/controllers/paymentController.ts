import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { prisma } from '../config/database';
import { Product } from '../models/Product';
import { Inventory } from '../models/Inventory';
import { emitOrderUpdate } from './socket';

const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || ''
  });
};

export const paymentController = {
  async createOrder(req: any, res: any) {
    try {
      const { orderId } = req.body;
      const order = await prisma.order.findUnique({ where: { id: orderId } });

      if (!order) {
        return res.status(404).json({ success: false, error: 'Order not found' });
      }
      if (order.userId !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }

      const amountInPaise = Math.round(order.totalAmount * 100);

      const razorpay = getRazorpayInstance();
      const razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: order.id
      });

      // Check if payment already exists
      const existingPayment = await prisma.payment.findFirst({
        where: { orderId: order.id, status: 'PENDING' }
      });

      if (existingPayment) {
        await prisma.payment.update({
          where: { id: existingPayment.id },
          data: { razorpayOrderId: razorpayOrder.id, amount: order.totalAmount }
        });
      } else {
        await prisma.payment.create({
          data: {
            orderId: order.id,
            razorpayOrderId: razorpayOrder.id,
            amount: order.totalAmount,
            status: 'PENDING'
          }
        });
      }

      res.status(200).json({
        success: true,
        data: {
          razorpayOrderId: razorpayOrder.id,
          amount: amountInPaise,
          currency: 'INR',
          keyId: process.env.RAZORPAY_KEY_ID
        }
      });
    } catch (error: any) {
      console.error('Create Razorpay Order Error:', error);
      res.status(500).json({ success: false, error: 'Failed to create payment order' });
    }
  },

  async verifyPayment(req: any, res: any) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order || order.userId !== req.user.id) {
        return res.status(403).json({ success: false, error: 'Unauthorized' });
      }

      const payment = await prisma.payment.findFirst({
        where: { orderId: order.id, razorpayOrderId: razorpay_order_id }
      });

      if (!payment) {
        return res.status(404).json({ success: false, error: 'Payment record not found' });
      }

      if (payment.status === 'PAID') {
        return res.status(200).json({ success: true, message: 'Already verified' });
      }

      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(body.toString())
        .digest('hex');

      if (expectedSignature === razorpay_signature) {
        // Payment is authentic
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'PAID',
            razorpayPaymentId: razorpay_payment_id
          }
        });

        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'CONFIRMED',
            paymentStatus: 'PAID'
          }
        });

        emitOrderUpdate(order.id, { status: 'CONFIRMED', message: 'Payment successful, order confirmed' });

        return res.status(200).json({ success: true, message: 'Payment verified successfully' });
      } else {
        return res.status(400).json({ success: false, error: 'Invalid signature' });
      }
    } catch (error: any) {
      console.error('Verify Payment Error:', error);
      res.status(500).json({ success: false, error: 'Payment verification failed' });
    }
  },

  async webhookHandler(req: Request, res: Response) {
    try {
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
      const signature = req.headers['x-razorpay-signature'] as string;
      const body = req.body; // should be buffer or string because of raw body parser

      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');

      if (expectedSignature !== signature) {
        return res.status(400).json({ success: false, error: 'Invalid webhook signature' });
      }

      const payload = JSON.parse(body.toString());
      const event = payload.event;
      const paymentEntity = payload.payload.payment.entity;

      if (event === 'payment.captured') {
        const rzpOrderId = paymentEntity.order_id;
        const payment = await prisma.payment.findFirst({ where: { razorpayOrderId: rzpOrderId } });
        if (payment && payment.status !== 'PAID') {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'PAID', razorpayPaymentId: paymentEntity.id }
          });
          await prisma.order.update({
            where: { id: payment.orderId },
            data: { status: 'CONFIRMED', paymentStatus: 'PAID' }
          });
          emitOrderUpdate(payment.orderId, { status: 'CONFIRMED', message: 'Payment captured' });
        }
      } else if (event === 'payment.failed') {
        const rzpOrderId = paymentEntity.order_id;
        const payment = await prisma.payment.findFirst({ where: { razorpayOrderId: rzpOrderId } });
        if (payment && payment.status !== 'FAILED') {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'FAILED', failureReason: paymentEntity.error_description }
          });
          // Note: we do not cancel the order automatically to allow retry, or we could cancel it and restore inventory.
          // Let's keep it PENDING, just update payment status.
        }
      }

      res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('Webhook Error:', error);
      res.status(500).json({ success: false, error: 'Webhook processing failed' });
    }
  }
};
