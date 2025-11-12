import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const limit = rateLimitMap.get(ip)

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 })
    return true
  }

  if (limit.count >= 5) {
    return false
  }

  limit.count++
  return true
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
    }

    const body: ContactFormData = await request.json()

    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    if (!validateEmail(body.email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const sanitizedData = {
      name: sanitizeInput(body.name),
      email: sanitizeInput(body.email),
      subject: sanitizeInput(body.subject),
      message: sanitizeInput(body.message),
    }

    if (sanitizedData.name.length > 100 || sanitizedData.subject.length > 200 || sanitizedData.message.length > 2000) {
      return NextResponse.json({ error: 'One or more fields exceed maximum length.' }, { status: 400 })
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'jerickogarcia0@gmail.com'

    if (RESEND_API_KEY) {
      try {
        const resendResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'ProTech Contact <onboarding@resend.dev>',
            to: CONTACT_EMAIL,
            replyTo: sanitizedData.email,
            subject: `Contact Form: ${sanitizedData.subject}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${sanitizedData.name}</p>
              <p><strong>Email:</strong> ${sanitizedData.email}</p>
              <p><strong>Subject:</strong> ${sanitizedData.subject}</p>
              <p><strong>Message:</strong></p>
              <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
            `,
          }),
        })

        if (!resendResponse.ok) {
          const errorData = await resendResponse.json()
          console.error('Resend API error:', errorData)
          throw new Error('Failed to send email via Resend')
        }
      } catch (error) {
        console.error('Error sending email:', error)
        if (process.env.NODE_ENV === 'production') {
          return NextResponse.json({ error: 'Failed to send email. Please try again later.' }, { status: 500 })
        }
      }
    } else {
      console.log('Contact Form Submission (Resend not configured):', sanitizedData)
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully!' }, { status: 200 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    )
  }
}

