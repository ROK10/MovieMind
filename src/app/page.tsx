"use client";
import React, { useState } from "react";
import { api } from "@/app/trpc/react";

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [query, setQuery] = useState<string>(""); // Initialize as an empty string
  const [result, setResult] = useState<any | null>(null);

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

  const { data, isLoading } = api.movies.getAllMovies.useQuery({
    page: 1,
    cursor: null,
  });

  const importMovies = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/import-movies");
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

  const { data: fullTableData, isLoading: fullTableLoading } =
    api.movies.getFullTableAsString.useQuery();

  // Use useQuery at the top level of the component
  const {
    data: queryData,
    isLoading: queryLoading,
    error: queryError,
  } = api.movies.executeQuery.useQuery(
    { query },
    {
      enabled: query !== "",
      onSuccess: (data) => setResult(data),
    }
  );

  const handleQuery = async () => {
    const sqlQuery = await fetch("/api/generate-query", {
      method: "POST",
      body: JSON.stringify({
        userRequest: "Get all movies with a vote average greater than 8",
      }),
    });
    console.log(data);
    setQuery(JSON.stringify(data));
  };

  return (
    <div>
      <div style={{ padding: "20px" }}>
        <h1>Import Genres from TMDb</h1>
        <button onClick={importGenres} disabled={loading}>
          {loading ? "Importing..." : "Import Genres"}
        </button>
        {message && <p>{message}</p>}
        <button onClick={importMovies} disabled={loading}>
          {loading ? "Importing..." : "Import Movies"}
        </button>
        {message && <p>{message}</p>}
      </div>
      <div>
        <h1>Movies</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {data?.movies.map((movie) => (
              <div key={movie.id}>
                <h2>{movie.title}</h2>
                <p>{movie.overview}</p>
                <p>{movie.genres.map((genre) => genre.name).join(", ")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <h1>Query</h1>
        <button onClick={handleQuery}>Generate Query</button>
        {query && <p>{query}</p>}
      </div>
      <div>
        <h1>Result</h1>
        {queryLoading ? (
          <p>Loading...</p>
        ) : queryError ? (
          <p>Error: {queryError.message}</p>
        ) : (
          <p>{JSON.stringify(queryData)}</p>
        )}
      </div>
      <div style={{ maxWidth: "1000px" }}>
        <h1>Full Table</h1>
        {fullTableLoading ? <p>Loading...</p> : <p>{fullTableData}</p>}
      </div>
    </div>
  );
};

export default HomePage;
