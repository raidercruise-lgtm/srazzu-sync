import { NextRequest, NextResponse } from 'next/server';
import { logoutAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await logoutAdmin();
    return NextResponse.redirect(new URL('/login', request.url));
  } catch (error) {
    console.error('[Auth] Logout error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
