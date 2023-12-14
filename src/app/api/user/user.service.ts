import { verifyPassword } from '../../../utils/password';
import { generateToken } from '../../../utils/token';
import User from './user.model';

class UserService {
	static async createUser(data: any): Promise<{ user: User; token: string }> {
		try {
			const existingUser = await User.findOne({ where: { email: data.email } });
			if (existingUser) {
				const error = new Error('Email already exists.');
				(error as any).status = 409;
				throw error;
			}

			const user = await User.create({ ...data });

			const payload = { id: user.id };
			const token = generateToken(payload);
			const userWithoutPassword = user.toJSON();
			delete userWithoutPassword.password;

			return { user: userWithoutPassword, token };
		} catch (error: any) {
			throw error;
		}
	}

	static async login(data: any): Promise<{ user: User; token: string }> {
		try {
			const { email, password } = data;
			const user = await User.findOne({
				where: { email },
				attributes: { exclude: ['createdAt', 'updatedAt'] },
			});
			if (!user) {
				const error = new Error('User not found.');
				(error as any).status = 404;
				throw error;
			}

			const validatePassword = await verifyPassword(password, user!.password);
			if (!validatePassword) {
				const error = new Error('Wrong password.');
				(error as any).status = 401;
				throw error;
			}

			const payload = { id: user!.id };
			const token = generateToken(payload);
			const userWithoutPassword = user!.toJSON();
			delete userWithoutPassword.password;

			return { user: userWithoutPassword, token };
		} catch (error: any) {
			console.error(error);
			throw error;
		}
	}
}

export default UserService;
