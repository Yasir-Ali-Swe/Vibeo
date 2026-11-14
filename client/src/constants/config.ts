import type { Role } from "@/types/auth";

/**
 * DEVELOPMENT ROLE CONFIGURATION:
 * Change this single constant to "customer" to test the pure customer experience,
 * or "admin" to access both customer and admin dashboard features.
 */
export const DEV_DEFAULT_ROLE: Role = "admin";

