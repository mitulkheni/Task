import { genSalt, hash, compare } from 'bcryptjs';

// Hash the user auth password before saving it to the database
export const hashPassword = async (password: string): Promise<string> => {
	const salt = await genSalt(10);
	return await hash(password, salt);
};

// Verify the password while logging-in
export const verifyPassword = async (
	password: string,
	hashedPassword: string
): Promise<boolean> => {
	return await compare(password, hashedPassword);
};
