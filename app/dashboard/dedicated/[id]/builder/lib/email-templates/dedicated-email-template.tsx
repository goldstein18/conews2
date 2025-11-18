import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Link,
  Preview,
  Font
} from '@react-email/components';
import { EmailHeader } from '@/lib/email-templates/components/email-header';
import { EmailFooter } from '@/lib/email-templates/components/email-footer';

export interface DedicatedEmailProps {
  subject: string;
  alternateText: string;
  link: string;
  imageUrl: string;
  market?: string;
  unsubscribeUrl?: string;
}

/**
 * Dedicated Email Template
 * Simple clickable image email template with shared header/footer
 *
 * Features:
 * - Brand header with market name
 * - Full-width clickable image
 * - Brand footer with unsubscribe link
 *
 * Usage:
 * Used for dedicated email campaigns where the entire email
 * is a single clickable image linking to an external URL.
 */
export const DedicatedEmail = ({
  alternateText,
  link,
  imageUrl,
  market = 'miami',
  unsubscribeUrl = '#unsubscribe'
}: DedicatedEmailProps) => {
  // Format market name for header (capitalize first letter)
  const marketTitle = `CultureOwl ${market.charAt(0).toUpperCase() + market.slice(1)}`;

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Arial"
          fallbackFontFamily="sans-serif"
        />
      </Head>
      <Preview>{alternateText}</Preview>
      <Body style={{
        backgroundColor: '#f4f4f4',
        fontFamily: 'Arial, sans-serif',
        margin: 0,
        padding: 0
      }}>
        <Container style={{
          maxWidth: '700px',
          margin: '0 auto',
          backgroundColor: '#ffffff'
        }}>
          {/* Shared Header */}
          <EmailHeader
            title={marketTitle}
            subtitle="Discover culture, food & events"
            backgroundColor="#14532d"
          />

          {/* Main Content: Clickable Image */}
          <Section style={{ padding: '0' }}>
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', textDecoration: 'none' }}
            >
              <Img
                src={imageUrl}
                alt={alternateText}
                width="700"
                style={{
                  width: '100%',
                  maxWidth: '700px',
                  height: 'auto',
                  display: 'block',
                  border: 0
                }}
              />
            </Link>
          </Section>

          {/* Shared Footer */}
          <EmailFooter
            unsubscribeUrl={unsubscribeUrl}
            companyName="CultureOwl"
            companyAddress="Miami, FL | Los Angeles, CA"
            showSocialLinks={true}
          />
        </Container>
      </Body>
    </Html>
  );
};
