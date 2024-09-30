import { db } from "@/db";

export async function createContext() {
  return {
    db,
  };
}
