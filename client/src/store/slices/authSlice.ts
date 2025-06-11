import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EstadoAutenticacion {
	estaAutenticado: boolean;
	usuario: {
		id: string | null;
		email: string | null;
	} | null;
}

const estadoInicial: EstadoAutenticacion = {
	estaAutenticado: false,
	usuario: null,
};

const autenticacionSlice = createSlice({
	name: "autenticacion",
	initialState: estadoInicial,
	reducers: {
		establecerUsuario: (state, action: PayloadAction<EstadoAutenticacion["usuario"]>) => {
			state.usuario = action.payload;
			state.estaAutenticado = !!action.payload;
		},
		cerrarSesion: (state) => {
			state.usuario = null;
			state.estaAutenticado = false;
		},
	},
});

export const { establecerUsuario, cerrarSesion } = autenticacionSlice.actions;
export default autenticacionSlice.reducer;
