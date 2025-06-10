import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

//Carga de variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// String de conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	console.error("❌ MONGODB_URI no ha sido definido en las variables de entorno.");
	process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Conexion con MongoDB con configuraciones de tiempo de espera y lógica de reintento
const connectToMongoDB = async () => {
	try {
		await mongoose.connect(MONGODB_URI, {
			serverSelectionTimeoutMS: 60000,
			socketTimeoutMS: 60000,
			connectTimeoutMS: 60000,
			maxPoolSize: 10,
			retryWrites: true,
			w: "majority",
			bufferCommands: false,
		});

		console.log("✅ Conectado a MongoDB");
	} catch (error) {
		console.error("❌ Conexión a MongoDB fallida", error);
		process.exit(1);
	}
};

connectToMongoDB();

// Handle MongoDB connection events
mongoose.connection.on("error", (error) => {
	console.error("❌ Error de conexion con MongoDB :", error);
});

mongoose.connection.on("disconnected", () => {
	console.log("⚠️ MongoDB desconectado. Intentando reconectar...");
	setTimeout(connectToMongoDB, 5000);
});

mongoose.connection.on("reconnected", () => {
	console.log("✅ MongoDB reconectado");
});
