import { requireAdmin } from "@/lib/requireAdmin";
import { prisma } from "@/lib/prisma";

export default async function AdminSystemPage() {
  const session = await requireAdmin();

  // --- Environment ---
  const environment =
    process.env.NODE_ENV === "production" ? "PROD" : "DEV";

  // --- App info ---
  const appName = "Website";
  const nodeVersion = process.version;

  // --- Database health check ---
  let dbStatus: "OK" | "ERROR" = "OK";
  let dbError: string | null = null;

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = "ERROR";
    dbError = err instanceof Error ? err.message : "Unknown error";
  }

  return (
    <>
      <h1>System Status</h1>
      <p style={{ color: "#6b7280", marginBottom: 16 }}>
        Read-only system and environment information.
      </p>

      {/* Environment */}
      <section style={{ marginBottom: 24 }}>
        <h3>Environment</h3>
        <ul>
          <li>
            <strong>Mode:</strong>{" "}
            <span
              style={{
                color: environment === "PROD" ? "#991b1b" : "#075985",
                fontWeight: 600,
              }}
            >
              {environment}
            </span>
          </li>
          <li>
            <strong>Node.js:</strong> {nodeVersion}
          </li>
        </ul>
      </section>

      {/* Application */}
      <section style={{ marginBottom: 24 }}>
        <h3>Application</h3>
        <ul>
          <li>
            <strong>Name:</strong> {appName}
          </li>
        </ul>
      </section>

      {/* Database */}
      <section style={{ marginBottom: 24 }}>
        <h3>Database</h3>
        <ul>
          <li>
            <strong>Status:</strong>{" "}
            <span
              style={{
                color: dbStatus === "OK" ? "#065f46" : "#991b1b",
                fontWeight: 600,
              }}
            >
              {dbStatus}
            </span>
          </li>
          {dbError && (
            <li style={{ color: "#991b1b" }}>
              <strong>Error:</strong> {dbError}
            </li>
          )}
        </ul>
      </section>

      {/* Session */}
      <section>
        <h3>Current Session</h3>
        <ul>
          <li>
            <strong>User:</strong> {session.user.email}
          </li>
          <li>
            <strong>Role:</strong> {session.user.role}
          </li>
        </ul>
      </section>
    </>
  );
}
