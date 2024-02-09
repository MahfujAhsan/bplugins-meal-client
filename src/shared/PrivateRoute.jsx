/* eslint-disable react/prop-types */
import { Navigate, useLocation } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import Spinner from './Spinner';


const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <Spinner />
    }

    if (user) {
        return children;
    }
    return <Navigate to="/sign-in" state={{ from: location }}></Navigate>;
};

export default PrivateRoute;