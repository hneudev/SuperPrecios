import React, { useState, useEffect } from "react";
import { Upload as UploadIcon, DollarSign, User, Package, FileText, Check, AlertCircle, RefreshCw } from "lucide-react";
import { Producto } from "./Articulos";

// Definición de interfaces para los datos
interface PrecioEspecial {
	_id: string;
	idUsuario: string;
	idProducto: string;
	precioEspecial: number;
	notas?: string;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Pagina Subida
 * Permite a los usuarios subir precios especiales para productos
 * y ver los precios especiales recientes.
 * Utiliza un formulario para ingresar datos y una lista para mostrar precios existentes.
 */
const Subida: React.FC = () => {
	const [productos, setProductos] = useState<Producto[]>([]);
	const [preciosEspeciales, setPreciosEspeciales] = useState<PrecioEspecial[]>([]);
	const [loading, setLoading] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const [success, setSuccess] = useState<string>("");

	// Estado del formulario

	const [formData, setFormData] = useState({
		idUsuario: "user123",
		idProducto: "",
		precioEspecial: "",
		notas: "",
	});

	// Función para obtener productos desde el backend
	// Esta función se encarga de hacer una solicitud al backend para obtener la lista de productos
	const fetchProductos = async () => {
		try {
			setLoading(true);
			const response = await fetch("http://localhost:5000/api/productos");

			if (!response.ok) {
				throw new Error(`Error HTTP! estado: ${response.status}`);
			}

			const data = await response.json();

			if (data.success) {
				setProductos(data.data);
			} else {
				setError(data.message || "Fallo al obtener productos");
			}
		} catch (err) {
			console.error("Error al obtener productos:", err);
			setError("Se produjo un error al obtener los productos, intente de nuevo.");
		} finally {
			setLoading(false);
		}
	};

	// Función para obtener precios especiales desde el backend
	// Esta función se encarga de hacer una solicitud al backend para obtener la lista de precios especiales
	const fetchPreciosEspeciales = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/precios-especiales");

			if (!response.ok) {
				throw new Error(`Error HTTP! estado:${response.status}`);
			}

			const data = await response.json();

			if (data.success) {
				setPreciosEspeciales(data.data);
			}
		} catch (err) {
			console.error("Error al obtener los precios", err);
		}
	};

	useEffect(() => {
		fetchProductos();
		fetchPreciosEspeciales();
	}, []);

	// Manejar cambios en los campos del formulario
	// Esta función actualiza el estado del formulario cuando el usuario cambia un campo
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Manejar el envio del formulario

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validacion de campos
		// Verificar que los campos obligatorios no estén vacíos
		if (!formData.idUsuario || !formData.idProducto || !formData.precioEspecial) {
			setError("Rellena todos los campos obligatorios");
			return;
		}

		if (parseFloat(formData.precioEspecial) < 0) {
			setError("El precio especial no puede ser negativo");
			return;
		}

		try {
			setSubmitLoading(true);
			setError("");
			setSuccess("");

			const response = await fetch("http://localhost:5000/api/precios-especiales", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					idUsuario: formData.idUsuario,
					idProducto: formData.idProducto,
					precioEspecial: parseFloat(formData.precioEspecial),
					notas: formData.notas,
				}),
			});

			const data = await response.json();

			if (data.success) {
				setSuccess("Precio especial guardado correctamente");
				// Actualizar el estado del formulario

				setFormData((prev) => ({
					...prev,
					idProducto: "",
					precioEspecial: "",
					notas: "",
				}));
				// Actualizar lista de precios especiales

				fetchPreciosEspeciales();
			} else {
				setError(data.message || "Se produjo un error al guardar el precio especial");
			}
		} catch (err) {
			console.error("Se produjo un error al guardar el precio especial", err);
			setError("Se produjo un error al guardar el precio especial, intente de nuevo.");
		} finally {
			setSubmitLoading(false);
		}
	};

	// Obtener el nombre del producto por su ID
	// Esta función busca el producto en la lista de productos y devuelve su nombre
	const getNombreProducto = (idProducto: string) => {
		const producto = productos.find((p) => p._id === idProducto);
		return producto ? producto.nombre || "Producto sin nombre" : "Producto no encontrado";
	};

	// Formato de precio
	// Esta función formatea un número como una cadena de texto representando un precio en formato mexicano
	const formatoPrecio = (precio: number) => {
		return new Intl.NumberFormat("es-MX", {
			style: "currency",
			currency: "MXN",
			minimumFractionDigits: 2,
		}).format(precio);
	};

	return (
		<div className='space-y-6'>
			{/*  Header */}
			<div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
				<div className='flex items-center gap-3'>
					<div className='bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg'>
						<UploadIcon className='h-6 w-6 text-white' />
					</div>
					<div>
						<h1 className='text-2xl font-bold text-gray-900'>Subida de precios especiales</h1>
						<p className='text-gray-600'>Crea y administra precios especiales para los usuarios</p>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Formulario de Subida */}
				<div className='bg-white rounded-xl shadow-sm border border-gray-200'>
					<div className='px-6 py-4 border-b border-gray-200'>
						<h2 className='text-lg font-semibold text-gray-900'>Agrega el precio especial</h2>
						<p className='text-sm text-gray-600'>Escribe el precio personalizado para el cliente</p>
					</div>

					<form
						onSubmit={handleSubmit}
						className='p-6 space-y-4'>
						{/*Id de Usuario */}
						<div>
							<label
								htmlFor='idUsuario'
								className='block text-sm font-medium text-gray-700 mb-1'>
								<User className='inline h-4 w-4 mr-1' />
								Id de Usuario *
							</label>
							<input
								type='text'
								id='idUsuario'
								name='idUsuario'
								value={formData.idUsuario}
								onChange={handleInputChange}
								required
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
								placeholder='Ingrese el ID del usuario'
							/>
						</div>

						{/* Selección de producto */}
						<div>
							<label
								htmlFor='idProducto'
								className='block text-sm font-medium text-gray-700 mb-1'>
								<Package className='inline h-4 w-4 mr-1' />
								Producto *
							</label>
							<select
								id='idProducto'
								name='idProducto'
								value={formData.idProducto}
								onChange={handleInputChange}
								required
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'>
								<option value=''>Selecciona el producto</option>
								{productos.map((producto) => (
									<option
										key={producto._id}
										value={producto._id}>
										{producto.nombre || "Producto sin nombre"} - {formatoPrecio(producto.precio)}
									</option>
								))}
							</select>
						</div>

						{/* Precio Especial */}
						<div>
							<label
								htmlFor='precioEspecial'
								className='block text-sm font-medium text-gray-700 mb-1'>
								<DollarSign className='inline h-4 w-4 mr-1' />
								Precio especial *
							</label>
							<input
								type='number'
								id='precioEspecial'
								name='precioEspecial'
								value={formData.precioEspecial}
								onChange={handleInputChange}
								step='0.01'
								min='0'
								required
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
								placeholder='0.00'
							/>
						</div>

						{/* Notas */}
						<div>
							<label
								htmlFor='notas'
								className='block text-sm font-medium text-gray-700 mb-1'>
								<FileText className='inline h-4 w-4 mr-1' />
								Notas (Opcional)
							</label>
							<textarea
								id='notas'
								name='notas'
								value={formData.notas}
								onChange={handleInputChange}
								rows={3}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
								placeholder='Agrega notas adicionales sobre el precio especial'
							/>
						</div>

						{/* Boton Guardar */}
						<button
							type='submit'
							disabled={submitLoading || loading}
							className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2'>
							{submitLoading ? (
								<>
									<RefreshCw className='h-4 w-4 animate-spin' />
									Salvando...
								</>
							) : (
								<>
									<Check className='h-4 w-4' />
									Guardar Precio Especial
								</>
							)}
						</button>
					</form>
				</div>

				{/* Lista de Precios especiales recientes */}
				<div className='bg-white rounded-xl shadow-sm border border-gray-200'>
					<div className='px-6 py-4 border-b border-gray-200'>
						<h2 className='text-lg font-semibold text-gray-900'>Precios especiales recientes</h2>
						<p className='text-sm text-gray-600'>Ultimas reediciones</p>
					</div>

					<div className='p-6'>
						{preciosEspeciales.length === 0 ? (
							<div className='text-center py-8'>
								<DollarSign className='h-12 w-12 text-gray-400 mx-auto mb-4' />
								<p className='text-gray-500'>Sin precios especiales aun</p>
							</div>
						) : (
							<div className='space-y-3 max-h-96 overflow-y-auto'>
								{preciosEspeciales.slice(0, 10).map((precio) => (
									<div
										key={precio._id}
										className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
										<div className='flex justify-between items-start mb-2'>
											<div>
												<h3 className='font-medium text-gray-900 text-sm'>{getNombreProducto(precio.idProducto)}</h3>
												<p className='text-xs text-gray-500'>Usuario: {precio.idUsuario}</p>
											</div>
											<span className='text-sm font-semibold text-green-600'>
												{formatoPrecio(precio.precioEspecial)}
											</span>
										</div>
										{precio.notas && <p className='text-xs text-gray-600 mb-2'>{precio.notas}</p>}
										<p className='text-xs text-gray-400'>Creado: {new Date(precio.createdAt).toLocaleDateString()}</p>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Mensaje success */}
			{success && (
				<div className='bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3'>
					<Check className='h-5 w-5 text-green-500 flex-shrink-0' />
					<p className='text-green-700'>{success}</p>
				</div>
			)}

			{/* Mensaje error */}
			{error && (
				<div className='bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3'>
					<AlertCircle className='h-5 w-5 text-red-500 flex-shrink-0' />
					<p className='text-red-700'>{error}</p>
				</div>
			)}
		</div>
	);
};

export default Subida;
