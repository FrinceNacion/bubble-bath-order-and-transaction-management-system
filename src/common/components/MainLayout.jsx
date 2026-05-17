import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "./SideBar";
import Authenticate from "../utils/Authenticate";
import { useEffect, useState } from "react";

function MainLayout() {
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const result = await Authenticate();
            if (result.success) {
                setUser(result.user);
            } else {
                navigate('/login');
            }
        };

        fetchUser();
    }, [navigate]);

    return (
        <div className="p-0 m-0 d-flex w-100 min-vh-100 bg-light flex-column flex-md-row">
            {/* Mobile Header (Visible only on small screens) */}
            <div className="d-flex d-md-none align-items-center justify-content-between p-3 bg-white border-bottom shadow-sm">
                <div className="d-flex align-items-center gap-2">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-3 bg-primary" style={{ width: 32, height: 32 }}>
                        <i className="bi bi-droplet-fill text-white fs-6"></i>
                    </div>
                    <span className="fw-semibold text-dark">Bubble Bath</span>
                </div>
                <button
                    className="btn btn-light border-0 p-2"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <i className="bi bi-list fs-4 text-dark"></i>
                </button>
            </div>

            <SideBar user={user} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex-fill d-flex flex-column" style={{ overflowX: "hidden" }}>
                <Outlet />
            </div>
        </div>
    );
}

export default MainLayout;