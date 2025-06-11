import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Package, Upload, Activity } from "lucide-react";

interface LayoutProps {
	children: React.ReactNode;
}

/**
 * Layout Component
 * Provides consistent navigation and page structure
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
	const location = useLocation();

	const isActive = (path: string) => {
		return location.pathname === path || (path === "/" && location.pathname === "/articulos");
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
			{/* Navigation Header */}
			<nav className='bg-white shadow-lg border-b border-gray-200'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						{/* Logo and Brand */}
						<div className='flex items-center space-x-3'>
							<div className='bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg'>
								<Package className='h-6 w-6 text-white' />
							</div>
							<div>
								<h1 className='text-xl font-bold text-gray-900'>SuperPrecios</h1>
								<p className='text-xs text-gray-500'>Gestor de Precios especiales</p>
							</div>
						</div>

						{/* Navigation Links */}
						<div className='flex space-x-1'>
							<Link
								to='/articulos'
								className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
									isActive("/articulos") || isActive("/")
										? "bg-blue-100 text-blue-700 shadow-sm"
										: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
								}`}>
								<Activity className='h-4 w-4' />
								<span>Articulos</span>
							</Link>
							<Link
								to='/subida'
								className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
									isActive("/subida")
										? "bg-blue-100 text-blue-700 shadow-sm"
										: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
								}`}>
								<Upload className='h-4 w-4' />
								<span>Subida</span>
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>{children}</main>

			{/* Footer */}
			<footer className='bg-white border-t border-gray-200 mt-auto'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
					<div className='text-center text-sm text-gray-500'>© 2025 SuperPrecios - Gestor de Precios Especiales</div>
				</div>
			</footer>
		</div>
	);
};

export default Layout;
