import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Articulos from "./pages/Articulos";
import Upload from "./pages/Subida";

/**
 * Main Application Component
 * Sets up routing and global layout structure
 */
function App() {
	return (
		<Router>
			<div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
				<Layout>
					<Routes>
						<Route
							path='/'
							element={<Articulos />}
						/>
						<Route
							path='/articulos'
							element={<Articulos />}
						/>
						<Route
							path='/subida'
							element={<Upload />}
						/>
					</Routes>
				</Layout>
			</div>
		</Router>
	);
}

export default App;
