import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";
import LogInteractionForm from "./components/LogInteractionForm";
import ChatInterface from "./components/ChatInterface";
import InteractionList from "./components/InteractionList";

function App() {
  const [activeTab, setActiveTab] = useState("form");

  return (
    <Provider store={store}>
      <div style={styles.app}>
        <header style={styles.header}>
          <h1 style={styles.logo}>HCP CRM</h1>
          <p style={styles.subtitle}>AI-Powered Interaction Logger</p>
        </header>

        <nav style={styles.nav}>
          {["form", "chat", "history"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tab,
                ...(activeTab === tab ? styles.activeTab : {}),
              }}
            >
              {tab === "form"
                ? "Log (Form)"
                : tab === "chat"
                  ? "Log (AI Chat)"
                  : "History"}
            </button>
          ))}
        </nav>

        <main style={styles.main}>
          {activeTab === "form" && <LogInteractionForm />}
          {activeTab === "chat" && <ChatInterface />}
          {activeTab === "history" && <InteractionList />}
        </main>
      </div>
    </Provider>
  );
}

const styles = {
  app: { minHeight: "100vh", background: "#f5f7fa" },
  header: {
    background: "#1a1a2e",
    color: "#fff",
    padding: "24px 32px",
    textAlign: "center",
  },
  logo: { fontSize: "26px", fontWeight: 700, letterSpacing: "-0.5px" },
  subtitle: { fontSize: "14px", color: "#a0a0c0", marginTop: "4px" },
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    padding: "16px",
    background: "#fff",
    borderBottom: "1px solid #eee",
  },
  tab: {
    padding: "10px 24px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    background: "#fff",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "Inter",
  },
  activeTab: { background: "#4361ee", color: "#fff", borderColor: "#4361ee" },
  main: { display: "flex", justifyContent: "center", padding: "32px 20px" },
};

export default App;
