/* eslint-disable react/prop-types */
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useManager from "../hooks/useManager";
import Spinner from "./Spinner";


const ManagerRoute = ({ children }) => {
    const { user, loading } = useAuth();

    const [isManager, isManagerLoading] = useManager();

    const location = useLocation();

    if (loading || isManagerLoading) {
        return <Spinner />
    }

    if (user && isManager) {
        return children;
    }
    return <Navigate to="/" state={{ from: location }} replace></Navigate>
}

export default ManagerRoute