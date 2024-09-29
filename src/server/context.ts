import { AppDataSource } from "../db/data-source";

export async function createContext() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return {};
}
