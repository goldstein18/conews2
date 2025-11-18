import { Section, Container, Row, Column, Img, Link } from '@react-email/components';

interface BannerSlotProps {
  imageUrl?: string;
  link?: string;
  alt?: string;
  width?: number;
  height?: number;
}

export const BannerSlot = ({
  imageUrl,
  link = '#',
  alt = 'Advertisement',
  width = 600,
  height = 150
}: BannerSlotProps) => {
  // If no banner image, show placeholder
  if (!imageUrl) {
    return (
      <Section style={{
        backgroundColor: '#f3f4f6',
        margin: '16px 0',
        borderRadius: '8px',
        border: '2px dashed #d1d5db'
      }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Row>
            <Column style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280',
              fontSize: '14px',
              fontFamily: 'Arial, sans-serif'
            }}>
              Advertisement Space
              <br />
              {width} × {height}px
            </Column>
          </Row>
        </Container>
      </Section>
    );
  }

  return (
    <Section style={{
      backgroundColor: '#ffffff',
      margin: '16px 0',
      borderRadius: '8px',
      overflow: 'hidden',
      textAlign: 'center'
    }}>
      <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Row>
          <Column style={{ textAlign: 'center' }}>
            <Link href={link}>
              <Img
                src={imageUrl}
                alt={alt}
                style={{
                  width: '100%',
                  maxWidth: `${width}px`,
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            </Link>
          </Column>
        </Row>
      </Container>
    </Section>
  );
};