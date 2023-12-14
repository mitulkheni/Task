import express from 'express';
import {
	createTask,
	deleteTask,
	listAllTasks,
	updateTask,
	markTaskAsCompleted,
	listTaskDetail,
} from './task.controller';
import { authorizeUser } from '../../../middlewares/authentication';

const router = express.Router();

// Task Routes
router.post('/create', authorizeUser, createTask);
router.delete('/delete/:id', authorizeUser, deleteTask);
router.get('/list', authorizeUser, listAllTasks);
router.get('/detail/:id', authorizeUser, listTaskDetail);
router.patch('/update/:id', authorizeUser, updateTask);
router.patch('/mark/complete/:id', authorizeUser, markTaskAsCompleted);

export const TaskRouter = router;
