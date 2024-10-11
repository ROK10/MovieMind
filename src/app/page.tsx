"use client";
import React, { useEffect, useState } from "react";
import { api } from "@/app/trpc/react";
import {
  CssBaseline,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import Grid from "@mui/material/Grid";

type Movie = {
  id: number;
  tmdbId: number;
  title: string;
  overview?: string;
  original_language: string;
  original_title: string;
  popularity: number;
  vote_average: number;
  vote_count: number;
  release_date: Date;
  poster_path: string;
  backdrop_path: string | null;
  adult: boolean;
  video: boolean;
  genres: Array<{
    id: number;
    name: string;
  }>;
};

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<any | null>(null);
  const [retryCount, setRetryCount] = useState(0);

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

  const { data, isLoading } = api.movies.getAllMovies.useQuery(
    {
      page: 1,
      cursor: null,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

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
  const {
    data: queryData,
    isSuccess: querySuccess,
    error: queryError,
  } = api.movies.executeQuery.useQuery(
    { query },
    {
      enabled: query !== "",
      refetchOnWindowFocus: false,
      onSuccess: (data) => setResult(data),
    }
  );

  const handleQuery = async () => {
    setLoading(true);
    console.log("User request text", text);
    try {
      const response = await fetch(`/api/generate-query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userRequest: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const sqlQuery = await response.json();
      console.log("AI answer query", sqlQuery);

      setQuery(sqlQuery.query);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error("Failed to fetch query:", error);
      setMessage("Failed to fetch query. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (queryError && retryCount < 3) {
      // Limit retries to 3 attempts
      console.log("Retrying query due to error:", queryError);
      setRetryCount((prev) => prev + 1);
      handleQuery();
    }
  }, [queryError, retryCount]);

  useEffect(() => {
    if (queryData) setLoading(false);
  }, [queryData]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background:
          "linear-gradient(0deg, rgba(255, 255, 255, 1) 57.82%, rgb(190, 50, 50, 1) 120%)",
      }}
    >
      <CssBaseline />
      <Typography variant="h2" color="black" sx={{ marginTop: "40px" }}>
        MovieMind
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "40px",
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        <TextField
          variant="outlined"
          sx={{
            width: "100%",
            maxWidth: "800px",
            backgroundColor: "white",
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderTopLeftRadius: "20px",
                borderBottomLeftRadius: "20px",
                borderTopRightRadius: "0px",
                borderBottomRightRadius: "0px",
                borderColor: "white",
              },
            },
          }}
          placeholder="What movie do you want to watch?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button
          onClick={handleQuery}
          endIcon={<AiIcon />}
          sx={{
            backgroundColor: "rgb(190, 50, 50, 1)",
            borderTopLeftRadius: "0px",
            borderBottomLeftRadius: "0px",
            borderTopRightRadius: "20px",
            borderBottomRightRadius: "20px",
            height: "56px",
            width: "fit-content",
            color: "white",
            padding: "10px 20px",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            },
          }}
        >
          Choose movies using AI
        </Button>
      </Box>
      {/* <Button
        onClick={importMovies}
        sx={{
          marginLeft: "10px",
          position: "absolute",
          top: "20px",
          left: "20px",
          backgroundColor: "rgb(190, 50, 50, 1)",
          color: "white",
        }}
      >
        Import movies
      </Button> */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "1600px",
          width: "100%",
          marginTop: "100px",
          gap: "40px",
        }}
      >
        <Typography variant="h4" color="black">
          {queryData
            ? "AI generated movies based on your query"
            : "Top rated movies"}
        </Typography>
        {isLoading && (
          <Box
            sx={{
              height: "70vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <CircularProgress sx={{ color: "rgb(190, 50, 50, 1)" }} />
            <Typography variant="h6" color="black">
              Loading...
            </Typography>
          </Box>
        )}
        {(querySuccess || query == "") && (
          <Grid
            container
            spacing={2}
            sx={{ overflowX: "auto", height: "70vh" }}
          >
            {!queryData &&
              data?.movies.map((movie) => (
                <Grid item key={movie.tmdbId}>
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            {queryData && queryData.movies
              ? queryData.movies.map((movie) => (
                  <Grid item key={movie.tmdbId}>
                    <MovieCard movie={movie} />
                  </Grid>
                ))
              : null}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;

const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  return (
    <Card
      sx={{
        maxWidth: 500,
        height: 300,
        padding: "10px",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <CardMedia
        component="img"
        height="100%"
        image={`https://image.tmdb.org/t/p/w600_and_h900_bestv2/${movie.poster_path}`}
        alt={movie.title}
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <Typography variant="h5">{movie.title}</Typography>
        <Typography variant="body2">
          Date: {new Date(movie.release_date).toLocaleDateString()}
        </Typography>
        <Typography variant="body2">
          {movie.genres &&
            `Genres: ${movie.genres.map((genre) => genre.name).join(", ")}`}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            textOverflow: "ellipsis",
            maxHeight: "260px",
            overflow: "hidden",
          }}
        >
          {movie.overview}
        </Typography>
      </CardContent>
    </Card>
  );
};

const AiIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.3168 6.27078C9.3773 5.86419 7.86133 4.34822 7.4548 2.40866C7.40486 2.17056 7.19487 2 6.95152 2C6.70818 2 6.49818 2.17056 6.44827 2.40869C6.04171 4.34822 4.52574 5.86416 2.58621 6.27069C2.34808 6.32059 2.17749 6.53063 2.17749 6.77394C2.17749 7.01725 2.34805 7.22728 2.58621 7.27719C4.52571 7.68378 6.04162 9.19972 6.44818 11.1392C6.49808 11.3774 6.70808 11.548 6.95143 11.548C7.19474 11.548 7.40477 11.3774 7.45468 11.1392C7.86127 9.19972 9.37727 7.68378 11.3168 7.27728C11.5549 7.22738 11.7255 7.01737 11.7255 6.77403C11.7255 6.53072 11.5549 6.32069 11.3168 6.27078Z"
      fill="white"
      fillOpacity="1"
    />
    <path
      d="M10.4669 14.7655C9.5531 14.574 8.83885 13.8597 8.64726 12.9458C8.59735 12.7077 8.38735 12.5371 8.14401 12.5371C7.9007 12.5371 7.69067 12.7076 7.64076 12.9458C7.44917 13.8596 6.73488 14.5739 5.82107 14.7655C5.58295 14.8154 5.41235 15.0254 5.41235 15.2687C5.41235 15.512 5.58292 15.722 5.82107 15.772C6.73485 15.9635 7.44913 16.6778 7.6407 17.5916C7.6906 17.8298 7.9006 18.0004 8.14395 18.0004C8.38726 18.0004 8.59729 17.8298 8.6472 17.5916C8.83879 16.6778 9.55307 15.9635 10.4669 15.772C10.705 15.7221 10.8756 15.512 10.8756 15.2687C10.8756 15.0254 10.7051 14.8154 10.4669 14.7655Z"
      fill="white"
      fillOpacity="1"
    />
    <path
      d="M17.4138 10.004C16.1787 9.74505 15.2132 8.77962 14.9543 7.54446C14.9044 7.30634 14.6944 7.13574 14.4511 7.13574C14.2078 7.13574 13.9977 7.30627 13.9478 7.54443C13.6889 8.77962 12.7235 9.74502 11.4883 10.0039C11.2502 10.0538 11.0796 10.2639 11.0796 10.5072C11.0796 10.7505 11.2502 10.9605 11.4883 11.0104C12.7235 11.2694 13.6889 12.2348 13.9478 13.47C13.9977 13.7081 14.2077 13.8787 14.451 13.8787C14.6943 13.8787 14.9044 13.7081 14.9543 13.47C15.2132 12.2348 16.1787 11.2694 17.4138 11.0105C17.6519 10.9606 17.8225 10.7506 17.8225 10.5072C17.8225 10.2639 17.652 10.0539 17.4138 10.004Z"
      fill="white"
      fillOpacity="1"
    />
  </svg>
);
