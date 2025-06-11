import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface PrecioEspecial {
	_id: string;
	idUsuario: string;
	idProducto: string;
	precioEspecial: number;
	notas?: string;
	createdAt: Date;
	updatedAt: Date;
}

interface EstadoPreciosEspeciales {
	elementos: PrecioEspecial[];
	cargando: boolean;
	error: string | null;
	exito: string | null;
	datosFormulario: {
		idUsuario: string;
		idProducto: string;
		precioEspecial: string;
		notas: string;
	};
}

const estadoInicial: EstadoPreciosEspeciales = {
	elementos: [],
	cargando: false,
	error: null,
	exito: null,
	datosFormulario: {
		idUsuario: "user123",
		idProducto: "",
		precioEspecial: "",
		notas: "",
	},
};

export const obtenerPreciosEspeciales = createAsyncThunk("preciosEspeciales/obtener", async () => {
	const respuesta = await fetch("http://localhost:5000/api/precios-especiales");
	const datos = await respuesta.json();
	if (!datos.success) throw new Error(datos.message || "Error al obtener precios especiales");
	return datos.data;
});

export const crearPrecioEspecial = createAsyncThunk("preciosEspeciales/crear", async (_, { getState }) => {
	const estado = getState() as { preciosEspeciales: EstadoPreciosEspeciales };
	const { datosFormulario } = estado.preciosEspeciales;

	if (!datosFormulario.idUsuario || !datosFormulario.idProducto || !datosFormulario.precioEspecial) {
		throw new Error("Rellena todos los campos obligatorios");
	}

	const respuesta = await fetch("http://localhost:5000/api/precios-especiales", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			...datosFormulario,
			precioEspecial: parseFloat(datosFormulario.precioEspecial),
		}),
	});

	const datos = await respuesta.json();
	if (!datos.success) throw new Error(datos.message || "Error al guardar el precio especial");
	return datos.data;
});

const preciosEspecialesSlice = createSlice({
	name: "preciosEspeciales",
	initialState: estadoInicial,
	reducers: {
		establecerDatosFormulario: (state, action: PayloadAction<Partial<EstadoPreciosEspeciales["datosFormulario"]>>) => {
			state.datosFormulario = { ...state.datosFormulario, ...action.payload };
		},
		reiniciarFormulario: (state) => {
			state.datosFormulario = { ...state.datosFormulario, idProducto: "", precioEspecial: "", notas: "" };
		},
		limpiarMensajes: (state) => {
			state.error = null;
			state.exito = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(obtenerPreciosEspeciales.pending, (state) => {
				state.cargando = true;
				state.error = null;
			})
			.addCase(obtenerPreciosEspeciales.fulfilled, (state, action) => {
				state.cargando = false;
				state.elementos = action.payload;
			})
			.addCase(obtenerPreciosEspeciales.rejected, (state, action) => {
				state.cargando = false;
				state.error = action.error.message || "Error al obtener precios especiales";
			})
			.addCase(crearPrecioEspecial.pending, (state) => {
				state.cargando = true;
				state.error = null;
				state.exito = null;
			})
			.addCase(crearPrecioEspecial.fulfilled, (state, action) => {
				state.cargando = false;
				state.exito = "Precio especial guardado correctamente";
				state.elementos = [...state.elementos, action.payload];
				state.datosFormulario = { ...state.datosFormulario, idProducto: "", precioEspecial: "", notas: "" };
			})
			.addCase(crearPrecioEspecial.rejected, (state, action) => {
				state.cargando = false;
				state.error = action.error.message || "Error al guardar el precio especial";
			});
	},
});

export const { establecerDatosFormulario, reiniciarFormulario, limpiarMensajes } = preciosEspecialesSlice.actions;
export default preciosEspecialesSlice.reducer;
