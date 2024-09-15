import connectTODB from "../config/mongooseConnection.js";
import TaskModel from "../models/task.js";

export default async function deleteTaskFromDB(task_id) {
  try {
    await connectTODB();
    const task = await TaskModel.findOneAndDelete({ _id: task_id });
    return {
      type: "success",
      message: "Task deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting task:", error);
    return {
      type: "error",
      message: "Error deleting task",
    };
  }
}
