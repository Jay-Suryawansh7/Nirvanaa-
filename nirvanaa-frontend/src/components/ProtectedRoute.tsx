import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

interface DecodedToken {
  exp: number;
  userId: string;
  role: string;
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!token) {
        setIsValid(false);
        return;
    }

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
            // Token expired - try refresh? 
            // Ideally, we rely on the API interceptor to refresh. 
            // But for a Guard, if initial load has expired token, we might want to let it pass 
            // and let the API call trigger the refresh flow, OR attempt refresh here.
            // Simplified: If expired, treat as invalid.
            // BETTER: If expired, let the AppLayout/Dashboard make an API call which triggers the interceptor.
            // HOWEVER, the user asked to not show the dashboard if invalid.
            // So we mark invalid.
             setIsValid(false);
             localStorage.removeItem("token"); // Cleanup
        } else {
             setIsValid(true);
        }
    } catch (e) {
        setIsValid(false);
    }
  }, [token]);

  if (isValid === null) {
      // Loading state could go here, or just return null to render nothing
      return null; 
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />; // Or unauthorized page
  }

  return <Outlet />;
}
