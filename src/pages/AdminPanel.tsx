import { useEffect, useState } from "react";
import type { User, UserRole } from "../types/User";
import "./AdminPanel.css";

const ROLE_OPTIONS: UserRole[] = [
  "USER",
  "COACH",
  "COMMITTEE_LEAD",
  "DIRECTOR",
  "ADMIN",
];

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleChangeError, setRoleChangeError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:8080/users", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setRoleChangeError(null);
    const token = localStorage.getItem("auth_token");
    try {
      const res = await fetch("http://localhost:8080/roles/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId, newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch {
      setRoleChangeError("Failed to update user role. Please try again.");
    }
  };

  if (loading) {
    return <div className="admin-panel-loading">Loading...</div>;
  }

  if (error) {
    return <div className="admin-panel-error">{error}</div>;
  }

  return (
    <div className="admin-panel">
      <h1>User Management</h1>
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Verified</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.verified ? "Yes" : "No"}</td>
                <td>{user.role}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value as UserRole)
                    }
                    className="role-select"
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {roleChangeError && (
          <div className="admin-panel-error">{roleChangeError}</div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
