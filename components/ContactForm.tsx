'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'

interface FormData {
  name: string
  email: string
  message: string
  website: string // Honeypot field
}

interface ValidationErrors {
  name?: string
  email?: string
  message?: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    website: '', // Honeypot
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Validate email format
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)

    // Check honeypot - if filled, it's a bot
    if (formData.website) {
      // Fake success for bots (silent failure)
      setIsLoading(true)
      setTimeout(() => {
        setIsLoading(false)
        setIsSuccess(true)
      }, 1000)
      return
    }

    // Validate form
    if (!validateForm()) {
      // Focus first error field
      const firstErrorField = Object.keys(errors)[0]
      document.getElementById(firstErrorField)?.focus()
      return
    }

    // Submit form
    setIsLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      // Success!
      setIsSuccess(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitError(
        'Something went wrong. Please try again or email us directly.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Success state - Minimal, elegant
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 md:py-20">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-8">
          <svg
            className="w-10 h-10 text-[var(--accent-warm)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="font-playfair text-3xl md:text-4xl font-normal text-[var(--foreground)] mb-6">
          Message Sent
        </h2>
        <p className="text-base text-[var(--foreground)]/70 mb-12 font-light">
          Thank you for reaching out. I'll respond as soon as possible.
        </p>
        <Link
          href="/"
          className="inline-block px-10 py-4 border border-[var(--foreground)] text-[var(--foreground)] text-sm uppercase tracking-[0.15em] transition-all duration-[var(--transition-medium)] hover:bg-[var(--foreground)] hover:text-[var(--background)]"
          data-cursor="link"
        >
          Return Home
        </Link>
      </div>
    )
  }

  // Form UI - Elegant, minimal styling
  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        {/* Submit Error - Subtle */}
        {submitError && (
          <div
            className="p-4 bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)]/80 text-sm"
            role="alert"
          >
            <p className="font-medium mb-1">Unable to send message</p>
            <p>{submitError}</p>
          </div>
        )}

        {/* Name Field - Minimal styling */}
        <div>
          <label
            htmlFor="name"
            className="block text-xs uppercase tracking-[0.1em] text-[var(--subtle-text)] mb-3"
          >
            Name <span className="text-[var(--accent-warm)]">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-5 py-4 bg-[var(--surface)] border text-[var(--foreground)] transition-all duration-[var(--transition-fast)] focus:outline-none focus:border-[var(--foreground)] ${
              errors.name
                ? 'border-[var(--accent-warm)]'
                : 'border-[var(--border)]'
            }`}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            disabled={isLoading}
          />
          {errors.name && (
            <p
              id="name-error"
              className="mt-2 text-xs text-[var(--accent-warm)]"
              role="alert"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs uppercase tracking-[0.1em] text-[var(--subtle-text)] mb-3"
          >
            Email <span className="text-[var(--accent-warm)]">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-5 py-4 bg-[var(--surface)] border text-[var(--foreground)] transition-all duration-[var(--transition-fast)] focus:outline-none focus:border-[var(--foreground)] ${
              errors.email
                ? 'border-[var(--accent-warm)]'
                : 'border-[var(--border)]'
            }`}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            disabled={isLoading}
          />
          {errors.email && (
            <p
              id="email-error"
              className="mt-2 text-xs text-[var(--accent-warm)]"
              role="alert"
            >
              {errors.email}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label
            htmlFor="message"
            className="block text-xs uppercase tracking-[0.1em] text-[var(--subtle-text)] mb-3"
          >
            Message <span className="text-[var(--accent-warm)]">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={8}
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-5 py-4 bg-[var(--surface)] border text-[var(--foreground)] transition-all duration-[var(--transition-fast)] focus:outline-none focus:border-[var(--foreground)] resize-vertical ${
              errors.message
                ? 'border-[var(--accent-warm)]'
                : 'border-[var(--border)]'
            }`}
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            disabled={isLoading}
          />
          {errors.message && (
            <p
              id="message-error"
              className="mt-2 text-xs text-[var(--accent-warm)]"
              role="alert"
            >
              {errors.message}
            </p>
          )}
        </div>

        {/* Honeypot Field - Hidden from users, catches bots */}
        <div
          className="absolute"
          style={{ left: '-9999px', zIndex: -1 }}
          aria-hidden="true"
        >
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Submit Button - Minimal, elegant */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-10 py-5 border border-[var(--foreground)] text-[var(--foreground)] text-sm uppercase tracking-[0.15em] transition-all duration-[var(--transition-medium)] hover:bg-[var(--foreground)] hover:text-[var(--background)] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            data-cursor="button"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </div>

        <p className="text-xs text-[var(--subtle-text)] text-center uppercase tracking-[0.1em] pt-2">
          <span className="text-[var(--accent-warm)]">*</span> Required
        </p>
      </form>
    </div>
  )
}
