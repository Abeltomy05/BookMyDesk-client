import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type{ JSX } from "react";
import { getActiveSession } from "../helpers/getActiveSession"; 

interface ProtectedRouteProps {
	element: JSX.Element;
	allowedRoles: string[];
}

export const ProtectedRoute = ({
	element,
	allowedRoles,
}: ProtectedRouteProps) => {
	const location = useLocation();
	const session = useSelector(getActiveSession);
  console.log('the session',session)


  const path = location.pathname.toLowerCase();
  let inferredRole: string | null = null;
	if (path.startsWith("/vendor")) inferredRole = "vendor";
	else if (path.startsWith("/admin")) inferredRole = "admin";
	else inferredRole = "client";

	console.log("inferredRole", inferredRole);
	if (!session) {
		const loginRedirects: Record<string, string> = {
			client: "/login",
			vendor: "/vendor/login",
			admin: "/admin/login",
		};
		return <Navigate to={loginRedirects[inferredRole]} />;
	}

	const role = session.role;

	if (!role || !allowedRoles.includes(role)) {
		const loginRedirects: Record<string, string> = {
			client: "/login",
			vendor: "/vendor/login",
			admin: "/admin/login",
		};
	
		const redirectPath = loginRedirects[role as keyof typeof loginRedirects] || "/unauthorized";
		return <Navigate to={redirectPath} />;
	}
	
	return element;
};
