import { DataTypes, Model, Sequelize } from 'sequelize';
import User from '../user/user.model';
import { DATA_CONSTANTS } from '../../../utils/constants';

class Task extends Model {
	public id!: number;
	public title!: string;
	public description!: string;
	public dueDate!: Date;
	public status!: string;
	public userId!: number;

	static associate(models: any) {
		Task.belongsTo(models.User, { foreignKey: 'userId' });
	}
}

export function initTaskModel(sequelize: Sequelize): void {
	Task.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			description: {
				type: DataTypes.STRING,
			},
			dueDate: {
				type: DataTypes.DATE,
			},
			status: {
				type: DataTypes.ENUM(
					DATA_CONSTANTS.TASK_STATUS_PENDING,
					DATA_CONSTANTS.TASK_STATUS_COMPLETED
				),
				defaultValue: DATA_CONSTANTS.TASK_STATUS_PENDING,
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'Task',
			tableName: 'tasks',
			timestamps: true,
			underscored: true,
		}
	);
	Task.associate({ User });
}

export default Task;
