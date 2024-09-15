import { Task } from "../types/taskTypes";
export default async function editTaskToDBService(updatedTask: Task) {
	try {
		const response = await fetch(
			`http://localhost:8800/api/task/${updatedTask._id}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedTask),
			}
		);
		if (response.ok) {
			return {
				type: "success",
				message: "Task edited successfully.",
			};
		} else {
			return { type: "error", message: "Failed to edit task." };
		}
	} catch (error) {
		return { type: "error", message: "Fetch error: " + error };
	}
}
