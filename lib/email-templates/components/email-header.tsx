import { Section, Container, Row, Column, Text, Img } from '@react-email/components';

interface EmailHeaderProps {
  title?: string;
  subtitle?: string;
  logoUrl?: string;
  backgroundColor?: string;
}

/**
 * Shared Email Header Component
 * Reusable header for all email templates across the application
 *
 * @param title - Main title text (e.g., "CultureOwl Miami")
 * @param subtitle - Optional subtitle text
 * @param logoUrl - Optional logo image URL
 * @param backgroundColor - Header background color (default: brand green)
 */
export const EmailHeader = ({
  title = 'CultureOwl',
  subtitle,
  logoUrl,
  backgroundColor = '#14532d' // Brand green color
}: EmailHeaderProps) => {
  return (
    <Section style={{ backgroundColor, padding: '24px 0' }}>
      <Container style={{ maxWidth: '700px', margin: '0 auto' }}>
        <Row>
          <Column style={{ textAlign: 'center' }}>
            {logoUrl && (
              <Img
                src={logoUrl}
                alt={title}
                width="150"
                style={{ margin: '0 auto 16px auto', display: 'block' }}
              />
            )}
            <Text style={{
              color: '#ffffff',
              fontSize: '28px',
              fontWeight: 'bold',
              margin: '0',
              fontFamily: 'Arial, sans-serif'
            }}>
              {title}
            </Text>
            {subtitle && (
              <Text style={{
                color: '#ffffff',
                fontSize: '16px',
                margin: '8px 0 0 0',
                fontFamily: 'Arial, sans-serif'
              }}>
                {subtitle}
              </Text>
            )}
          </Column>
        </Row>
      </Container>
    </Section>
  );
};
