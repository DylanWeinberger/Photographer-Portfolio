/**
 * Rate Limiting System
 *
 * Simple in-memory rate limiting for contact form submissions.
 * Limits to 3 submissions per IP address per hour.
 *
 * For production at scale, consider using:
 * - Redis for distributed rate limiting
 * - Database for persistent tracking
 * - Vercel Edge Config or KV storage
 */

// Store IP addresses and their submission timestamps
const submissionStore = new Map<string, number[]>()

// Rate limit configuration
const MAX_SUBMISSIONS = 3
const TIME_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds

/**
 * Check if an IP address has exceeded the rate limit
 *
 * @param ip - The IP address to check
 * @returns true if the request is allowed, false if rate limited
 */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const timestamps = submissionStore.get(ip) || []

  // Filter out timestamps older than 1 hour
  const recentTimestamps = timestamps.filter(
    (timestamp) => now - timestamp < TIME_WINDOW
  )

  // Check if under the limit
  if (recentTimestamps.length < MAX_SUBMISSIONS) {
    // Add current timestamp and update store
    recentTimestamps.push(now)
    submissionStore.set(ip, recentTimestamps)
    return true
  }

  // Rate limit exceeded
  return false
}

/**
 * Clean up old entries from the store
 * This prevents memory leaks by removing expired timestamps
 * Call this periodically or on each check
 */
export function cleanupOldEntries(): void {
  const now = Date.now()

  for (const [ip, timestamps] of submissionStore.entries()) {
    const recentTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < TIME_WINDOW
    )

    if (recentTimestamps.length === 0) {
      // No recent timestamps, remove entry
      submissionStore.delete(ip)
    } else if (recentTimestamps.length < timestamps.length) {
      // Some timestamps expired, update entry
      submissionStore.set(ip, recentTimestamps)
    }
  }
}

// Clean up old entries every 10 minutes
if (typeof window === 'undefined') {
  // Only run on server
  setInterval(cleanupOldEntries, 10 * 60 * 1000)
}
