import { Section, Container, Row, Column, Text } from '@react-email/components';

interface NewsletterHeaderProps {
  title?: string;
}

export const NewsletterHeader = ({ title = 'eScoop Newsletter' }: NewsletterHeaderProps) => {
  return (
    <Section style={{ backgroundColor: '#14532d', padding: '20px 0' }}>
      <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Row>
          <Column style={{ textAlign: 'center' }}>
            <Text style={{
              color: '#ffffff',
              fontSize: '28px',
              fontWeight: 'bold',
              margin: '0',
              fontFamily: 'Arial, sans-serif'
            }}>
              {title}
            </Text>
            <Text style={{
              color: '#ffffff',
              fontSize: '16px',
              margin: '8px 0 0 0',
              fontFamily: 'Arial, sans-serif'
            }}>
              Your weekly food & dining guide
            </Text>
          </Column>
        </Row>
      </Container>
    </Section>
  );
};