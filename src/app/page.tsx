"use client";
import React from "react";
import { useState } from "react";

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const importGenres = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/import-genres");
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(`Error: ${data.message}`);
      }
    } catch (error) {
      setMessage("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Import Genres from TMDb</h1>
      <button onClick={importGenres} disabled={loading}>
        {loading ? "Importing..." : "Import Genres"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default HomePage;
