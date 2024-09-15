type props = {
	id: string;
};
export default async function deleteTaskFromDBService({ id }: props) {
	try {
		const response = await fetch(`http://localhost:8800/api/task/${id}`, {
			method: "DELETE",
		});
		if (response.ok) {
			return { type: "success", message: "Task deleted successfully" };
		} else {
			return { type: "error", message: "Failed to delete task" };
		}
	} catch (error) {
		return {
			type: "error",
			message: "Fetch error while deleting task from db: " + error,
		};
	}
}
