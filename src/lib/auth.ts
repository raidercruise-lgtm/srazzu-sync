import { db, schema } from './db';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';

// Simple auth for admin panel (production should use proper auth like NextAuth)
export async function getAdminUser() {
  const cookieStore = cookies();
  const adminEmail = cookieStore.get('admin_email')?.value;

  if (!adminEmail) {
    return null;
  }

  const [user] = await db.select()
    .from(schema.admin_users)
    .where(eq(schema.admin_users.email, adminEmail))
    .limit(1);

  return user || null;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getAdminUser();
  return user !== null;
}

export async function getAdminPlan(): Promise<string> {
  const user = await getAdminUser();
  return user?.plan || 'free';
}

// Simple login (production should use proper auth)
export async function loginAdmin(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@srazzu.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password';

  if (email === adminEmail && password === adminPassword) {
    // Set cookie
    cookies().set('admin_email', email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Ensure admin user exists in database
    const [existing] = await db.select()
      .from(schema.admin_users)
      .where(eq(schema.admin_users.email, email))
      .limit(1);

    if (!existing) {
      await db.insert(schema.admin_users).values({
        email,
        password_hash: 'hashed', // In production, hash the password
        name: 'Admin',
        plan: 'pro', // Admin gets pro plan
      });
    }

    return true;
  }

  return false;
}

export async function logoutAdmin() {
  cookies().delete('admin_email');
}
