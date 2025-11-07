import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from '@react-email/components'

interface ContactFormEmailProps {
  name: string
  email: string
  message: string
}

export default function ContactFormEmail({
  name,
  email,
  message,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={heading}>New Contact Form Submission</Text>
          </Section>

          <Section style={content}>
            <Text style={label}>From:</Text>
            <Text style={value}>{name}</Text>

            <Text style={label}>Email:</Text>
            <Text style={value}>{email}</Text>

            <Hr style={hr} />

            <Text style={label}>Message:</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              This message was sent via the contact form on your website.
            </Text>
            <Text style={footerText}>
              You can reply directly to {email} by responding to this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '32px 40px',
  backgroundColor: '#1a1a1a',
}

const heading = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#ffffff',
  margin: '0',
}

const content = {
  padding: '0 40px',
}

const label = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  marginTop: '24px',
  marginBottom: '8px',
}

const value = {
  fontSize: '16px',
  color: '#1a1a1a',
  margin: '0',
  lineHeight: '24px',
}

const messageText = {
  fontSize: '16px',
  color: '#1a1a1a',
  lineHeight: '28px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
}

const footer = {
  padding: '0 40px',
  marginTop: '32px',
}

const footerText = {
  fontSize: '14px',
  color: '#6b7280',
  lineHeight: '20px',
  margin: '8px 0',
}
