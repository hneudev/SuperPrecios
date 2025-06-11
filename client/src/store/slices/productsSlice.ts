import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Producto } from "../../pages/Articulos";

interface EstadoProductos {
	elementos: Producto[];
	cargando: boolean;
	error: string | null;
	estadoConexion: "conectado" | "desconectado" | "verificando";
	terminoBusqueda: string;
	mostrarPreciosEspeciales: boolean;
	idUsuario: string;
}

const estadoInicial: EstadoProductos = {
	elementos: [],
	cargando: false,
	error: null,
	estadoConexion: "verificando",
	terminoBusqueda: "",
	mostrarPreciosEspeciales: false,
	idUsuario: "user123",
};

// Thunks asíncronos
export const verificarSaludBackend = createAsyncThunk("productos/verificarSaludBackend", async () => {
	const respuesta = await fetch("http://localhost:5000/api/health");
	const datos = await respuesta.json();
	return datos.mongodb === "connected";
});

export const obtenerProductos = createAsyncThunk("productos/obtener", async (_, { getState }) => {
	const estado = getState() as { productos: EstadoProductos };
	const { mostrarPreciosEspeciales, idUsuario } = estado.productos;

	const parametrosConsulta = mostrarPreciosEspeciales ? `?idUsuario=${idUsuario}` : "";
	const respuesta = await fetch(`http://localhost:5000/api/productos${parametrosConsulta}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		signal: AbortSignal.timeout(60000),
	});

	if (!respuesta.ok) {
		const datosError = await respuesta.json().catch(() => ({}));
		throw new Error(datosError.message || `Error HTTP! estado: ${respuesta.status}`);
	}

	const datos = await respuesta.json();
	if (!datos.success) {
		throw new Error(datos.message || "Fallo al obtener productos");
	}

	return datos.data;
});

const productosSlice = createSlice({
	name: "productos",
	initialState: estadoInicial,
	reducers: {
		establecerTerminoBusqueda: (state, action: PayloadAction<string>) => {
			state.terminoBusqueda = action.payload;
		},
		establecerMostrarPreciosEspeciales: (state, action: PayloadAction<boolean>) => {
			state.mostrarPreciosEspeciales = action.payload;
		},
		establecerIdUsuario: (state, action: PayloadAction<string>) => {
			state.idUsuario = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			// Verificar Salud del Backend
			.addCase(verificarSaludBackend.pending, (state) => {
				state.estadoConexion = "verificando";
			})
			.addCase(verificarSaludBackend.fulfilled, (state, action) => {
				state.estadoConexion = action.payload ? "conectado" : "desconectado";
			})
			.addCase(verificarSaludBackend.rejected, (state) => {
				state.estadoConexion = "desconectado";
			})
			// Obtener Productos
			.addCase(obtenerProductos.pending, (state) => {
				state.cargando = true;
				state.error = null;
			})
			.addCase(obtenerProductos.fulfilled, (state, action) => {
				state.cargando = false;
				state.elementos = action.payload;
				state.estadoConexion = "conectado";
			})
			.addCase(obtenerProductos.rejected, (state, action) => {
				state.cargando = false;
				state.estadoConexion = "desconectado";
				state.error = action.error.message || "Error al obtener productos";
			});
	},
});

export const { establecerTerminoBusqueda, establecerMostrarPreciosEspeciales, establecerIdUsuario } =
	productosSlice.actions;
export default productosSlice.reducer;
