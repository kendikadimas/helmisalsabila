import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "helmi_salsabila_super_secure_jwt_secret_key_2026_cpanel"
);

const CUSTOMER_COOKIE_NAME = "helmi_customer_token";

export interface CustomerSession {
  email: string;
  name: string;
}

export async function createCustomerSession(customer: CustomerSession): Promise<string> {
  const token = await new SignJWT({
    email: customer.email.toLowerCase().trim(),
    name: customer.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return token;
}

export async function getCustomerSession(): Promise<CustomerSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload?.email) return null;
    return {
      email: String(payload.email),
      name: String(payload.name || "Pelanggan"),
    };
  } catch {
    return null;
  }
}

export async function deleteCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_COOKIE_NAME);
}
