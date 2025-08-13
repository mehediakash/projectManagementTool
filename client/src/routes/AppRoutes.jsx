import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "../components/Layout/AppLayout";
import RoleGuard from "../components/RoleGuard";

const Dashboard = lazy(()=>import("../pages/Dashboard"));
const Login = lazy(()=>import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const Projects = lazy(() => import("../pages/Projects"));
const NotFound = lazy(()=>import("../pages/NotFound"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { 
        path: "projects", 
        element: (
          <RoleGuard allow={["admin", "manager"]}>
            <Projects />
          </RoleGuard>
        )
      },
      { path: "*", element: <NotFound /> },
    ]
  }
]);

export default function AppRoutes(){
  return (
    <Suspense fallback={<div style={{padding:24}}>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
