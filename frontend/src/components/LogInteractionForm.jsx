import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createInteraction } from "../store/slices/interactionSlice";

const LogInteractionForm = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    hcp_name: "",
    hcp_specialty: "",
    interaction_type: "in_person",
    interaction_date: "",
    product_discussed: "",
    key_topics: "",
    follow_up_actions: "",
    sentiment: "neutral",
    notes: "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(
      createInteraction({
        ...form,
        interaction_date: new Date(form.interaction_date).toISOString(),
      }),
    );
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setForm({
      hcp_name: "",
      hcp_specialty: "",
      interaction_type: "in_person",
      interaction_date: "",
      product_discussed: "",
      key_topics: "",
      follow_up_actions: "",
      sentiment: "neutral",
      notes: "",
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Log New Interaction</h2>
      {success && (
        <div style={styles.success}>Interaction logged successfully!</div>
      )}
      <div style={styles.form}>
        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>HCP Name *</label>
            <input
              style={styles.input}
              name="hcp_name"
              value={form.hcp_name}
              onChange={handleChange}
              placeholder="Dr. Jane Smith"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Specialty</label>
            <input
              style={styles.input}
              name="hcp_specialty"
              value={form.hcp_specialty}
              onChange={handleChange}
              placeholder="Cardiology"
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Interaction Type *</label>
            <select
              style={styles.input}
              name="interaction_type"
              value={form.interaction_type}
              onChange={handleChange}
            >
              <option value="in_person">In Person</option>
              <option value="phone_call">Phone Call</option>
              <option value="email">Email</option>
              <option value="video_call">Video Call</option>
              <option value="conference">Conference</option>
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Date *</label>
            <input
              style={styles.input}
              type="date"
              name="interaction_date"
              value={form.interaction_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.field}>
            <label style={styles.label}>Product Discussed</label>
            <input
              style={styles.input}
              name="product_discussed"
              value={form.product_discussed}
              onChange={handleChange}
              placeholder="Lipitor, Crestor..."
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Sentiment</label>
            <select
              style={styles.input}
              name="sentiment"
              value={form.sentiment}
              onChange={handleChange}
            >
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Key Topics</label>
          <textarea
            style={{ ...styles.input, height: "80px" }}
            name="key_topics"
            value={form.key_topics}
            onChange={handleChange}
            placeholder="Efficacy data, side effects, dosing..."
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Follow-up Actions</label>
          <textarea
            style={{ ...styles.input, height: "80px" }}
            name="follow_up_actions"
            value={form.follow_up_actions}
            onChange={handleChange}
            placeholder="Send clinical study, schedule follow-up..."
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Notes</label>
          <textarea
            style={{ ...styles.input, height: "80px" }}
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Additional observations..."
          />
        </div>

        <button style={styles.button} onClick={handleSubmit}>
          Log Interaction
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: "#fff",
    borderRadius: "12px",
    padding: "28px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    maxWidth: "700px",
    width: "100%",
  },
  title: {
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "20px",
    color: "#1a1a2e",
  },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  row: { display: "flex", gap: "16px" },
  field: { flex: 1, display: "flex", flexDirection: "column" },
  label: {
    fontSize: "13px",
    fontWeight: 500,
    marginBottom: "6px",
    color: "#555",
  },
  input: {
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "Inter",
    outline: "none",
    resize: "vertical",
  },
  button: {
    padding: "12px",
    background: "#4361ee",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "8px",
  },
  success: {
    padding: "12px",
    background: "#d4edda",
    color: "#155724",
    borderRadius: "8px",
    marginBottom: "12px",
    fontSize: "14px",
  },
};

export default LogInteractionForm;
