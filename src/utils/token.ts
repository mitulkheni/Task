import * as jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (payload: object): string => {
	try {
		const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
			expiresIn: process.env.JWT_EXPIRY as string,
		});
		return token;
	} catch (error: any) {
		console.error(error);
		throw new Error(error.message);
	}
};

// Verify JWT token
export const verifyToken = (token: string): string | jwt.JwtPayload => {
	return jwt.verify(token, process.env.JWT_SECRET as string);
};
