import { useState } from "react";
import "./ExpenseForm.css";

const ExpenseForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "general",
    receipt: null as File | null,
    reimbursementEntity: "company",
    projectCompanyName: "",
    projectName: "",
    supplierName: "",
    purchaseDate: "",
    invoiceAmount: "",
    paymentMethod: "",
    documentId: undefined as number | undefined,
    originalFilename: "",
    contentType: "",
    fileSize: undefined as number | undefined,
    processingStatus: "",
    errorMessage: null as string | null,
    createdAt: "",
    updatedAt: "",
    userSelectedApproval: "COMITET",
    notes: "",
  });
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        receipt: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitMessage("");
    try {
      const token = localStorage.getItem("auth_token");
      const payload = {
        documentId: formData.documentId,
        supplierName: formData.supplierName,
        totalAmount: formData.invoiceAmount.replace(",", "."),
        purchaseDate: formData.purchaseDate,
        userSelectedApproval: formData.userSelectedApproval,
        notes: formData.notes,
      };
      const res = await fetch("http://localhost:8080/api/tax-returns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitMessage("Expense submitted successfully!");
      } else {
        setSubmitMessage("Failed to submit expense. Please try again.");
      }
    } catch {
      setSubmitMessage("Failed to submit expense. Please try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const nextStep = async () => {
    setUploadError("");
    if (step === 1 && !formData.receipt) {
      return;
    }
    if (step === 1) {
      setLoadingDetails(true);
      // Upload file to backend
      const data = new FormData();
      data.append("file", formData.receipt!);
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch("http://localhost:8080/api/documents/upload", {
          method: "POST",
          body: data,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) {
          throw new Error("Upload failed");
        }
        const docData = await res.json();
        setFormData((prev) => ({
          ...prev,
          documentId: docData.documentId,
          originalFilename: docData.originalFilename,
          contentType: docData.contentType,
          fileSize: docData.fileSize,
          processingStatus: docData.processingStatus,
          errorMessage: docData.errorMessage,
          createdAt: docData.createdAt,
          updatedAt: docData.updatedAt,
          supplierName: docData.supplierName || "",
          purchaseDate: docData.purchaseDate || "",
          invoiceAmount: docData.totalAmount
            ? docData.totalAmount.replace(/[^\d.,]/g, "")
            : "",
        }));
      } catch {
        setUploadError("Failed to upload file. Please try again.");
        setLoadingDetails(false);
        return;
      }
      setLoadingDetails(false);
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const renderStep1 = () => (
    <>
      <h1>Upload Receipt</h1>
      <p className="step-description">First, let's upload your receipt</p>
      <div className="form-group">
        <label className="file-upload">
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            required
          />
          <span>Click to upload receipt</span>
        </label>
        {formData.receipt && (
          <p className="file-name">{formData.receipt.name}</p>
        )}
      </div>
      <button
        type="button"
        className={`next-button ${!formData.receipt ? "disabled" : ""}`}
        onClick={nextStep}
        disabled={!formData.receipt || loadingDetails}
      >
        {loadingDetails ? "Uploading..." : "Next Step"}
      </button>
      {uploadError && (
        <div style={{ color: "#ef4444", marginTop: 12 }}>{uploadError}</div>
      )}
    </>
  );

  const renderStep2 = () => (
    <>
      <h1>Verify Expense Details</h1>
      <p className="step-description">Check and complete the details below</p>
      <div className="form-group">
        <label>Supplier Name</label>
        <input
          type="text"
          name="supplierName"
          value={formData.supplierName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Purchase Date</label>
        <input
          type="date"
          name="purchaseDate"
          value={formData.purchaseDate}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Invoice Amount</label>
        <input
          type="text"
          name="invoiceAmount"
          value={formData.invoiceAmount}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label>Payment Method</label>
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
        >
          <option value="">Select method</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cash">Cash</option>
        </select>
      </div>
      <div className="button-group">
        <button type="button" className="back-button" onClick={prevStep}>
          Back
        </button>
        <button type="button" className="next-button" onClick={nextStep}>
          Next Step
        </button>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <h1>Expense Details</h1>
      <p className="step-description">Select the expense category</p>
      <div className="form-group">
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="category"
              value="general"
              checked={formData.category === "general"}
              onChange={handleChange}
              required
            />
            <span>General Expense</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="category"
              value="travel"
              checked={formData.category === "travel"}
              onChange={handleChange}
              required
            />
            <span>Travel Expense</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="category"
              value="representation"
              checked={formData.category === "representation"}
              onChange={handleChange}
              required
            />
            <span>Representation</span>
          </label>
        </div>
      </div>

      <div className="button-group">
        <button type="button" className="back-button" onClick={prevStep}>
          Back
        </button>
        <button type="button" className="next-button" onClick={nextStep}>
          Next Step
        </button>
      </div>
    </>
  );

  const renderStep4 = () => (
    <>
      <h1>Reimbursement</h1>
      <p className="step-description">Select who will reimburse your expense</p>
      <div className="form-group">
        <div className="radio-group">
          <label className="radio-option">
            <input
              type="radio"
              name="reimbursementEntity"
              value="company"
              checked={formData.reimbursementEntity === "company"}
              onChange={handleChange}
              required
            />
            <span>Your Company</span>
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="reimbursementEntity"
              value="project"
              checked={formData.reimbursementEntity === "project"}
              onChange={handleChange}
              required
            />
            <span>Project Company</span>
          </label>
        </div>

        {formData.reimbursementEntity === "project" && (
          <div className="project-details">
            <div className="form-group">
              <input
                type="text"
                name="projectCompanyName"
                value={formData.projectCompanyName}
                onChange={handleChange}
                placeholder="Enter project company name"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Enter project name"
                required
              />
            </div>
          </div>
        )}
      </div>

      <div className="form-group">
        <label>User Selected Approval</label>
        <select
          name="userSelectedApproval"
          value={formData.userSelectedApproval}
          onChange={handleChange}
          required
        >
          <option value="COACH">COACH</option>
          <option value="COMITET">COMITET</option>
        </select>
      </div>
      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Additional notes (optional)"
        />
      </div>
      <div className="button-group">
        <button type="button" className="back-button" onClick={prevStep}>
          Back
        </button>
        <button
          type="submit"
          className="submit-button"
          disabled={submitLoading}
        >
          {submitLoading ? "Submitting..." : "Submit Expense"}
        </button>
      </div>
      {submitMessage && (
        <div
          style={{
            marginTop: 12,
            color: submitMessage.includes("success") ? "#1de782" : "#ef4444",
            textAlign: "center",
          }}
        >
          {submitMessage}
        </div>
      )}
    </>
  );

  return (
    <div className="expense-form-page">
      <h1>New Expense</h1>
      <div className="expense-form-container">
        <form onSubmit={handleSubmit} className="expense-form">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
