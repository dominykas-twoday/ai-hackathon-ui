import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt with:", email);
    // For now, we'll just navigate to the form page
    navigate("/form");
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Expense Portal</h1>
        <p className="subtitle">Submit and track your company expenses</p>
        <div className="form-group">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your company email"
            required
          />
        </div>
        <button type="submit" className="login-button">
          Log in
        </button>
      </form>
    </div>
  );
};

export default Login;
