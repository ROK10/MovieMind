import { db } from "@/app/server/db";

export async function createContext() {
  return {
    db,
  };
}
