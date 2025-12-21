import fs from "fs"

/**
 * Read a secret from:
 * 1) process.env (dev, CI, local)
 * 2) /run/secrets (Docker secrets, prod)
 */
export function readSecret(name: string): string {
  // ✅ DEV / LOCAL / CI
  if (process.env[name] && process.env[name]!.length > 0) {
    return process.env[name]!
  }

  // ✅ PROD (Docker secrets)
  const secretPath = `/run/secrets/${name}`
  if (fs.existsSync(secretPath)) {
    return fs.readFileSync(secretPath, "utf8").trim()
  }

  // ❌ Hard fail if missing
  throw new Error(`Secret "${name}" not found in env or /run/secrets`)
}
