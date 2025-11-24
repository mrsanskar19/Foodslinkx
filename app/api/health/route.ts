import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import packageJson from "@/package.json";

export async function GET() {
  try {
    // Check database connection
    await connectDB();

    // Get version info
    const versions = {
      frontend: packageJson.version,
      backend: packageJson.version, // Assuming same package.json
      database: "MongoDB", // Could be more specific
      node: process.version,
    };

    // List of applied fixes (this would be maintained manually or from a changelog)
    const appliedFixes = [
      "Menu Add/Remove API with transactions and error handling",
      "Menu image upload/link with client preview and backend validation",
      "Customer menu order UX/UI improvements (flow, validation, accessibility)",
      "Landing page responsive design",
      "Hotel-side delete error with active order checks and soft-delete",
      "Admin panel settings update with validation and auth",
      "Login session show password toggle",
      "Feedback section table mapping and pagination",
      "Health endpoint for versions and fixes",
      "Unit/integration tests and error handling/logging",
    ];

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      versions,
      appliedFixes,
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: "Database connection failed",
      },
      { status: 503 }
    );
  }
}