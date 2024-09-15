import z from "zod";
import TaskModel from "../models/task.js";
import mongoose from "mongoose";
import connectTODB from "../config/mongooseConnection.js";

const taskSchema = z.object({
  task_id: z.string().min(1, "TaskId cannot be empty"),
  title: z.string().min(1, "Title cannot be empty"),
  description: z.string().min(1, "Description cannot be empty"),
  priority: z.string().min(1, "Priority cannot be empty"),
  status: z
    .string()
    .min(1, "Status cannot be empty")
    .refine(
      (value) => ["ToDo", "InProgress", "Done"].includes(value),
      "Invalid status"
    ),
  deadline: z.string().min(1, "Deadline cannot be empty"),
});

export default async function addTaskToDB({
  task_id,
  title,
  description,
  priority,
  status,
  deadline,
}) {
  try {
    await connectTODB();
    const taskData = taskSchema.parse({
      task_id,
      title,
      description,
      priority,
      status,
      deadline,
    });

    const _id = new mongoose.Types.ObjectId();
    taskData._id = _id;

    // Converting deadline to a Date object if it's a string
    taskData.deadline = new Date(taskData.deadline);

    // Saving the task to the DB
    const task = await TaskModel.create(taskData);

    return {
      type: "success",
      message: "Task added successfully",
    };
  } catch (error) {
    console.error("Error at DB: ", error);
    if (error instanceof z.ZodError) {
      return {
        type: "error",
        message: error.errors,
      };
    }
    return {
      type: "error",
      message: "Error creating task at DB",
    };
  }
}
