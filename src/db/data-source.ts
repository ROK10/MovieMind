import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Movie } from "@/entities/Movie";
import { Genre } from "@/entities/Genre";
import { TvShow } from "@/entities/TvShow";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: [Movie, Genre, TvShow],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
});
