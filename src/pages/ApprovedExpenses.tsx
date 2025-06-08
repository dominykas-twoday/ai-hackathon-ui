import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import type { Expense, ExpenseStatus } from "../types/Expense";
import "./ApprovedExpenses.css";

export const ApprovedExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulating API call to fetch approved expenses
    const fetchExpenses = async () => {
      try {
        // Mock data - replace with actual API call
        const mockExpenses: Expense[] = [
          {
            id: "1",
            userId: "user1",
            userName: "John Doe",
            category: "Travel",
            amount: 150.0,
            currency: "EUR",
            description: "Train ticket to Berlin",
            receiptUrl: "https://example.com/receipt1.jpg",
            status: "approved" as ExpenseStatus,
            reimbursementEntity: "Your Company",
            createdAt: new Date("2024-03-15T10:00:00Z").toISOString(),
            updatedAt: new Date("2024-03-16T14:30:00Z").toISOString(),
          },
          {
            id: "2",
            userId: "user2",
            userName: "Jane Smith",
            category: "Representation",
            amount: 75.5,
            currency: "EUR",
            description: "Client lunch",
            receiptUrl: "https://example.com/receipt2.jpg",
            status: "approved" as ExpenseStatus,
            reimbursementEntity: "Project Company",
            projectCompanyName: "Tech Corp",
            projectName: "Website Redesign",
            createdAt: new Date("2024-03-14T15:20:00Z").toISOString(),
            updatedAt: new Date("2024-03-15T09:15:00Z").toISOString(),
          },
        ];

        setExpenses(mockExpenses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching expenses:", error);
        setError("Failed to fetch approved expenses");
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleExportToExcel = () => {
    // Prepare data for Excel export
    const exportData = expenses.map((expense) => ({
      "User Name": expense.userName,
      Category: expense.category,
      Amount: expense.amount,
      Currency: expense.currency,
      Description: expense.description,
      "Reimbursement Entity": expense.reimbursementEntity,
      "Project Company": expense.projectCompanyName || "N/A",
      "Project Name": expense.projectName || "N/A",
      "Created Date": new Date(expense.createdAt).toLocaleDateString(),
      "Approved Date": new Date(expense.updatedAt).toLocaleDateString(),
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Expenses");

    // Generate Excel file
    XLSX.writeFile(workbook, "approved_expenses.xlsx");
  };

  if (loading) {
    return <div className="loading">Loading approved expenses...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="approved-expenses">
      <div className="approved-expenses-header">
        <h1>Approved Expenses</h1>
        <button className="export-button" onClick={handleExportToExcel}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export to Excel
        </button>
      </div>

      <div className="expenses-table-container">
        <table className="expenses-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Reimbursement Entity</th>
              <th>Project Details</th>
              <th>Created Date</th>
              <th>Approved Date</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.userName}</td>
                <td>{expense.category}</td>
                <td>
                  {expense.amount} {expense.currency}
                </td>
                <td>{expense.description}</td>
                <td>{expense.reimbursementEntity}</td>
                <td>
                  {expense.projectCompanyName && expense.projectName ? (
                    <>
                      <div>{expense.projectCompanyName}</div>
                      <div className="project-name">{expense.projectName}</div>
                    </>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{new Date(expense.createdAt).toLocaleDateString()}</td>
                <td>{new Date(expense.updatedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovedExpenses;
