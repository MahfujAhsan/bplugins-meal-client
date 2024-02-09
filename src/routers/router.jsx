import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Error from "../shared/Error";
import Dashboard from "../pages/Dashboard";
import Signup from "../shared/Signup";
import Signin from "../shared/Signin";
import PrivateRoute from "../shared/PrivateRoute";
import Meal from "../pages/Meal";
import Profile from "../pages/Profile";
import Deposit from "../pages/Deposit";
import Users from "../pages/Users";
import SkipMeals from "../pages/SkipMeals";
import Wallets from "../pages/Wallets";
import YourWallet from "../pages/YourWallet";
import EditWallet from "../pages/EditWallet";
import DailyCost from "../pages/DailyCost";
import Expenses from "../pages/Expenses";

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