import { useState } from "react";

const BACKEND_URL = "http://localhost:5000"; // backend base URL

function App() {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectParam = searchParams.get("redirect");

      let parsedParams = {};
      try {
        parsedParams = redirectParam
          ? JSON.parse(decodeURIComponent(redirectParam))
          : {};
      } catch (err) {
        console.error("Invalid redirect param", err);
      }

      const bodyData = {
        ...parsedParams,
        email: "john.doe@example.com", // replace with dynamic email if needed
        approve: true,
      };

      const response = await fetch(`${BACKEND_URL}/api/zapier/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show backend message in alert
        const errorMessage =
          data?.message || data?.error || "Something went wrong";
        throw new Error(errorMessage);
      }

      const { redirect_uri, code, state } = data;

      if (redirect_uri) {
        const url = new URL(redirect_uri);
        url.searchParams.set("code", code);
        if (state) url.searchParams.set("state", state);
        window.location.href = url.toString();
      }
    } catch (err) {
      console.error("Approval failed:", err);
      alert(err.message); // show backend-provided error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "10px", color: "#333" }}>Zapier Approval</h1>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Click below to approve your Zapier connection.
      </p>
      <button
        onClick={handleApprove}
        disabled={loading}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: loading ? "#aaa" : "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background-color 0.3s ease",
        }}
      >
        {loading ? "Approving..." : "Approve Connection"}
      </button>
    </div>
  );
}

export default App;
