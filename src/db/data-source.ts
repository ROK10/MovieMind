import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Movie } from "@/db/entities/Movie";
import { Genre } from "@/db/entities/Genre";
import { TvShow } from "@/db/entities/TvShow";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: [Movie, Genre, TvShow],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
});
