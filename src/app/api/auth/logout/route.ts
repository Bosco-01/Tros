import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    response.cookies.delete('trios_session_token');

    return response;
  } catch {
    return NextResponse.json(
      { message: 'An error occurred during logout.' },
      { status: 500 }
    );
  }
}
