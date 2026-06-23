import { Navigate } from "react-router-dom";
import { useStore } from "@/store/useStore";

export default function ProtectedRoute({ children }) {
  const activeUser = useStore((state) => state.activeUser);

  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
