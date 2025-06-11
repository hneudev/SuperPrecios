import { Producto } from "../pages/Articulos";

/**
 * Obtiene el nombre de un producto por su ID
 * @param idProducto - El ID del producto a buscar
 * @param productos - La lista de productos donde buscar (opcional)
 * @returns El nombre del producto o un mensaje por defecto si no se encuentra
 */
export const getNombreProducto = (idProducto: string, productos?: Producto[]): string => {
	if (!productos) {
		return "Cargando producto...";
	}
	const producto = productos.find((p) => p._id === idProducto);
	return producto ? producto.nombre || "Producto sin nombre" : "Producto no encontrado";
};
