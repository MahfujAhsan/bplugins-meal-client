import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import DailyCost from "../pages/DailyCost";
import Dashboard from "../pages/Dashboard";
import Deposit from "../pages/Deposit";
import EditWallet from "../pages/EditWallet";
import Expenses from "../pages/Expenses";
import Meal from "../pages/Meal";
import Profile from "../pages/Profile";
import SkipMeals from "../pages/SkipMeals";
import Users from "../pages/Users";
import Wallets from "../pages/Wallets";
import YourWallet from "../pages/YourWallet";
import Error from "../shared/Error";
import PrivateRoute from "../shared/PrivateRoute";
import Signin from "../shared/Signin";
import Signup from "../shared/Signup";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        errorElement: <Error />,
        children: [
            {
                path: "/",
                element: <PrivateRoute><Dashboard /></PrivateRoute>
            },
            {
                path: "/meal",
                element: <PrivateRoute><Meal /></PrivateRoute>
            },
            {
                path: "/skip-meals",
                element: <PrivateRoute><SkipMeals /></PrivateRoute>
            },
            {
                path: "/deposit",
                element: <PrivateRoute><Deposit /></PrivateRoute>
            },
            {
                path: "/wallets",
                element: <PrivateRoute><Wallets /></PrivateRoute>
            },
            {
                path: "/wallets/:id",
                element: <PrivateRoute><EditWallet /></PrivateRoute>
            },
            {
                path: "/wallet",
                element: <PrivateRoute><YourWallet /></PrivateRoute>
            },

            {
                path: "/daily-cost",
                element: <PrivateRoute><DailyCost /></PrivateRoute>
            },

            {
                path: "/expenses",
                element: <PrivateRoute><Expenses /></PrivateRoute>
            },

            {
                path: "/users",
                element: <PrivateRoute><Users /></PrivateRoute>
            },
            {
                path: "/profile",
                element: <PrivateRoute><Profile /></PrivateRoute>
            },
            // {
            //     path: "/sign-up",
            //     element: <Signup />
            // },
            // {
            //     path: "/sign-in",
            //     element: <Signin />
            // },
        ]
    },
    {
        path: "/sign-up",
        element: <Signup />
    },
    {
        path: "/sign-in",
        element: <Signin />
    },
])

export default router;