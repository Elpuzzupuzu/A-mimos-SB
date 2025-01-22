import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  console.log(location.pathname, isAuthenticated);

  // Permite el acceso a la página de recuperación de contraseña sin estar autenticado
  if (!isAuthenticated && location.pathname === "/auth/recover-password") {
    return <>{children}</>;
  }

  // Si el usuario no está autenticado, redirige a la página de login
  if (!isAuthenticated) {
    if (
      !location.pathname.includes("/login") &&
      !location.pathname.includes("/register")
    ) {
      return <Navigate to="/auth/login" replace />;
    }
  }

  // Si el usuario está autenticado y está intentando acceder a login/register, redirige según el rol
  if (
    isAuthenticated &&
    (location.pathname.includes("/login") || location.pathname.includes("/register"))
  ) {
    return user?.role === "admin" ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      <Navigate to="/shop/home" replace />
    );
  }

  // Si el usuario está autenticado pero no es admin y está intentando acceder a rutas de admin
  if (isAuthenticated && user?.role !== "admin" && location.pathname.includes("/admin")) {
    return <Navigate to="/unauth-page" replace />;
  }

  // Si el usuario es admin y está intentando acceder a rutas de shop
  if (isAuthenticated && user?.role === "admin" && location.pathname.includes("/shop")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Si ninguna de las condiciones anteriores aplica, renderiza los hijos
  return <>{children}</>;
}

export default CheckAuth;
