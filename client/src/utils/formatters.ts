/**
 * Formatea un número como una cadena de texto representando un precio en formato mexicano
 * @param precio - El número a formatear
 * @returns Una cadena de texto con el precio formateado en pesos mexicanos
 */
export const formatoPrecio = (precio: number): string => {
	return new Intl.NumberFormat("es-MX", {
		style: "currency",
		currency: "MXN",
		minimumFractionDigits: 2,
	}).format(precio);
};
