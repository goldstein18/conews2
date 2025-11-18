import { Section, Container, Row, Column, Text, Link, Hr } from '@react-email/components';

interface EmailFooterProps {
  unsubscribeUrl?: string;
  companyName?: string;
  companyAddress?: string;
  showSocialLinks?: boolean;
}

/**
 * Shared Email Footer Component
 * Reusable footer for all email templates across the application
 *
 * @param unsubscribeUrl - URL for unsubscribe link
 * @param companyName - Company name for copyright
 * @param companyAddress - Company address to display
 * @param showSocialLinks - Whether to show social media links
 */
export const EmailFooter = ({
  unsubscribeUrl = '#',
  companyName = 'CultureOwl',
  companyAddress = 'Miami, FL',
  showSocialLinks = true
}: EmailFooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Hr style={{
        borderColor: '#e5e7eb',
        margin: '32px 0 24px 0'
      }} />

      <Section style={{
        backgroundColor: '#f9fafb',
        padding: '24px 0'
      }}>
        <Container style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px' }}>
          <Row>
            <Column style={{ textAlign: 'center' }}>
              {/* Social Links */}
              {showSocialLinks && (
                <Text style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0 0 16px 0',
                  fontFamily: 'Arial, sans-serif'
                }}>
                  Follow us:{' '}
                  <Link
                    href="https://www.instagram.com/cultureowl"
                    style={{
                      color: '#3b82f6',
                      marginLeft: '8px',
                      textDecoration: 'none'
                    }}
                  >
                    Instagram
                  </Link>
                  {' | '}
                  <Link
                    href="https://www.facebook.com/cultureowl"
                    style={{
                      color: '#3b82f6',
                      textDecoration: 'none'
                    }}
                  >
                    Facebook
                  </Link>
                  {' | '}
                  <Link
                    href="https://twitter.com/cultureowl"
                    style={{
                      color: '#3b82f6',
                      textDecoration: 'none'
                    }}
                  >
                    Twitter
                  </Link>
                </Text>
              )}

              {/* Copyright */}
              <Text style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 8px 0',
                fontFamily: 'Arial, sans-serif'
              }}>
                © {currentYear} {companyName}. All rights reserved.
              </Text>

              {/* Address */}
              <Text style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: '0 0 16px 0',
                fontFamily: 'Arial, sans-serif'
              }}>
                {companyAddress}
              </Text>

              {/* Unsubscribe & Preferences */}
              <Text style={{
                fontSize: '12px',
                color: '#6b7280',
                margin: '0',
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.5'
              }}>
                You received this email because you subscribed to our newsletter.
                <br />
                <Link
                  href={unsubscribeUrl}
                  style={{
                    color: '#3b82f6',
                    textDecoration: 'underline'
                  }}
                >
                  Unsubscribe
                </Link>
                {' | '}
                <Link
                  href="#preferences"
                  style={{
                    color: '#3b82f6',
                    textDecoration: 'underline'
                  }}
                >
                  Update Preferences
                </Link>
              </Text>
            </Column>
          </Row>
        </Container>
      </Section>
    </>
  );
};
