import { CircleUser } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <div className="h-16 bg-white flex justify-between items-center px-8">
            <NavLink to="/generator/" className="text-lg font-semibold text-black">
                MedSpecMate
            </NavLink>
            <NavLink to="/profile">
                <CircleUser className="w-7 h-7 text-black hover:text-blue-600 transition-colors duration-200" />
            </NavLink>
        </div>
    )
}

export default Navbar