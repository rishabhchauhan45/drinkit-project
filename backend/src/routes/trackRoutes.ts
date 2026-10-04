import express from 'express';
import { producer } from '../config/kafka';

const router = express.Router();

router.post('/simulate', async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'orderId is required' });
    }

    // Starting coordinates (e.g., store location)
    let lat = 12.9716;
    let lng = 77.5946;

    let step = 0;
    const interval = setInterval(async () => {
      step++;
      // Simulate movement
      lat += 0.0001 * (Math.random() > 0.5 ? 1 : -1) + 0.0002;
      lng += 0.0001 * (Math.random() > 0.5 ? 1 : -1) + 0.0002;

      try {
        await producer.send({
          topic: 'delivery-location-updates',
          messages: [
            {
              value: JSON.stringify({
                orderId,
                partnerId: 'simulate-partner-123',
                lat,
                lng,
                timestamp: new Date().toISOString()
              })
            }
          ]
        });
        console.log(`[Simulator] Pushed location for order ${orderId}: ${lat}, ${lng}`);
      } catch (err) {
        console.error('Failed to push to Kafka:', err);
      }

      if (step >= 20) {
        clearInterval(interval);
        console.log(`[Simulator] Finished simulation for order ${orderId}`);
      }
    }, 3000);

    res.status(200).json({ success: true, message: 'Simulation started for order ' + orderId });
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ success: false, error: 'Simulation failed to start' });
  }
});

export default router;
