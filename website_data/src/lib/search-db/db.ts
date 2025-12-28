import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

const DB_DIR = path.join(process.cwd(), "data")
const DB_PATH = path.join(DB_DIR, "sports-search.db")

// Ensure data directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR)
}

// Singleton DB connection
export const db = new Database(DB_PATH)

// Create table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS search_index (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('league','team')) NOT NULL,
    sport TEXT,
    country TEXT,
    badge TEXT,
    league_id TEXT,
    search_text TEXT NOT NULL
  )
`).run()
