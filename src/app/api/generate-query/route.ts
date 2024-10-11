import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function getMovieQuery(userRequest: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `
        You are an AI assistant that generates SQL queries for a movie database. The database schema is defined using Prisma and is as follows:

        model movie {
          id                Int           @id @default(autoincrement())
          tmdbId            Int           @unique
          title             String
          overview          String?
          original_language String
          original_title    String
          popularity        Float
          vote_average      Float
          vote_count        Int
          release_date      DateTime
          poster_path       String
          backdrop_path     String?
          adult             Boolean
          video             Boolean
          movie_genres      movie_genre[]
        }

        model genre {
          id           Int           @id @default(autoincrement())
          name         String
          movie_genres movie_genre[]
        }

        model movie_genre {
          movie    movie @relation(fields: [movie_id], references: [id])
          movie_id Int
          genre    genre @relation(fields: [genre_id], references: [id])
          genre_id Int

          @@id([movie_id, genre_id])
        }

        Available genres in the database:
        Adventure
        Fantasy
        Animation
        Drama
        Horror
        Action
        Comedy
        History
        Western
        Thriller
        Crime
        Documentary
        Science Fiction
        Mystery
        Music
        Romance
        Family
        War
        Action & Adventure
        Kids
        News
        Reality
        Sci-Fi & Fantasy
        Soap
        Talk
        War & Politics
        TV Movie

        Instructions:
        Based on the user's request, generate an SQL query that retrieves complete movie records (i.e., all columns from the Movie table).
        The requests will be in the style of: "Recommend such and such movies".
        If you want to search for keywords in the description of films, then do it in English
        Use proper SQL syntax compatible with the database being used (e.g., PostgreSQL, MySQL—specify if necessary).
        Ensure that all table and column names correspond to those specified in the schema.
        When filtering by genres, correctly use joins between the Movie, MovieGenre, and Genre tables.
        Return only the SQL query without any additional text or explanations.
      `,
      },
      {
        role: "user",
        content: userRequest,
      },
    ],
    max_tokens: 100,
  });

  return response.choices[0].message.content?.trim() || "";
}

export async function POST(req: Request) {
  const { userRequest } = await req.json();

  try {
    const sqlQuery = await getMovieQuery(userRequest);
    return NextResponse.json({ query: sqlQuery });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate query" },
      { status: 500 }
    );
  }
}
