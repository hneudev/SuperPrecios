import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import autenticacionReducer from "./slices/authSlice";
import productosReducer from "./slices/productsSlice";
import preciosEspecialesReducer from "./slices/specialPricesSlice";

export const store = configureStore({
	reducer: {
		autenticacion: autenticacionReducer,
		productos: productosReducer,
		preciosEspeciales: preciosEspecialesReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
