import { useEffect, useState } from "react";
import "./ExpenseApprovals.css";

interface TaxReturn {
  id: number;
  documentId: number;
  supplierName: string;
  totalAmount: number;
  purchaseDate: string;
  userSelectedApproval: string;
  finalApprovalType: string;
  requiresDirectorApproval: boolean;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const ExpenseApprovals = () => {
  const [expenses, setExpenses] = useState<TaxReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<TaxReturn | null>(
    null
  );

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      const res = await fetch(
        "http://localhost:8080/api/tax-returns/status/PENDING",
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch pending expenses");
      }

      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (expenseId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem("auth_token");
      let endpoint = "";
      const method = "POST";

      if (newStatus === "APPROVED") {
        endpoint = `http://localhost:8080/api/tax-returns/${expenseId}/approve`;
      } else if (newStatus === "REJECTED") {
        endpoint = `http://localhost:8080/api/tax-returns/${expenseId}/reject`;
      }

      const res = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        throw new Error("Failed to update expense status");
      }

      // Refresh the list after successful update
      await fetchExpenses();
      setSelectedExpense(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (loading) {
    return <div className="expense-approvals-loading">Loading...</div>;
  }

  if (error) {
    return <div className="expense-approvals-error">{error}</div>;
  }

  return (
    <div className="expense-approvals">
      <h1>Pending Approvals</h1>
      <div className="expenses-table-container">
        <table className="expenses-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th>Amount</th>
              <th>Purchase Date</th>
              <th>User Approval</th>
              <th>Final Approval</th>
              <th>Director Approval</th>
              <th>Notes</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.supplierName}</td>
                <td>{expense.totalAmount}</td>
                <td>{new Date(expense.purchaseDate).toLocaleDateString()}</td>
                <td>{expense.userSelectedApproval}</td>
                <td>{expense.finalApprovalType}</td>
                <td>{expense.requiresDirectorApproval ? "Yes" : "No"}</td>
                <td>{expense.notes}</td>
                <td>{new Date(expense.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="approve-button"
                      onClick={() => handleStatusChange(expense.id, "APPROVED")}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleStatusChange(expense.id, "REJECTED")}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedExpense && (
        <div className="expense-details-modal">
          <div className="modal-content">
            <h2>Expense Details</h2>
            <div className="details-grid">
              <div className="detail-item">
                <label>Supplier:</label>
                <span>{selectedExpense.supplierName}</span>
              </div>
              <div className="detail-item">
                <label>Amount:</label>
                <span>{selectedExpense.totalAmount}</span>
              </div>
              <div className="detail-item">
                <label>Purchase Date:</label>
                <span>
                  {new Date(selectedExpense.purchaseDate).toLocaleDateString()}
                </span>
              </div>
              <div className="detail-item">
                <label>User Approval:</label>
                <span>{selectedExpense.userSelectedApproval}</span>
              </div>
              <div className="detail-item">
                <label>Final Approval:</label>
                <span>{selectedExpense.finalApprovalType}</span>
              </div>
              <div className="detail-item">
                <label>Director Approval Required:</label>
                <span>
                  {selectedExpense.requiresDirectorApproval ? "Yes" : "No"}
                </span>
              </div>
              <div className="detail-item">
                <label>Notes:</label>
                <span>{selectedExpense.notes}</span>
              </div>
              <div className="detail-item">
                <label>Created:</label>
                <span>
                  {new Date(selectedExpense.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="detail-item">
                <label>Last Updated:</label>
                <span>
                  {new Date(selectedExpense.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
            <button
              className="close-button"
              onClick={() => setSelectedExpense(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseApprovals;
