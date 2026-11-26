import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Separate derived secret so customer tokens can NEVER be replayed as admin tokens
const CUSTOMER_JWT_SECRET = new TextEncoder().encode(
  (process.env.JWT_SECRET || "helmi_salsabila_super_secure_jwt_secret_key_2026_cpanel") +
    "__customer_portal_v1"
);

const CUSTOMER_COOKIE_NAME = "helmi_customer_token";

export interface CustomerSession {
  email: string;
  name: string;
  verifiedPaid: boolean;
  verifiedInvoice: string;
}

export async function createCustomerSession(customer: CustomerSession): Promise<string> {
  const token = await new SignJWT({
    email: customer.email.toLowerCase().trim(),
    name: customer.name,
    verifiedPaid: customer.verifiedPaid,
    verifiedInvoice: customer.verifiedInvoice,
    tokenType: "customer",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(CUSTOMER_JWT_SECRET);

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

    const { payload } = await jwtVerify(token, CUSTOMER_JWT_SECRET);
    if (!payload?.email || payload.tokenType !== "customer") return null;
    return {
      email: String(payload.email),
      name: String(payload.name || "Pelanggan"),
      verifiedPaid: Boolean(payload.verifiedPaid),
      verifiedInvoice: String(payload.verifiedInvoice || ""),
    };
  } catch {
    return null;
  }
}

export async function deleteCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_COOKIE_NAME);
}
