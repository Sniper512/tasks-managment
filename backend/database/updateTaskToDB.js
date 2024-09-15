import connectTODB from "../config/mongooseConnection.js";
import TaskModel from "../models/task.js";

export default async function updateTaskToDB(
  Updated_data,
  id
) {
  try {
  
    await connectTODB();
    const result = await TaskModel.findByIdAndUpdate(
      id,
      Updated_data,
      {
        new: true,
      }
    );
    return {
      type: "success",
      message: "Task updated successfully",
    };
  } catch (error) {
    console.error("Error updating task:", error);
    return {
      type: "error",
      message: "Error updating task",
    };
  }
}
