import { Op } from 'sequelize';
import Task from './task.model';
import NodeCache from 'node-cache';
import { DATA_CONSTANTS } from '../../../utils/constants';
import { sendToRabbitMQ } from '../../../utils/Rabbitmq';
const taskCache = new NodeCache({ stdTTL: 300 });

class TaskService {
	static taskCompletionRequests: any[] = [];
	static isProcessing: boolean = false;

	static async createTask(user: any, data: any): Promise<Task> {
		try {
			const task = await Task.create({ ...data, userId: user.id });
			taskCache.set(task.id.toString(), task);
			return task;
		} catch (error: any) {
			console.log(error);
			throw new Error(error.message);
		}
	}

	static async deleteTask(user: any, id: string): Promise<any> {
		try {
			const taskDeleted = await Task.destroy({
				where: {
					userId: user.id,
					id,
				},
			});
			if (taskDeleted === 0) {
				const error = new Error('No task found to delete.');
				(error as any).status = 404;
				throw error;
			}
			taskCache.del(id.toString());
			return 'Task deleted.';
		} catch (error: any) {
			throw error;
		}
	}

	static async listTasks(user: any): Promise<any> {
		try {
			const cachedTasks = taskCache.keys();
			if (cachedTasks.length > 0) {
				const cachedTaskValues = taskCache.mget(cachedTasks);
				return Object.values(cachedTaskValues);
			}

			const taskList = await Task.findAll({
				where: {
					userId: user.id,
				},
			});

			taskList.forEach((task) => {
				taskCache.set(task.id.toString(), task);
			});

			return taskList;
		} catch (error: any) {
			throw error;
		}
	}

	static async updateTask(
		user: any,
		taskId: string,
		updatedTaskData: any
	): Promise<any> {
		try {
			const [updatedRowsCount, updatedRows] = await Task.update(
				updatedTaskData,
				{
					where: { id: taskId, userId: user.id },
					returning: true,
				}
			);

			if (updatedRowsCount > 0) {
				const updatedTask = updatedRows[0];
				taskCache.set(taskId.toString(), updatedTask);

				return updatedTask;
			} else {
				const error = new Error('Task not found or not updated.');
				(error as any).status = 404;
				throw error;
			}
		} catch (error: any) {
			throw error;
		}
	}

	static async markTaskCompleted(user: any, taskId: string): Promise<any> {
		try {
			const updatedTask = await Task.findOne({
				where: { id: taskId, userId: user.id },
			});

			if (!updatedTask) {
				const error = new Error(
					'Task not found or not authorized to mark as completed.'
				);
				(error as any).status = 404;
				throw error;
			}
			updatedTask.status = DATA_CONSTANTS.TASK_STATUS_COMPLETED;
			if (this.taskCompletionRequests.length < 10000) {
				await updatedTask.save();
			} else {
				this.taskCompletionRequests.push({ taskId });

				if (!this.isProcessing) {
					this.isProcessing = true;
					await this.processTaskCompletionRequests();
				}
			}

			return updatedTask;
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	// Function for remiders of task that is pending and needs to be completed within 24 hours
	// PS: I am *NOT* sending any email or SMS for reminder I am just logging it to the console
	static async sendReminders() {
		try {
			const twentyFourHoursFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);

			const upcomingTasks = await Task.findAll({
				where: {
					dueDate: {
						[Op.lt]: twentyFourHoursFromNow,
					},
					status: 'Pending',
				},
			});

			for (const task of upcomingTasks) {
				console.log(
					`Send reminder for task: ${task.title} - ${task.description} - Due Date: ${task.dueDate}`
				);
			}
		} catch (error) {
			console.error('Error sending reminders:', error);
		}
	}

	// Process the tasks by sending it to the rabbitmq
	static async processTaskCompletionRequests(): Promise<void> {
		try {
			sendToRabbitMQ(this.taskCompletionRequests);
			this.taskCompletionRequests = [];
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	static async getTaskDetail(user: any, id: string): Promise<any> {
		try {
			const cachedTask = taskCache.get(id.toString());

			if (cachedTask !== undefined) {
				return cachedTask;
			}

			const task = await Task.findOne({
				where: {
					userId: user.id,
					id,
				},
			});

			if (task) {
				taskCache.set(id.toString(), task);
			}

			return task;
		} catch (error: any) {
			throw error;
		}
	}
}

export default TaskService;
