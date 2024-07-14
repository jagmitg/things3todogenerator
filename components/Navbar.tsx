"use client";

import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white text-lg font-bold">Things3 Todo Generator</div>
                <div className="flex space-x-4">
                    <Link href="/" className="text-gray-300 hover:text-white">
                        Home
                    </Link>
                    <Link href="/history" className="text-gray-300 hover:text-white">
                        History
                    </Link>
                    <Link href="/custom" className="text-gray-300 hover:text-white">
                        Custom
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
