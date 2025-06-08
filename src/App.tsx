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
import ExpenseApprovals from "./pages/ExpenseApprovals";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/form" element={<ExpenseForm />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/expenses" element={<ExpenseApprovals />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
