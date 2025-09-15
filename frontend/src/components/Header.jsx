import { Sprout } from 'lucide-react';
import React from 'react';
export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-md z-50">
                <div className="container mx-auto px-6 py-3 ">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Sprout className="h-8 w-8 text-green-600 mr-2" />
                            <h1 className="text-2xl font-bold text-gray-800">Kisan Sahayak</h1>
                        </div>
                        <nav className="hidden md:flex space-x-8 items-center">
                            <a href="#features" className="text-green-600 hover:text-green-600 transition-colors">Features</a>
                            <a href="#about" className="text-green-600 hover:text-green-600 transition-colors">About</a>
                            <a href="#contact" className="text-green-600 hover:text-green-600 transition-colors">Contact</a>
                           
                        </nav>
                        <button className="md:hidden text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </button>
                    </div>
                </div>
            </header>
    )
}