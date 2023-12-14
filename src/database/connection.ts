import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
import { initUserModel } from '../app/api/user/user.model';
import { initTaskModel } from '../app/api/tasks/task.model';
dotenv.config({ path: './.env.development' });

const dbConfig = {
	database: process.env.DATABASE_NAME as string,
	username: process.env.DATABASE_USERNAME as string,
	password: process.env.DATABASE_PASSWORD as string,
	host: process.env.DATABASE_HOST as string,
	port: process.env.DATABASE_PORT as string,
};

const sequelize = new Sequelize(
	dbConfig.database,
	dbConfig.username,
	dbConfig.password,
	{
		host: dbConfig.host,
		dialect: 'postgres',
		port: Number(dbConfig.port),
		logging: false,
	}
);
initUserModel(sequelize);
initTaskModel(sequelize);

// Database connection function
export async function testConnection() {
	try {
		await sequelize.authenticate();
		console.log('Connection has been established successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
}

// Synchronnise the User and task schema
sequelize
	.sync({ force: false })
	.then(() => {
		console.log('All models were synchronized successfully.');
	})
	.catch((error: Error) => {
		console.error('An error occurred while synchronizing models:', error);
	});
