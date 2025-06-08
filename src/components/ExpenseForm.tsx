import { useState } from "react";
import "./ExpenseForm.css";

const ExpenseForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    category: "",
    description: "",
    receipt: null as File | null,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission logic here
  };

  const nextStep = () => {
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
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
      <p className="step-description">Now, let's add the expense details</p>
      <div className="form-group">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          placeholder="Date of expense"
        />
      </div>

      <div className="form-group">
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          placeholder="Amount"
          min="0"
          step="0.01"
        />
      </div>

      <div className="form-group">
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          <option value="travel">Travel</option>
          <option value="meals">Meals</option>
          <option value="accommodation">Accommodation</option>
          <option value="office">Office Supplies</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Description of expense"
          rows={4}
        />
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
        {step === 1 ? renderStep1() : renderStep2()}
      </form>
    </div>
  );
};

export default ExpenseForm;
