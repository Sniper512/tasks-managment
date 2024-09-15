import express from "express";
import dotenv from "dotenv";
import getAllTasksFromDB from "./database/getAllTasksFromDB.js";
import addTaskToDB from "./database/addTaskToDB.js"; // Make sure this function is imported
import deleteTaskFromDB from "./database/deleteTaskFromDB.js";
import updateTaskToDB from "./database/updateTaskToDB.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Loading the environment variables from .env.local
dotenv.config({ path: path.join(__dirname, ".env.local") });
const app = express();

//Am allowing requests from only one orgin you call allow it from All origins by using * in origin
app.use(cors({
	origin: "http://localhost:5173",
}));

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/api/task", async (req, res) => {
	try {
		const tasks = await getAllTasksFromDB();
		res.json(tasks);
	} catch (error) {
		res.status(500).send("Error fetching tasks");
	}
});

// Handle POST requests to /api/task
app.post("/api/task", async (req, res) => {
	// const { task_id, title, description, priority, status, deadline } = req.body;
	const { task_id, title, description, priority, status, deadline } = req.body;
	console.log("Body is : ",req.body);
	try {
		const response = await addTaskToDB({
			task_id,
			title,
			description,
			priority,
			status,
			deadline,
		});
		if (response.type === "error") {
			return res.status(400).send(response.message);
		} else if (response.type === "success") {
			return res.status(201).send(response.message);
		}
	} catch (error) {
		res.status(400).send(error.message);
	}
});

// Handle PUT requests to /api/task/:id
app.put("/api/task/:id", async (req, res) => {
	// Handle updating a task

	const {task_id, title, description, priority, status, deadline } = req.body;
	try{
		const id = req.params.id;
		const response = await updateTaskToDB({
			task_id,
			title,
			description,
			priority,
			status,
			deadline,
		}, id);
		return res.status(201).send(response.message);
	}
	catch(error){
		console.log("Error:", error.message);
		return res.status(400).send(error.message);
	}
});

// Handle DELETE requests to /api/task/:id

app.delete("/api/task/:id", async (req, res) => {
	// Handle deleting a task
	try{
		const id = req.params.id;
		//console.log("ID:", id);
		const response = await deleteTaskFromDB(id);
		if(response.type === "error"){
			return res.status(400).send(response.message);
		}
		else if(response.type === "success"){
			return res.status(201).send(response.message);
		}
	}
	catch(error){
		console.log("Error:", error.message);
		return res.status(400).send(error.message);
	}
});

app.listen(process.env.PORT, () => {
	console.log("Server running on http://localhost:" + process.env.PORT);
});
