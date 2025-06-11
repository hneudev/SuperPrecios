import { useState, useEffect } from "react";

type ConnectionStatus = "connected" | "disconnected" | "checking";

/**
 * Hook personalizado para verificar el estado de conexión con el backend
 * @param checkInterval - Intervalo en milisegundos para verificar la conexión (por defecto: 30000ms)
 * @returns Un objeto con el estado de conexión y una función para verificar manualmente
 */
export const useBackendHealth = (checkInterval: number = 30000) => {
	const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("checking");

	const checkBackendHealth = async (): Promise<boolean> => {
		try {
			const response = await fetch("http://localhost:5000/api/health");
			const data = await response.json();
			const isConnected = data.mongodb === "connected";
			setConnectionStatus(isConnected ? "connected" : "disconnected");
			return isConnected;
		} catch {
			setConnectionStatus("disconnected");
			return false;
		}
	};

	useEffect(() => {
		checkBackendHealth();
		const interval = setInterval(checkBackendHealth, checkInterval);
		return () => clearInterval(interval);
	}, [checkInterval]);

	return {
		connectionStatus,
		checkBackendHealth,
	};
};
