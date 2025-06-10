import mongoose, { Document, Schema } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";

//Carga de variables de entorno
dotenv.config();

// Declaracion de Interfaces de tipos
/**
 * Interfaz para el documento de Producto.
 * Extiende mongoose.Document para incluir propiedades como _id y métodos de Mongoose.
 * 'precio' y 'precioBase' ahora están tipados como 'number'.
 * Las propiedades opcionales se marcan con '?'.
 */
interface IProducto extends Document {
	_id: mongoose.Types.ObjectId;
	categoria: string;
	descripcion: string;
	imagen: string;
	marca: string;
	nombre: string;
	precio: number;
	precioBase: number;
	rating: number;
	sku: string;
	stock: number;
	// Propiedades añadidas dinámicamente en el endpoint GET /api/productos
	precioOriginal?: number;
	tienePrecioEspecial?: boolean;
}

/**
 * Interfaz para el documento de PrecioEspecial.
 * Extiende mongoose.Document.
 */
interface IPrecioEspecial extends Document {
	idUsuario: string;
	idProducto: string;
	precioEspecial: number;
	notas?: string;
	createdAt: Date;
	updatedAt: Date;
}

// --- Configuración de Express y Mongoose ---
const app = express();
// Utilizamos un operador de fusión nulo (??) para asegurar un valor por defecto si process.env.PORT es undefined
const PORT = parseInt(process.env.PORT ?? "0", 10);
// Si PORT=0, Node asignará un puerto libre aleatorio

// MongoDB string de la variable de entorno
// Aseguramos que MONGODB_URI esté definido, de lo contrario, mostramos un error y salimos del proceso
const MONGODB_URI: string | undefined = process.env.MONGODB_URI;

if (!MONGODB_URI) {
	console.error("❌ MONGODB_URI environment variable is not set");
	process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Conexion con MongoDB con configuraciones de tiempo de espera y lógica de reintento
const connectToMongoDB = async (): Promise<void> => {
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

// Manejo de eventos de conexión a MongoDB
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

// --- Schemas y Modelos ---
// Schema de la coleccion de productos (read-only)
// Usamos la interfaz IProducto para tipar el esquema y el modelo
const ProductoSchema: Schema = new mongoose.Schema<IProducto>({}, { collection: "productos", strict: false });
const Producto = mongoose.model<IProducto>("Producto", ProductoSchema);

// Schema para la coleccion de precios especiales
// Esta colección permite a los usuarios definir precios especiales para productos específicos
// Usamos la interfaz IPrecioEspecial para tipar el esquema y el modelo
const PrecioEspecialSchema: Schema = new mongoose.Schema<IPrecioEspecial>(
	{
		idUsuario: {
			type: String,
			required: true,
			trim: true,
		},
		idProducto: {
			type: String,
			required: true,
			trim: true,
		},
		precioEspecial: {
			type: Number,
			required: true,
			min: 0,
		},
		notas: {
			type: String,
			default: "",
			trim: true,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ collection: "preciosEspecialesNeudert42" }
);

// Crear un índice compuesto para consultas rápidas
PrecioEspecialSchema.index({ idUsuario: 1, idProducto: 1 }, { unique: true });

const PrecioEspecial = mongoose.model<IPrecioEspecial>("PrecioEspecial", PrecioEspecialSchema);

// --- Rutas de la API ---

// GET /api/productos
app.get("/api/productos", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	if (mongoose.connection.readyState !== 1) {
		res.status(503).json({ success: false, message: "DB no disponible.", error: "MongoDB no conectado" });
		return;
	}

	try {
		const { idUsuario } = req.query as { idUsuario?: string };
		const productos = await Producto.find().maxTimeMS(30000).lean<IProducto[]>();

		if (idUsuario) {
			const especiales = await PrecioEspecial.find({ idUsuario }).maxTimeMS(30000).lean<IPrecioEspecial[]>();
			const mapa = new Map<string, number>(especiales.map((e) => [e.idProducto, e.precioEspecial]));

			productos.forEach((p) => {
				const id = p._id.toString();
				if (mapa.has(id)) {
					p.precioOriginal = p.precio;
					p.precio = mapa.get(id)!;
					p.tienePrecioEspecial = true;
				} else {
					p.tienePrecioEspecial = false;
				}
			});
		}

		res.json({ success: true, data: productos, message: `Found ${productos.length} productos` });
	} catch (err) {
		next(err);
	}
});

// GET /api/precios-especiales
app.get("/api/precios-especiales", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	if (mongoose.connection.readyState !== 1) {
		res.status(503).json({ success: false, message: "DB no disponible.", error: "MongoDB no conectado" });
		return;
	}

	try {
		const { idUsuario } = req.query as { idUsuario?: string };
		const filter = idUsuario ? { idUsuario } : {};
		const data = await PrecioEspecial.find(filter).sort({ createdAt: -1 }).maxTimeMS(30000).lean<IPrecioEspecial[]>();

		res.json({ success: true, data, message: `Se encontraron ${data.length} precios especiales` });
	} catch (err) {
		next(err);
	}
});

// POST /api/precios-especiales
app.post("/api/precios-especiales", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	if (mongoose.connection.readyState !== 1) {
		res.status(503).json({ success: false, message: "DB no disponible.", error: "MongoDB no conectado" });
		return;
	}

	try {
		const { idUsuario, idProducto, precioEspecial, notas } = req.body as {
			idUsuario: string;
			idProducto: string;
			precioEspecial: number;
			notas?: string;
		};

		if (!idUsuario || !idProducto || precioEspecial == null) {
			res.status(400).json({ success: false, message: "No encontrado idUsuario, idProducto, o precioEspecial" });
			return;
		}
		if (precioEspecial < 0) {
			res.status(400).json({ success: false, message: "El precio especial debe ser mayo a 0" });
			return;
		}

		const producto = await Producto.findById(idProducto).maxTimeMS(30000);
		if (!producto) {
			res.status(404).json({ success: false, message: "Producto no encontrado" });
			return;
		}

		const updated = await PrecioEspecial.findOneAndUpdate(
			{ idUsuario, idProducto },
			{ precioEspecial, notas: notas ?? "", updatedAt: new Date() },
			{ upsert: true, new: true, runValidators: true, maxTimeMS: 30000 }
		);

		res.status(201).json({ success: true, data: updated, message: "Precio especial guardado" });
	} catch (err) {
		next(err);
	}
});

