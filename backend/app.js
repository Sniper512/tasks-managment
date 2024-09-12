import express from "express";
import dotenv from "dotenv";
import getAllTasksFromDB from "./database/getAllTasksFromDB.js";
import addTaskToDB from "./database/addTaskToDB.js"; // Make sure this function is imported

const app = express();
dotenv.config();

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
	const { task_id, title, description, priority, status, deadline } = req.query;

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
});

// Handle DELETE requests to /api/task/:id
app.delete("/api/task/:id", async (req, res) => {
	// Handle deleting a task
});

app.listen(process.env.PORT, () => {
	console.log("Server running on http://localhost:" + process.env.PORT);
});
