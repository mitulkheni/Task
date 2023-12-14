import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import httpStatus from 'http-status';
import * as cron from 'node-cron';
import { testConnection } from './database/connection';
import { UserRouter } from './app/api/user/user.routes';
import { ApiError } from './utils/ApiError';
import { errorConverter, errorHandler } from './utils/error';
import { TaskRouter } from './app/api/tasks/task.routes';
import TaskService from './app/api/tasks/task.service';
const PORT = process.env.PORT || 8000;

dotenv.config();
const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', UserRouter);
app.use('/api/task', TaskRouter);

app.get('/', (req, res) => {
	res.json({ message: 'Hello!!!' });
});

app.use((_req, _res, next) => {
	next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});
app.use(errorConverter);
app.use(errorHandler);

// Cron-Job that runs every day at 8:00 AM to send the reminders
cron.schedule('0 8 * * *', () => {
	console.log('Running job to send reminders...');
	TaskService.sendReminders();
});

async function startServer() {
	try {
		await testConnection();
		app.listen(PORT, () => {
			console.log(`[server]: Server is running at http://localhost:${PORT}`);
		});
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
}

startServer();
