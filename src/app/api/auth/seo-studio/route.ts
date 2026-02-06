import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'seo-studio-auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { password } = body

    const envPassword = process.env.STUDIO_SEO_PASSWORD

    if (!envPassword) {
      return NextResponse.json(
        { error: 'STUDIO_SEO_PASSWORD not configured' },
        { status: 500 }
      )
    }

    if (!password || password !== envPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Create a token from the password
    const token = Buffer.from(`seo-studio:${envPassword}`).toString('base64')

    const response = NextResponse.json({ success: true })
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}
