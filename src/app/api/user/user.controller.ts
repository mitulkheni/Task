import { Request, Response } from 'express';
import UserService from './user.service';

// Create new User
export const createUser = async (req: Request, res: Response) => {
	try {
		const newUser = await UserService.createUser(req.body);
		return res.status(201).json({ data: newUser });
	} catch (error: any) {
		const statusCode = error.status || 500;
		res.status(statusCode).json({ error: error.message });
	}
};

// Login user
export const login = async (req: Request, res: Response) => {
	try {
		const user = await UserService.login(req.body);
		res.status(200).json({ data: user });
	} catch (error: any) {
		const statusCode = error.status || 500;
		res.status(statusCode).json({ error: error.message });
	}
};
