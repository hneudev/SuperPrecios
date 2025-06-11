import React, { useState, useEffect } from "react";
import { Search, DollarSign, Tag, AlertCircle, RefreshCw, Users, Wifi, WifiOff } from "lucide-react";

export interface Producto {
	_id: string;

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
 * Pagina Articulos
 * Muestra una lista de productos con opciones de búsqueda, filtros y precios especiales.
 * Permite al usuario buscar productos por nombre o categoría, y ver precios especiales si están disponibles.
 * Incluye manejo de errores mejorado y verificación del estado de conexión con el backend.
 * Utiliza hooks de React para manejar el estado y efectos secundarios.
 */
const Articulos: React.FC = () => {
	const [productos, setProductos] = useState<Producto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>("");
	const [terminoBuscado, setTerminoBuscado] = useState("");
	const [idUsuario, setIdUsuario] = useState("user123"); // Demo user ID
	const [muestraPreciosEspeciales, setMuestraPreciosEspeciales] = useState(false);
	const [connectionStatus, setConnectionStatus] = useState<"connected" | "disconnected" | "checking">("checking");

	// Verifica el estado de conexión con el backend
	// Esta función realiza una solicitud al endpoint /api/health para verificar la conexión con MongoDB
	const checkBackendHealth = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/health");
			const data = await response.json();
			setConnectionStatus(data.mongodb === "connected" ? "connected" : "disconnected");
			return data.mongodb === "connected";
		} catch (err) {
			setConnectionStatus("disconnected");
			return false;
		}
	};

	//Obtiene los productos del backend y maneja errores de conexión y estado de la base de datos
	// Esta función también verifica si el backend está saludable antes de realizar la solicitud
	const fetchProductos = async () => {
		try {
			setLoading(true);
			setError("");

			// Primero verificamos si el backend está saludable
			const isHealthy = await checkBackendHealth();
			if (!isHealthy) {
				throw new Error("El backend no está disponible. Por favor, verifica la conexión.");
			}

			const queryParams = muestraPreciosEspeciales ? `?idUsuario=${idUsuario}` : "";
			const response = await fetch(`http://localhost:5000/api/productos${queryParams}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				//Agregar un timeout para evitar solicitudes que se cuelguen
				// Esto es útil para evitar que la aplicación se quede esperando indefinidamente
				signal: AbortSignal.timeout(60000),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			if (data.success) {
				setProductos(data.data);
				setConnectionStatus("connected");
			} else {
				setError(data.message || "Failed to fetch productos");
			}
		} catch (err: any) {
			console.error("Error fetching productos:", err);
			setConnectionStatus("disconnected");

			// Provide user-friendly error messages
			if (err.name === "AbortError") {
				setError("Request timed out. The server may be experiencing issues. Please try again.");
			} else if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
				setError("Cannot connect to server. Please ensure the backend is running on port 5000.");
			} else if (err.message.includes("database is disconnected")) {
				setError("Database connection issue. Please check MongoDB Atlas connection and network access settings.");
			} else if (err.message.includes("timeout")) {
				setError("Database query timed out. This may be due to network issues or MongoDB Atlas access restrictions.");
			} else {
				setError(err.message || "An unexpected error occurred while fetching productos.");
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProductos();
	}, [muestraPreciosEspeciales, idUsuario]);

	// Actualizacion periódica del estado de conexión

	useEffect(() => {
		const interval = setInterval(checkBackendHealth, 30000);
		return () => clearInterval(interval);
	}, []);

	// Filtrado de productos
	// Esta función filtra los productos por nombre o categoría según el término de búsqueda ingresado
	const productosFiltrados = productos.filter((producto) => {
		const name = producto.nombre || "Producto sin nombre";
		return (
			name.toLowerCase().includes(terminoBuscado.toLowerCase()) ||
			(producto.categoria && producto.categoria.toLowerCase().includes(terminoBuscado.toLowerCase()))
		);
	});

	// Formato de precio
	// Esta función formatea un número como una cadena de texto representando un precio en formato mexicano
	const formatoPrecio = (precio: number) => {
		return new Intl.NumberFormat("es-MX", {
			style: "currency",
			currency: "MXN",
			minimumFractionDigits: 2,
		}).format(precio);
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-64'>
				<div className='text-center'>
					<RefreshCw className='h-8 w-8 animate-spin text-blue-600 mx-auto mb-4' />
					<p className='text-gray-600'>Cargando productos...</p>
					<p className='text-sm text-gray-500 mt-2'>Conectando a la base de datos...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
				<div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
					<div>
						<h1 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
							<Tag className='h-6 w-6 text-blue-600' />
							Articulos
						</h1>
						<p className='text-gray-600 mt-1'>Explora los productos y sus precios especiales</p>
					</div>

					<div className='flex flex-col sm:flex-row gap-3'>
						{/* Estado de conexión
						 * Esta sección muestra el estado de conexión con el backend y la base de datos
						 */}
						<div className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50'>
							{connectionStatus === "connected" ? (
								<>
									<Wifi className='h-4 w-4 text-green-500' />
									<span className='text-sm text-green-700'>Conectado</span>
								</>
							) : connectionStatus === "disconnected" ? (
								<>
									<WifiOff className='h-4 w-4 text-red-500' />
									<span className='text-sm text-red-700'>Desconectado</span>
								</>
							) : (
								<>
									<RefreshCw className='h-4 w-4 animate-spin text-yellow-500' />
									<span className='text-sm text-yellow-700'>Verificando...</span>
								</>
							)}
						</div>

						{/* Input de Id de Usuario
						 * Esta sección permite al usuario ingresar un ID de usuario para filtrar los precios especiales
						 */}
						<div className='flex items-center gap-2'>
							<Users className='h-4 w-4 text-gray-500' />
							<input
								type='text'
								value={idUsuario}
								onChange={(e) => setIdUsuario(e.target.value)}
								placeholder='Id de Usuario'
								className='px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							/>
						</div>

						{/* checkbox de Precios especiales */}
						<label className='flex items-center gap-2 cursor-pointer'>
							<input
								type='checkbox'
								checked={muestraPreciosEspeciales}
								onChange={(e) => setMuestraPreciosEspeciales(e.target.checked)}
								className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
							/>
							<span className='text-sm font-medium text-gray-700'>Muestra precios especiales</span>
						</label>

						{/* Boton de actualizar*/}
						<button
							onClick={fetchProductos}
							disabled={loading}
							className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 text-sm font-medium'>
							<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
							Actualiza{" "}
						</button>
					</div>
				</div>
			</div>

			{/* Barra de busqueda y filtros*/}
			<div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
					<input
						type='text'
						placeholder='Busca productos por nombre o categoria...'
						value={terminoBuscado}
						onChange={(e) => setTerminoBuscado(e.target.value)}
						className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
					/>
				</div>
			</div>

			{/* Mensaje de Error */}
			{error && (
				<div className='bg-red-50 border border-red-200 rounded-xl p-4'>
					<div className='flex items-start gap-3'>
						<AlertCircle className='h-5 w-5 text-red-500 flex-shrink-0 mt-0.5' />
						<div>
							<p className='text-red-700 font-medium'>Error de conexión</p>
							<p className='text-red-600 text-sm mt-1'>{error}</p>
							{error.includes("MongoDB") && (
								<div className='mt-3 text-sm text-red-600'>
									<p className='font-medium'>Pasos para corregir:</p>
									<ul className='list-disc list-inside mt-1 space-y-1'>
										<li>Reinicia el servidor del backend</li>
										<li>Revisa la configuración de red y cortafuegos</li>
										<li>Verifica la conexión a MongoDB Atlas</li>
										<li>Revisa las reglas de acceso a la base de datos</li>
										<li>Comprueba que el usuario tenga permisos de lectura/escritura</li>
									</ul>
								</div>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Tabla de Productos  */}
			<div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
				<div className='px-6 py-4 border-b border-gray-200'>
					<h2 className='text-lg font-semibold text-gray-900'>Productos ({productosFiltrados.length})</h2>
				</div>

				{productosFiltrados.length === 0 && !error ? (
					<div className='text-center py-12'>
						<Tag className='h-12 w-12 text-gray-400 mx-auto mb-4' />
						<p className='text-gray-500'>Productos no encontrados</p>
						{connectionStatus === "disconnected" && <p className='text-sm text-gray-400 mt-2'>Verifica tu conexión</p>}
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='w-full'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Producto
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Categoria
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Precio
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Tipo de Precio
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{productosFiltrados.map((producto, index) => (
									<tr
										key={producto._id}
										className={`hover:bg-gray-50 transition-colors duration-150 ${
											index % 2 === 0 ? "bg-white" : "bg-gray-25"
										}`}>
										<td className='px-6 py-4'>
											<div>
												<div className='text-sm font-medium text-gray-900'>
													{producto.nombre || "Producto sin nombre"}
												</div>
												{producto.descripcion && (
													<div className='text-sm text-gray-500 truncate max-w-xs'>
														{producto.descripcion || "No description available"}
													</div>
												)}
												<img
													src={producto.imagen}
													alt={producto.nombre}
													className='w-12 h-12 rounded-md object-cover'
												/>
											</div>
										</td>
										<td className='px-6 py-4'>
											<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
												{producto.categoria || "Uncategorized"}
											</span>
										</td>
										<td className='px-6 py-4'>
											<div className='flex flex-col'>
												<div className='flex items-center gap-2'>
													<DollarSign className='h-4 w-4 text-gray-400' />
													<span
														className={`font-semibold ${
															producto.tienePrecioEspecial ? "text-green-600" : "text-gray-900"
														}`}>
														{formatoPrecio(producto.precio)}
													</span>
												</div>
												{producto.tienePrecioEspecial && producto.precioOriginal && (
													<div className='text-xs text-gray-500 line-through ml-6'>
														Original: {formatoPrecio(producto.precioOriginal)}
													</div>
												)}
											</div>
										</td>
										<td className='px-6 py-4'>
											{producto.tienePrecioEspecial ? (
												<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
													Precio Especial{" "}
												</span>
											) : (
												<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
													Precio Regular{" "}
												</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	);
};

export default Articulos;
