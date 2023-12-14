import * as amqp from 'amqplib/callback_api';
import { DATA_CONSTANTS } from './constants';

// RabbitMq connection
amqp.connect(process.env.RABBITMQ_URL as string, (error, connection) => {
	if (error) {
		throw new Error(`RabbitMQ connection error: ${error.message}`);
	}

	connection.createChannel((channelError, channel) => {
		if (channelError) {
			throw new Error(
				`RabbitMQ channel creation error: ${channelError.message}`
			);
		}

		const queue = DATA_CONSTANTS.RABBITMQ_QUEUE;
		channel.assertQueue(queue, { durable: true });

		channel.consume(queue, (message) => {
			if (message) {
				const taskData = JSON.parse(message.content.toString());
				console.log(`Task completion request for task ID: ${taskData.taskId}`);
				channel.ack(message);
			}
		});
	});
});

// Function to send the tasks to rabbitmq
export function sendToRabbitMQ(tasks: any[]): void {
	amqp.connect(process.env.RABBITMQ_URL as string, (error, connection) => {
		if (error) {
			throw new Error(`RabbitMQ connection error: ${error.message}`);
		}

		connection.createChannel((channelError, channel) => {
			if (channelError) {
				throw new Error(
					`RabbitMQ channel creation error: ${channelError.message}`
				);
			}

			const queue = DATA_CONSTANTS.RABBITMQ_QUEUE;

			channel.assertQueue(queue, { durable: true });
			for (const task of tasks) {
				channel.sendToQueue(queue, Buffer.from(JSON.stringify(task)), {
					persistent: true,
				});
			}
		});
	});
}
