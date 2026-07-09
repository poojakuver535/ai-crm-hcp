import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchInteractions,
  deleteInteraction,
} from "../store/slices/interactionSlice";

const InteractionList = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.interactions);

  useEffect(() => {
    dispatch(fetchInteractions());
  }, [dispatch]);

  const sentimentColor = {
    positive: "#28a745",
    neutral: "#ffc107",
    negative: "#dc3545",
  };

  if (loading)
    return <p style={{ textAlign: "center", padding: "40px" }}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Interaction History</h2>
      {list.length === 0 ? (
        <p style={{ color: "#888", textAlign: "center", padding: "40px" }}>
          No interactions logged yet
        </p>
      ) : (
        list.map((item) => (
          <div key={item.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <span style={styles.hcpName}>{item.hcp_name}</span>
                <span style={styles.specialty}>{item.hcp_specialty}</span>
              </div>
              <span
                style={{
                  ...styles.sentiment,
                  background: sentimentColor[item.sentiment] || "#888",
                }}
              >
                {item.sentiment}
              </span>
            </div>
            <div style={styles.meta}>
              <span>{item.interaction_type?.replace("_", " ")}</span>
              <span>
                {new Date(item.interaction_date).toLocaleDateString()}
              </span>
              {item.product_discussed && (
                <span>Product: {item.product_discussed}</span>
              )}
            </div>
            {item.key_topics && <p style={styles.topics}>{item.key_topics}</p>}
            <div style={styles.actions}>
              <button
                style={styles.deleteBtn}
                onClick={() => dispatch(deleteInteraction(item.id))}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: "700px", width: "100%" },
  title: { fontSize: "20px", fontWeight: 600, marginBottom: "16px" },
  card: {
    background: "#fff",
    borderRadius: "10px",
    padding: "18px",
    marginBottom: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hcpName: { fontSize: "16px", fontWeight: 600 },
  specialty: { fontSize: "13px", color: "#888", marginLeft: "8px" },
  sentiment: {
    padding: "3px 10px",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "capitalize",
  },
  meta: {
    display: "flex",
    gap: "16px",
    fontSize: "13px",
    color: "#666",
    marginTop: "8px",
    textTransform: "capitalize",
  },
  topics: {
    fontSize: "14px",
    color: "#444",
    marginTop: "10px",
    lineHeight: "1.5",
  },
  actions: { marginTop: "12px", display: "flex", gap: "8px" },
  deleteBtn: {
    padding: "4px 12px",
    background: "#fee",
    color: "#c33",
    border: "1px solid #fcc",
    borderRadius: "6px",
    fontSize: "12px",
    cursor: "pointer",
  },
};

export default InteractionList;
