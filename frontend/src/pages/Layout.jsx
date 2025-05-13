import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SideBar from '@/components/SideBar';

const Layout = () => {
    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <SideBar />
                <main className="flex-1 p-4 overflow-auto bg-gray-50">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
