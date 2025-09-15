import React from 'react';
export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-6 py-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-2">Kisan Sahayak</h3>
                        <p className="text-gray-400">Farming smarter, not harder.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul>
                            <li className="mb-2"><a href="#" className="hover:text-green-400 transition-colors">Home</a></li>
                            <li className="mb-2"><a href="#features" className="hover:text-green-400 transition-colors">Features</a></li>
                            <li className="mb-2"><a href="#" className="hover:text-green-400 transition-colors">Pricing</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul>
                            <li className="mb-2"><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
                            <li className="mb-2"><a href="#features" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                    <div id="contact">
                        <h3 className="font-semibold mb-4">Contact Us</h3>
                        <p className="text-gray-400">KisanSahayak@gmail.com</p>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Kisan Sahayak. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}