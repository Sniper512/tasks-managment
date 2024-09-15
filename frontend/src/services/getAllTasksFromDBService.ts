import { Task } from "../types/taskTypes";
export default async function getAllTasksFromDBService() {
	try {
		const response = await fetch("http://localhost:8800/api/task");
		if (!response.ok) {
			return {
				type: "error",
				message: "Fetch error while getting tasks from db",
				data: [],
			};
		}
		const data = (await response.json()) as Task[];
		return {
			type: "success",
			data: data,
			message: "Tasks fetched successfully",
		};
	} catch (error) {
		return {
			type: "error",
			message: "Fetch error while getting tasks from db: " + error,
			data: [],
		};
	}
}
