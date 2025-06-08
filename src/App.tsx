import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import ExpenseForm from "./components/ExpenseForm";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import AdminPanel from "./pages/AdminPanel";
import ApprovedExpenses from "./pages/ApprovedExpenses";
import ExpenseApprovals from "./pages/ExpenseApprovals";

function App() {
  // Mock authentication state - replace with actual auth logic
  const isAuthenticated = true;

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && <Sidebar />}
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/form" replace /> : <Login />
              }
            />
            <Route
              path="/form"
              element={
                isAuthenticated ? <ExpenseForm /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/admin"
              element={
                isAuthenticated ? <AdminPanel /> : <Navigate to="/" replace />
              }
            />
            <Route
              path="/expenses"
              element={
                isAuthenticated ? (
                  <ExpenseApprovals />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/approved"
              element={
                isAuthenticated ? (
                  <ApprovedExpenses />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
