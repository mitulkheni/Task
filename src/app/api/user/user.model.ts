import { DataTypes, Model, Sequelize } from 'sequelize';
import { hashPassword } from '../../../utils/password';

class User extends Model {
	public id!: number;
	public email!: string;
	public password!: string;

	static async hashPasswordHook(user: User): Promise<void> {
		if (user.changed('password')) {
			user.password = await hashPassword(user.password);
		}
	}
}

export function initUserModel(sequelize: Sequelize): void {
	User.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'User',
			tableName: 'users',
			timestamps: true,
			underscored: true,
			hooks: {
				beforeCreate: User.hashPasswordHook,
				beforeUpdate: User.hashPasswordHook,
			},
		}
	);
}

export default User;
