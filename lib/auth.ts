import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "my-stronest-key-by-sanskarut"

export interface JWTPayload {
  userId: string
  username: string
  role: "admin" | "hotel"
  hotelId?: string
}

/**
 * Generates a JSON Web Token (JWT) with the provided payload.
 *
 * @param {JWTPayload} payload - The data to be included in the token.
 * @returns {string} The generated JWT.
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

/**
 * Verifies the authenticity of a JWT and returns its payload if valid.
 *
 * @param {string} token - The JWT to be verified.
 * @returns {JWTPayload | null} The token's payload if valid, otherwise `null`.
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

/**
 * Sets an authentication cookie with the provided token.
 *
 * @param {string} token - The token to be set in the cookie.
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
  })
}

/**
 * Retrieves the authentication token from the request cookies.
 *
 * @returns {Promise<string | undefined>} A promise that resolves to the token's value, or `undefined` if not found.
 */
export async function getAuthCookie() {
  const cookieStore = await cookies()
  return cookieStore.get("auth-token")?.value
}

/**
 * Clears the authentication cookie from the browser.
 */
export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}
