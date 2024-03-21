import {createBrowserRouter } from "react-router-dom";

import {
    LoginPage,
    RegisterPage,
    MainPage,
    AddPetPage,
} from "../pages";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainPage />
    },
    {
        path: "/addpet",
        element: <AddPetPage />
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    }
]);

export default router;