import mongoose from "mongoose";

const connectTODB = async () => {
	if (mongoose.connection.readyState >= 1) return;

	try {
		// Hardcoding the connection string
		await mongoose.connect("mongodb://localhost:27017/task-management");
		
		console.log("Connected to DB");
	} catch (error) {
		console.error("Error connecting to DB:", error);
		throw error;
	}
};

export default connectTODB;
