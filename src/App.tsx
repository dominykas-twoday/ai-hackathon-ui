import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import ExpenseForm from "./components/ExpenseForm";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import AdminPanel from "./pages/AdminPanel";
import ApprovedExpenses from "./pages/ApprovedExpenses";
import ExpenseApprovals from "./pages/ExpenseApprovals";

function useAuthMagicLink() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check for token in URL
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("auth_token", token);
      setIsAuthenticated(true);
      // Remove token from URL
      window.history.replaceState({}, document.title, location.pathname);
    } else {
      // Check localStorage
      const stored = localStorage.getItem("auth_token");
      setIsAuthenticated(!!stored);
    }
  }, [location.search, location.pathname]);

  return isAuthenticated;
}

function AppRoutes() {
  const isAuthenticated = useAuthMagicLink();

  return isAuthenticated ? (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/form" replace />} />
          <Route path="/form" element={<ExpenseForm />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/expenses" element={<ExpenseApprovals />} />
          <Route path="/approved" element={<ApprovedExpenses />} />
          <Route path="*" element={<Navigate to="/form" replace />} />
        </Routes>
      </main>
    </div>
  ) : (
    <Routes>
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
