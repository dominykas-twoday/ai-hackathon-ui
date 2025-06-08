import { useEffect, useState } from "react";
import type { Expense, ExpenseStatus } from "../types/Expense";
import "./ExpenseApprovals.css";

// Mock data for development
const mockExpenses: Expense[] = [
  {
    id: "1",
    userId: "1",
    userName: "John Doe",
    category: "travel",
    amount: 150.5,
    currency: "EUR",
    description: "Train ticket to client meeting",
    receiptUrl: "/receipts/train-ticket.jpg",
    status: "pending",
    reimbursementEntity: "company",
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "2",
    userName: "Jane Smith",
    category: "representation",
    amount: 85.0,
    currency: "EUR",
    description: "Client dinner",
    receiptUrl: "/receipts/dinner.jpg",
    status: "pending",
    reimbursementEntity: "project",
    projectCompanyName: "Tech Corp",
    projectName: "Website Redesign",
    createdAt: "2024-03-14T15:30:00Z",
    updatedAt: "2024-03-14T15:30:00Z",
  },
  {
    id: "3",
    userId: "3",
    userName: "Bob Wilson",
    category: "general",
    amount: 45.99,
    currency: "EUR",
    description: "Office supplies",
    receiptUrl: "/receipts/supplies.jpg",
    status: "approved",
    reimbursementEntity: "company",
    createdAt: "2024-03-13T09:15:00Z",
    updatedAt: "2024-03-13T09:15:00Z",
  },
];

const ExpenseApprovals = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setExpenses(mockExpenses);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    expenseId: string,
    newStatus: ExpenseStatus
  ) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      setExpenses(
        expenses.map((expense) =>
          expense.id === expenseId
            ? {
                ...expense,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : expense
        )
      );
      setSelectedExpense(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const getStatusClass = (status: ExpenseStatus) => {
    switch (status) {
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      default:
        return "status-pending";
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
              <th>User</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.userName}</td>
                <td>{expense.category}</td>
                <td>{`${expense.amount} ${expense.currency}`}</td>
                <td>{expense.description}</td>
                <td>
                  <span
                    className={`status-badge ${getStatusClass(expense.status)}`}
                  >
                    {expense.status}
                  </span>
                </td>
                <td>{new Date(expense.createdAt).toLocaleDateString()}</td>
                <td>
                  {expense.status === "pending" && (
                    <div className="action-buttons">
                      <button
                        className="approve-button"
                        onClick={() =>
                          handleStatusChange(expense.id, "approved")
                        }
                      >
                        Approve
                      </button>
                      <button
                        className="reject-button"
                        onClick={() =>
                          handleStatusChange(expense.id, "rejected")
                        }
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  <button
                    className="view-button"
                    onClick={() => setSelectedExpense(expense)}
                  >
                    View Details
                  </button>
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
                <label>User:</label>
                <span>{selectedExpense.userName}</span>
              </div>
              <div className="detail-item">
                <label>Category:</label>
                <span>{selectedExpense.category}</span>
              </div>
              <div className="detail-item">
                <label>Amount:</label>
                <span>{`${selectedExpense.amount} ${selectedExpense.currency}`}</span>
              </div>
              <div className="detail-item">
                <label>Description:</label>
                <span>{selectedExpense.description}</span>
              </div>
              <div className="detail-item">
                <label>Status:</label>
                <span
                  className={`status-badge ${getStatusClass(
                    selectedExpense.status
                  )}`}
                >
                  {selectedExpense.status}
                </span>
              </div>
              <div className="detail-item">
                <label>Reimbursement:</label>
                <span>{selectedExpense.reimbursementEntity}</span>
              </div>
              {selectedExpense.projectCompanyName && (
                <div className="detail-item">
                  <label>Project Company:</label>
                  <span>{selectedExpense.projectCompanyName}</span>
                </div>
              )}
              {selectedExpense.projectName && (
                <div className="detail-item">
                  <label>Project Name:</label>
                  <span>{selectedExpense.projectName}</span>
                </div>
              )}
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
            <div className="receipt-preview">
              <img src={selectedExpense.receiptUrl} alt="Receipt" />
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
