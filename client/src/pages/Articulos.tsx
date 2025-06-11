/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import {
	Search,
	DollarSign,
	Tag,
	AlertCircle,
	RefreshCw,
	Users,
	Wifi,
	WifiOff,
	Image as ImageIcon,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import useDebounce from "../hooks/useDebounce";
import { formatoPrecio } from "../utils/formatters";
import { useBackendHealth } from "../hooks/useBackendHealth";
import { ENDPOINTS } from "../config";

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
 * Página Artículos
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
	const [idUsuario, setIdUsuario] = useState("user123"); // ID de usuario de demostración
	const [muestraPreciosEspeciales, setMuestraPreciosEspeciales] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(12);

	// Use the custom hook for backend health
	const { connectionStatus, checkBackendHealth } = useBackendHealth();

	// Apply debounce to both inputs
	const debouncedTerminoBuscado = useDebounce(terminoBuscado, 500);
	const debouncedIdUsuario = useDebounce(idUsuario, 500);

	// Local state for immediate input feedback
	const [localTerminoBuscado, setLocalTerminoBuscado] = useState(terminoBuscado);
	const [localIdUsuario, setLocalIdUsuario] = useState(idUsuario);

	// Update the debounced values when local values change
	useEffect(() => {
		setTerminoBuscado(localTerminoBuscado);
	}, [localTerminoBuscado]);

	useEffect(() => {
		setIdUsuario(localIdUsuario);
	}, [localIdUsuario]);

	// Obtiene los productos del backend y maneja errores de conexión y estado de la base de datos
	const fetchProductos = async () => {
		try {
			setLoading(true);
			setError("");

			// Primero verificamos si el backend está saludable
			const isHealthy = await checkBackendHealth();
			if (!isHealthy) {
				throw new Error("El backend no está disponible. Por favor, verifica la conexión.");
			}

			const queryParams = muestraPreciosEspeciales ? `?idUsuario=${debouncedIdUsuario}` : "";
			const response = await fetch(`${ENDPOINTS.PRODUCTOS}${queryParams}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				signal: AbortSignal.timeout(60000),
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || `Error HTTP! estado: ${response.status}`);
			}

			const data = await response.json();

			if (data.success) {
				setProductos(data.data);
			} else {
				setError(data.message || "Fallo al obtener productos");
			}
		} catch (err: unknown) {
			console.error("Error al obtener productos:", err);

			// Proporcionar mensajes de error amigables para el usuario
			if (err instanceof Error) {
				if (err.name === "AbortError") {
					setError(
						"La solicitud ha expirado. El servidor puede estar experimentando problemas. Por favor, inténtalo de nuevo."
					);
				} else if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
					setError(
						"No se puede conectar al servidor. Asegúrate de que el backend esté ejecutándose en el puerto 5000."
					);
				} else if (err.message.includes("database is disconnected")) {
					setError(
						"Problema de conexión a la base de datos. Por favor, revisa la conexión a MongoDB Atlas y la configuración de acceso a la red."
					);
				} else if (err.message.includes("timeout")) {
					setError(
						"La consulta a la base de datos ha expirado. Esto puede deberse a problemas de red o restricciones de acceso a MongoDB Atlas."
					);
				} else {
					setError(err.message || "Ocurrió un error inesperado al obtener productos.");
				}
			} else {
				setError("Ocurrió un error inesperado al obtener productos.");
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProductos();
	}, [muestraPreciosEspeciales, debouncedIdUsuario]);

	// Filtrado de productos
	// Esta función filtra los productos por nombre o categoría según el término de búsqueda ingresado
	const productosFiltrados = productos.filter((producto) => {
		const name = producto.nombre || "Producto sin nombre";
		return (
			name.toLowerCase().includes(debouncedTerminoBuscado.toLowerCase()) ||
			(producto.categoria && producto.categoria.toLowerCase().includes(debouncedTerminoBuscado.toLowerCase()))
		);
	});

	// Calcular productos paginados
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = productosFiltrados.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);

	// Resetear a la primera página cuando cambia el filtro
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedTerminoBuscado, muestraPreciosEspeciales]);

	if (loading) {
		return (
			<div className='flex items-center justify-center min-h-64'>
				<div className='text-center'>
					<RefreshCw className='w-8 h-8 mx-auto mb-4 text-blue-600 animate-spin' />
					<p className='text-gray-600'>Cargando productos...</p>
					<p className='mt-2 text-sm text-gray-500'>Conectando a la base de datos...</p>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* Encabezado */}
			<div className='p-6 bg-white border border-gray-200 shadow-sm rounded-xl'>
				<div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
					<div>
						<h1 className='flex items-center gap-2 text-2xl font-bold text-gray-900'>
							<Tag className='w-6 h-6 text-blue-600' />
							Artículos
						</h1>
						<p className='mt-1 text-gray-600'>Explora los productos y sus precios especiales</p>
					</div>

					<div className='flex flex-col flex-wrap gap-3 sm:flex-row'>
						{/* Estado de conexión */}
						<div className='flex items-center w-full gap-2 px-3 py-2 rounded-lg bg-gray-50 sm:w-auto'>
							{connectionStatus === "connected" ? (
								<>
									<Wifi className='w-4 h-4 text-green-500' />
									<span className='text-sm text-green-700'>Conectado</span>
								</>
							) : connectionStatus === "disconnected" ? (
								<>
									<WifiOff className='w-4 h-4 text-red-500' />
									<span className='text-sm text-red-700'>Desconectado</span>
								</>
							) : (
								<>
									<RefreshCw className='w-4 h-4 text-yellow-500 animate-spin' />
									<span className='text-sm text-yellow-700'>Verificando...</span>
								</>
							)}
						</div>

						{/* Input de ID de Usuario */}
						<div className='flex items-center w-full gap-2 sm:w-auto'>
							<Users className='flex-shrink-0 w-4 h-4 text-gray-500' />
							<input
								type='text'
								value={localIdUsuario}
								onChange={(e) => setLocalIdUsuario(e.target.value)}
								placeholder='ID de Usuario'
								className='w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
							/>
						</div>

						{/* checkbox de Precios especiales */}
						<label className='flex items-center w-full gap-2 cursor-pointer sm:w-auto'>
							<input
								type='checkbox'
								checked={muestraPreciosEspeciales}
								onChange={(e) => setMuestraPreciosEspeciales(e.target.checked)}
								className='text-blue-600 border-gray-300 rounded focus:ring-blue-500'
							/>
							<span className='text-sm font-medium text-gray-700'>Mostrar precios especiales</span>
						</label>

						{/* Botón de actualizar*/}
						<button
							onClick={fetchProductos}
							disabled={loading}
							className='flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg sm:w-auto hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'>
							<RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
							Actualizar
						</button>
					</div>
				</div>
			</div>

			{/* Barra de búsqueda y filtros*/}
			<div className='p-6 bg-white border border-gray-200 shadow-sm rounded-xl'>
				<div className='relative'>
					<Search className='absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2' />
					<input
						type='text'
						placeholder='Busca productos por nombre o categoría...'
						value={localTerminoBuscado}
						onChange={(e) => setLocalTerminoBuscado(e.target.value)}
						className='w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
					/>
				</div>
			</div>

			{/* Mensaje de Error */}
			{error && (
				<div className='p-4 border border-red-200 bg-red-50 rounded-xl'>
					<div className='flex items-start gap-3'>
						<AlertCircle className='h-5 w-5 text-red-500 flex-shrink-0 mt-0.5' />
						<div>
							<p className='font-medium text-red-700'>Error de conexión</p>
							<p className='mt-1 text-sm text-red-600'>{error}</p>
							{error.includes("MongoDB") && (
								<div className='mt-3 text-sm text-red-600'>
									<p className='font-medium'>Pasos para corregir:</p>
									<ul className='mt-1 space-y-1 list-disc list-inside'>
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

			{/* Grid de Productos */}
			<div className='overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl'>
				<div className='px-6 py-4 border-b border-gray-200'>
					<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
						<h2 className='text-lg font-semibold text-gray-900'>Productos ({productosFiltrados.length})</h2>
						<div className='flex items-center gap-2'>
							<label
								htmlFor='itemsPerPage'
								className='text-sm text-gray-600'>
								Mostrar:
							</label>
							<select
								id='itemsPerPage'
								value={itemsPerPage}
								onChange={(e) => {
									setItemsPerPage(Number(e.target.value));
									setCurrentPage(1);
								}}
								className='px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
								<option value={12}>12</option>
								<option value={24}>24</option>
								<option value={productosFiltrados.length}>Todos</option>
							</select>
						</div>
					</div>
				</div>

				{productosFiltrados.length === 0 && !error ? (
					<div className='py-12 text-center'>
						<Tag className='w-12 h-12 mx-auto mb-4 text-gray-400' />
						<p className='text-gray-500'>Productos no encontrados</p>
						{connectionStatus === "disconnected" && <p className='mt-2 text-sm text-gray-400'>Verifica tu conexión</p>}
					</div>
				) : (
					<div className='p-6'>
						<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
							{currentItems.map((producto) => (
								<div
									key={producto._id}
									className='transition-shadow duration-200 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md'>
									{/* Imagen del producto */}
									<div className='relative'>
										<ProductImage
											src={producto.imagen}
											alt={producto.nombre || "Producto sin nombre"}
										/>
										{producto.tienePrecioEspecial && (
											<div className='absolute top-2 right-2'>
												<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
													Precio Especial
												</span>
											</div>
										)}
									</div>

									{/* Contenido del producto */}
									<div className='p-4'>
										{/* Categoría */}
										<div className='mb-2'>
											<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
												{producto.categoria || "Sin categoría"}
											</span>
										</div>

										{/* Nombre y descripción */}
										<h3 className='mb-1 text-lg font-semibold text-gray-900 truncate'>
											{producto.nombre || "Producto sin nombre"}
										</h3>
										{producto.descripcion && (
											<p className='mb-3 text-sm text-gray-500 line-clamp-2'>{producto.descripcion}</p>
										)}

										{/* Precio */}
										<div className='mt-4'>
											<div className='flex items-center gap-2'>
												<DollarSign className='w-4 h-4 text-gray-400' />
												<span
													className={`text-xl font-bold ${
														producto.tienePrecioEspecial ? "text-green-600" : "text-gray-900"
													}`}>
													{formatoPrecio(producto.precio)}
												</span>
											</div>
											{producto.tienePrecioEspecial && producto.precioOriginal && (
												<div className='ml-6 text-sm text-gray-500 line-through'>
													Original: {formatoPrecio(producto.precioOriginal)}
												</div>
											)}
										</div>

										{/* Stock */}
										<div className='flex items-center gap-2 mt-3'>
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
													producto.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
												}`}>
												{producto.stock > 0 ? `Stock: ${producto.stock}` : "Sin stock"}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Paginación */}
						{itemsPerPage < productosFiltrados.length && (
							<div className='flex items-center justify-between pt-4 mt-8 border-t border-gray-200'>
								<div className='flex items-center gap-2'>
									<span className='text-sm text-gray-600'>
										Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, productosFiltrados.length)} de{" "}
										{productosFiltrados.length}
									</span>
								</div>
								<div className='flex items-center gap-2'>
									<button
										onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
										disabled={currentPage === 1}
										className='inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'>
										<ChevronLeft className='w-4 h-4' />
										Anterior
									</button>
									<div className='flex items-center gap-1'>
										{[...Array(totalPages)].map((_, index) => (
											<button
												key={index + 1}
												onClick={() => setCurrentPage(index + 1)}
												className={`inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-lg ${
													currentPage === index + 1
														? "bg-blue-600 text-white"
														: "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
												}`}>
												{index + 1}
											</button>
										))}
									</div>
									<button
										onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
										disabled={currentPage === totalPages}
										className='inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'>
										Siguiente
										<ChevronRight className='w-4 h-4' />
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

/**
 * Componente para manejar la carga de imágenes con placeholder
 */
const ProductImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	return (
		<div className='relative overflow-hidden bg-gray-100 aspect-square rounded-t-xl'>
			{isLoading && (
				<div className='absolute inset-0 flex items-center justify-center'>
					<RefreshCw className='w-8 h-8 text-gray-400 animate-spin' />
				</div>
			)}
			{hasError ? (
				<div className='absolute inset-0 flex flex-col items-center justify-center text-gray-400'>
					<ImageIcon className='w-12 h-12 mb-2' />
					<span className='text-sm'>Imagen no disponible</span>
				</div>
			) : (
				<img
					src={src}
					alt={alt}
					loading='lazy'
					onLoad={() => setIsLoading(false)}
					onError={() => {
						setIsLoading(false);
						setHasError(true);
					}}
					className={`object-cover w-full h-full transition-transform duration-200 ${
						isLoading ? "opacity-0" : "opacity-100 hover:scale-105"
					}`}
				/>
			)}
		</div>
	);
};

export default Articulos;
