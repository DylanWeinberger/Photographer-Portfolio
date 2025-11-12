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

  // Success state
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Thank You!
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Your message has been sent successfully. We'll get back to you soon.
        </p>
        <div className="space-y-4">
          <div className="text-sm text-gray-500">
            <p>
              <strong>Name:</strong> {formData.name}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
          </div>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gray-900 text-light font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  // Form UI
  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Submit Error */}
        {submitError && (
          <div
            className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800"
            role="alert"
          >
            <p className="font-medium">Error</p>
            <p className="text-sm">{submitError}</p>
          </div>
        )}

        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
              errors.name
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-white'
            }`}
            aria-required="true"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? 'name-error' : undefined}
            disabled={isLoading}
          />
          {errors.name && (
            <p
              id="name-error"
              className="mt-2 text-sm text-red-600"
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
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors ${
              errors.email
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-white'
            }`}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            disabled={isLoading}
          />
          {errors.email && (
            <p
              id="email-error"
              className="mt-2 text-sm text-red-600"
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
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-colors resize-none ${
              errors.message
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-white'
            }`}
            aria-required="true"
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? 'message-error' : undefined}
            disabled={isLoading}
          />
          {errors.message && (
            <p
              id="message-error"
              className="mt-2 text-sm text-red-600"
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

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-6 py-4 bg-gray-900 text-light font-semibold rounded-lg hover:bg-gray-800 focus:ring-4 focus:ring-gray-900 focus:ring-opacity-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-light"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </div>

        <p className="text-sm text-gray-500 text-center">
          <span className="text-red-500">*</span> Required fields
        </p>
      </form>
    </div>
  )
}
