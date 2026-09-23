import { Kafka, Producer, Consumer } from 'kafkajs';

const kafkaBrokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];

export const kafka = new Kafka({
  clientId: 'drinkit-backend',
  brokers: kafkaBrokers,
});

export const producer: Producer = kafka.producer();
export const consumer: Consumer = kafka.consumer({ groupId: 'delivery-tracking-group' });

export const connectKafka = async () => {
  try {
    await producer.connect();
    console.log('✅ Kafka Producer connected');

    await consumer.connect();
    console.log('✅ Kafka Consumer connected');
  } catch (error) {
    console.error('❌ Failed to connect to Kafka:', error);
    // We intentionally don't throw to prevent crashing the server
  }
};
