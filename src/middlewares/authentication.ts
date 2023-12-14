import { NextFunction, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { verifyToken } from '../utils/token';

// Middleware function to authenticate the user before sending the response
export const authorizeUser = async (
	req: any,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization as string;

	if (!authHeader) {
		res.status(400).json({ error: 'Authorization header is missing.' });
	}
	const [, token] = authHeader.split(' ');
	if (!token) {
		res.status(404).json({ error: 'Token is missing' });
	}

	try {
		const decodedToken = verifyToken(token) as JwtPayload & { id: string };
		req.user = decodedToken;
		next();
	} catch (error: any) {
		const statusCode = error.status || 500;
		res.status(statusCode).json({ error: error.message });
	}
};
