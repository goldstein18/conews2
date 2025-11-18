import { Section, Container, Row, Column, Text, Link, Hr } from '@react-email/components';

interface NewsletterFooterProps {
  unsubscribeUrl?: string;
  companyName?: string;
  companyAddress?: string;
}

export const NewsletterFooter = ({
  unsubscribeUrl = '#',
  companyName = 'eScoop',
  companyAddress = 'Miami, FL'
}: NewsletterFooterProps) => {
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
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Row>
            <Column style={{ textAlign: 'center' }}>
              <Text style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 8px 0',
                fontFamily: 'Arial, sans-serif'
              }}>
                © 2024 {companyName}. All rights reserved.
              </Text>

              <Text style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: '0 0 16px 0',
                fontFamily: 'Arial, sans-serif'
              }}>
                {companyAddress}
              </Text>

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
                  href="#"
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