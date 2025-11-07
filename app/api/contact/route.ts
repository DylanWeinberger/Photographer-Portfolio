import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { checkRateLimit } from '@/lib/rateLimit'
import ContactFormEmail from '@/emails/ContactFormEmail'

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Email regex for validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface ContactFormData {
  name: string
  email: string
  message: string
}

/**
 * Validate contact form data
 * Never trust client-side validation - always validate on server
 */
function validateFormData(data: any): {
  isValid: boolean
  errors?: string[]
  formData?: ContactFormData
} {
  const errors: string[] = []

  // Check all fields are present
  if (!data.name || !data.email || !data.message) {
    errors.push('All fields are required')
  }

  // Validate name
  if (data.name) {
    const name = data.name.trim()
    if (name.length < 2) {
      errors.push('Name must be at least 2 characters')
    }
    if (name.length > 100) {
      errors.push('Name must be less than 100 characters')
    }
  }

  // Validate email
  if (data.email) {
    const email = data.email.trim()
    if (!EMAIL_REGEX.test(email)) {
      errors.push('Invalid email address')
    }
  }

  // Validate message
  if (data.message) {
    const message = data.message.trim()
    if (message.length < 10) {
      errors.push('Message must be at least 10 characters')
    }
    if (message.length > 5000) {
      errors.push('Message must be less than 5000 characters')
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors }
  }

  return {
    isValid: true,
    formData: {
      name: data.name.trim(),
      email: data.email.trim(),
      message: data.message.trim(),
    },
  }
}

/**
 * Get client IP address from request headers
 * Supports various hosting platforms (Vercel, Cloudflare, etc.)
 */
function getClientIP(request: NextRequest): string {
  // Try various headers that might contain the real IP
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')

  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim()
  }

  if (realIP) {
    return realIP
  }

  if (cfConnectingIP) {
    return cfConnectingIP
  }

  // Fallback to a default if we can't determine IP
  return 'unknown'
}

/**
 * POST /api/contact
 * Handle contact form submissions
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate input
    const validation = validateFormData(body)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      )
    }

    const { name, email, message } = validation.formData!

    // Get client IP for rate limiting
    const clientIP = getClientIP(request)

    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`)
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured')
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      )
    }

    // Check if contact email is configured
    const contactEmail = process.env.CONTACT_EMAIL
    if (!contactEmail) {
      console.error('CONTACT_EMAIL is not configured')
      return NextResponse.json(
        { error: 'Contact email is not configured' },
        { status: 500 }
      )
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Contact Form <onboarding@resend.dev>',
      to: contactEmail,
      replyTo: email, // Allow direct reply to sender
      subject: `New Contact Form Submission from ${name}`,
      react: ContactFormEmail({ name, email, message }),
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      )
    }

    console.log('Email sent successfully:', data)

    // Success!
    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error handling contact form submission:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}

/**
 * Reject other HTTP methods
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
