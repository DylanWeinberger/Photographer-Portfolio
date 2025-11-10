import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route for On-Demand Revalidation
 *
 * Allows triggering ISR revalidation immediately via API call,
 * rather than waiting for the time-based revalidation period.
 *
 * Usage:
 * POST /api/revalidate
 * Headers: { "x-revalidate-secret": "your-secret-token" }
 * Body: { "path": "/photos", "type": "page" }
 *
 * Path Examples:
 * - Homepage: { "path": "/" }
 * - Photos: { "path": "/photos" }
 * - Tag page: { "path": "/tag/wedding" }
 * - All pages: { "path": "/", "type": "layout" } (revalidates all nested pages)
 *
 * Security: Requires REVALIDATION_SECRET environment variable
 * to prevent unauthorized cache invalidation.
 */

export async function POST(request: NextRequest) {
  try {
    // Verify secret token for security
    const secret = request.headers.get('x-revalidate-secret')
    const expectedSecret = process.env.REVALIDATION_SECRET

    if (!expectedSecret) {
      return NextResponse.json(
        { error: 'Revalidation not configured. Set REVALIDATION_SECRET environment variable.' },
        { status: 500 }
      )
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Invalid secret token' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { path, type = 'page' } = body

    // Validate path
    if (!path) {
      return NextResponse.json(
        { error: 'Missing "path" in request body' },
        { status: 400 }
      )
    }

    // Revalidate the specified path
    // type: 'page' revalidates just that page
    // type: 'layout' revalidates the page and all nested pages
    revalidatePath(path, type as 'page' | 'layout')

    return NextResponse.json({
      success: true,
      revalidated: true,
      path,
      type,
      message: `Path "${path}" revalidated successfully`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Revalidation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST with path parameter.' },
    { status: 405 }
  )
}
