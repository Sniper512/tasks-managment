import { Task } from "../types/taskTypes";

export default async function addTaskToDBService(newTask: Task) {
	try {
		const response = await fetch("http://localhost:8800/api/task", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newTask),
		});
		if (response.ok) {
			return { type: "success", message: "Task added successfully" };
		} else {
			return { type: "error", message: "Failed to add task" };
		}
	} catch (error) {
		return {
			type: "error",
			message: "Fetch error while adding task to db: " + error,
		};
	}
}
