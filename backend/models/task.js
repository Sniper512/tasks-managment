import mongoose from "mongoose";
import { ObjectId } from "mongodb";
const { Schema, model, models } = mongoose;

const TaskSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true,
		},
		task_id: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		priority: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
		deadline: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
		_id: false,
	}
);

const TaskModel = models.task || model("task", TaskSchema);

export default TaskModel;