// GET /api/precios-especiales/check/:idUsuario/:idProducto
app.get(
	"/api/precios-especiales/check/:idUsuario/:idProducto",
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		if (mongoose.connection.readyState !== 1) {
			res.status(503).json({ success: false, message: "DB no disponible.", error: "MongoDB no conectado" });
			return;
		}

		try {
			const { idUsuario, idProducto } = req.params;
			const found = await PrecioEspecial.findOne({ idUsuario, idProducto }).maxTimeMS(30000);
			res.json({ success: true, tienePrecioEspecial: Boolean(found), data: found });
		} catch (err) {
			next(err);
		}
	}
);

// DELETE /api/precios-especiales/:id
app.delete("/api/precios-especiales/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	if (mongoose.connection.readyState !== 1) {
		res.status(503).json({ success: false, message: "DB no disponible.", error: "MongoDB no conectado" });
		return;
	}

	try {
		const { id } = req.params;
		const deleted = await PrecioEspecial.findByIdAndDelete(id).maxTimeMS(30000);
		if (!deleted) {
			res.status(404).json({ success: false, message: "Precio especial no encontrado" });
			return;
		}
		res.json({ success: true, message: "Precio especial eliminado" });
	} catch (err) {
		next(err);
	}
});

app.get("/api/health", (req: Request, res: Response, next: NextFunction): void => {
	res.json({
		success: true,
		message: "Servidor corriendo y MongoDB conectado",
		timestamp: new Date().toISOString(),
		mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
	});
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error("Error en ruta:", err);
	res.status(500).json({ success: false, message: err.message });
});

// Solo inicia servidor si se ejecuta directamente
if (require.main === module) {
	app.listen(PORT, () => {
		console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
	});
}

export default app;
