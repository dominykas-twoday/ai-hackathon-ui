import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./ApprovedExpenses.css";

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

export const ApprovedExpenses = () => {
  const [expenses, setExpenses] = useState<TaxReturn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supplierFilter, setSupplierFilter] = useState("");
  const [approvalTypeFilter, setApprovalTypeFilter] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      const res = await fetch(
        "http://localhost:8080/api/tax-returns/status/APPROVED",
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch approved expenses");
      }

      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = () => {
    // Prepare data for Excel export
    const exportData = expenses.map((expense) => ({
      "Supplier Name": expense.supplierName,
      "Total Amount": expense.totalAmount,
      "Purchase Date": expense.purchaseDate,
      "User Selected Approval": expense.userSelectedApproval,
      "Final Approval Type": expense.finalApprovalType,
      "Requires Director Approval": expense.requiresDirectorApproval
        ? "Yes"
        : "No",
      Status: expense.status,
      Notes: expense.notes,
      "Created Date": new Date(expense.createdAt).toLocaleDateString(),
      "Updated Date": new Date(expense.updatedAt).toLocaleDateString(),
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Approved Expenses");

    // Generate Excel file
    XLSX.writeFile(workbook, "approved_expenses.xlsx");
  };

  // Filtering logic
  const filteredExpenses = expenses.filter((expense) => {
    return (
      (supplierFilter === "" ||
        expense.supplierName
          .toLowerCase()
          .includes(supplierFilter.toLowerCase())) &&
      (approvalTypeFilter === "" ||
        expense.finalApprovalType === approvalTypeFilter)
    );
  });

  // Unique filter options
  const supplierOptions = Array.from(
    new Set(expenses.map((e) => e.supplierName))
  );
  const approvalTypeOptions = Array.from(
    new Set(expenses.map((e) => e.finalApprovalType))
  );

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

      {/* Filter controls */}
      <div
        className="expenses-filters"
        style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}
      >
        <div>
          <label style={{ color: "#a0a0a0", fontSize: "0.9rem" }}>
            Supplier
          </label>
          <select
            value={supplierFilter}
            onChange={(e) => setSupplierFilter(e.target.value)}
          >
            <option value="">All</option>
            {supplierOptions.map((supplier) => (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ color: "#a0a0a0", fontSize: "0.9rem" }}>
            Approval Type
          </label>
          <select
            value={approvalTypeFilter}
            onChange={(e) => setApprovalTypeFilter(e.target.value)}
          >
            <option value="">All</option>
            {approvalTypeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

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
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.supplierName}</td>
                <td>{expense.totalAmount}</td>
                <td>{new Date(expense.purchaseDate).toLocaleDateString()}</td>
                <td>{expense.userSelectedApproval}</td>
                <td>{expense.finalApprovalType}</td>
                <td>{expense.requiresDirectorApproval ? "Yes" : "No"}</td>
                <td>{expense.notes}</td>
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
