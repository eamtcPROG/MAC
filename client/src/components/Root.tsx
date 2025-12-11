import { createBrowserRouter } from "react-router";
import { HomePage } from "../pages/HomePage";
import { AdminPage } from "../pages/AdminPage";

const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/admin",
      element: <AdminPage />,
    },
  ]);

  export { router };