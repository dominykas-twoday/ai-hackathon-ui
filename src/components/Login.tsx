import { useState } from "react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setMessage("Check your email for a magic login link.");
      } else {
        setMessage("Failed to send login email. Please try again.");
      }
    } catch {
      setMessage("Failed to send login email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>Expense manager</h1>
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
        <button type="submit" className="login-button" disabled={loading}>
          {loading ? "Sending..." : "Log in"}
        </button>
        {message && (
          <div
            style={{ marginTop: "1rem", color: "#1de782", textAlign: "center" }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
