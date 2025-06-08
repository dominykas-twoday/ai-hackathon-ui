import { useState } from "react";
import "./ExpenseForm.css";

const ExpenseForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: "",
    receipt: null as File | null,
    reimbursementEntity: "",
    projectCompanyName: "",
    projectName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

  const nextStep = () => {
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
      <button type="button" className="next-button" onClick={nextStep}>
        Next Step
      </button>
    </>
  );

  const renderStep2 = () => (
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

  const renderStep3 = () => (
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

      <div className="button-group">
        <button type="button" className="back-button" onClick={prevStep}>
          Back
        </button>
        <button type="submit" className="submit-button">
          Submit Expense
        </button>
      </div>
    </>
  );

  return (
    <div className="expense-form-container">
      <form onSubmit={handleSubmit} className="expense-form">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </form>
    </div>
  );
};

export default ExpenseForm;
