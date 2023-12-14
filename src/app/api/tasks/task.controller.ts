import { Request, Response } from 'express';
import TaskService from './task.service';

// Create new task
export const createTask = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const newTask = await TaskService.createTask(req.user, req.body);
		return res.status(201).json({ data: newTask });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

// Delete task by id
export const deleteTask = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const deleteTask = await TaskService.deleteTask(req.user, req.params.id);
		return res.status(200).json({ data: deleteTask });
	} catch (error: any) {
		const statusCode = error.status || 500;
		res.status(statusCode).json({ error: error.message });
	}
};

// List all the tasks for authenticated user
export const listAllTasks = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const taskList = await TaskService.listTasks(req.user);
		return res.status(200).json({ data: taskList });
	} catch (error: any) {
		res.status(error.status).json({ error: error.message });
	}
};

// Update task details by id
export const updateTask = async (req: Request, res: Response) => {
	try {
		const updateTask = await TaskService.updateTask(
			// @ts-ignore
			req.user,
			req.params.id,
			req.body
		);
		return res.status(200).json({ data: updateTask });
	} catch (error: any) {
		const statusCode = error.status || 500;
		res.status(statusCode).json({ error: error.message });
	}
};

// Mark task as Completed for given task id
export const markTaskAsCompleted = async (req: Request, res: Response) => {
	try {
		const taskCompleted = await TaskService.markTaskCompleted(
			// @ts-ignore
			req.user,
			req.params.id
		);
		return res.status(200).json({ data: taskCompleted });
	} catch (error: any) {
		const statusCode = error.status || 500;
		res.status(statusCode).json({ error: error.message });
	}
};

// List single task detail
export const listTaskDetail = async (req: Request, res: Response) => {
	try {
		// @ts-ignore
		const task = await TaskService.getTaskDetail(req.user, req.params.id);
		return res.status(200).json({ data: task });
	} catch (error: any) {
		res.status(error.status).json({ error: error.message });
	}
};
