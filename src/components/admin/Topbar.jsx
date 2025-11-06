import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Topbar({ onMenuClick }) {
    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm p-4 flex items-center justify-between z-20 md:left-64">
            <button className="md:hidden text-gray-700" onClick={onMenuClick}>
                <Menu size={24} />
            </button>

            <div className="flex-1 flex justify-center">
                <h2 className="text-lg font-semibold text-gray-800 hidden md:block">
                    Admin Control Panel
                </h2>
            </div>
            
            <Button
                variant="outline"
                className="flex items-center gap-2"
            >
                <LogOut size={18} /> Logout
            </Button>
        </header>
    );
}
