import { Outlet, useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import Authenticate from "../utils/Authenticate";
import { useEffect, useState } from "react";

function MainPage() {
    const [user, setUser] = useState(null);
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
    }, []);

    return (
        <div className="p-0 m-0 d-flex w-100 min-vh-100 bg-light">
            <SideBar user={user} />
            <Outlet />
        </div>
    );
}

export default MainPage;