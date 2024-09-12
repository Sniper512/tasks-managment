import connectTODB from "../config/mongooseConnection.js";
import TaskModel from "../models/task.js";

export default async function getAllTasksFromDB() {
	try {
		// Ensure DB connection is established
		await connectTODB(); // If this returns a promise, await it

		// Fetch tasks
		const tasks = await TaskModel.find({});

		// Return an empty array if no tasks are found
		return tasks || [];
	} catch (error) {
		// Log and handle the error
		console.error("Error fetching tasks:", error);
		return [];
	}
}
