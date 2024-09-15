import mongoose from "mongoose";

const connectTODB = async () => {
	if (mongoose.connection.readyState >= 1) return;

	try {
		await mongoose.connect(process.env.MONGODB_URI);
	} catch (error) {
		console.error("Error connecting to DB:", error);
		throw error;
	}
};

export default connectTODB;
