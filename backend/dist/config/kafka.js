"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectKafka = exports.consumer = exports.producer = exports.kafka = void 0;
const kafkajs_1 = require("kafkajs");
const kafkaBrokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];
exports.kafka = new kafkajs_1.Kafka({
    clientId: 'drinkit-backend',
    brokers: kafkaBrokers,
});
exports.producer = exports.kafka.producer();
exports.consumer = exports.kafka.consumer({ groupId: 'delivery-tracking-group' });
const connectKafka = async () => {
    try {
        await exports.producer.connect();
        console.log('✅ Kafka Producer connected');
        await exports.consumer.connect();
        console.log('✅ Kafka Consumer connected');
    }
    catch (error) {
        console.error('❌ Failed to connect to Kafka:', error);
        // We intentionally don't throw to prevent crashing the server
    }
};
exports.connectKafka = connectKafka;
