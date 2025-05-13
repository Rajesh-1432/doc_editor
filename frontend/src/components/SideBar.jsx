import { Bot, House, File } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const tabs = [
    { name: "Home", path: "/generator/", icon: <House /> },
    { name: "MyDocuments", path: "/my-documents", icon: <File /> },
    { name: "AiWorkspace", path: "/ai-workspace", icon: <Bot /> },
];

const SideBar = () => {
    return (
        <div className="w-56 h-full pt-4 flex flex-col gap-4 border-t border-r rounded-tr-md p-2">
            <div className="flex justify-center">
                <button className="flex items-center gap-1 px-8 py-2 text-sm font-semibold border rounded-2xl shadow-md">
                    New Chat +
                </button>
            </div>

            <ul className="space-y-2">
                {tabs.map((tab) => (
                    <li key={tab.name}>
                        <NavLink
                            to={tab.path}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2 rounded text-sm ${isActive ? "text-[#EB1700]" : "hover:text-[#EB1700]"}`
                            }
                        >
                            <span className="text-base">{tab.icon}</span>
                            {tab.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideBar;
