export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const ENDPOINTS = {
	PRODUCTOS: `${API_URL}/api/productos`,
	PRECIOS_ESPECIALES: `${API_URL}/api/precios-especiales`,
	HEALTH: `${API_URL}/api/health`,
} as const;
