import { Section, Container, Row, Column, Text, Img, Link } from '@react-email/components';

interface RestaurantCardProps {
  name: string;
  imageUrl?: string;
  description?: string;
  cuisineType?: string;
  location?: string;
  restaurantUrl?: string;
  isPickOfTheMonth?: boolean;
}

export const RestaurantCard = ({
  name,
  imageUrl,
  description,
  cuisineType,
  location,
  restaurantUrl = '#',
  isPickOfTheMonth = false
}: RestaurantCardProps) => {
  return (
    <Section style={{
      backgroundColor: '#ffffff',
      margin: '16px 0',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Restaurant Pick of the Month Banner */}
        {isPickOfTheMonth && (
          <Row>
            <Column style={{
              backgroundColor: '#ef4444',
              color: '#ffffff',
              textAlign: 'center',
              padding: '12px 16px',
              fontSize: '14px',
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif',
              letterSpacing: '0.5px'
            }}>
              RESTAURANT PICK OF THE MONTH
            </Column>
          </Row>
        )}

        {/* Restaurant Image */}
        {imageUrl && (
          <Row>
            <Column>
              <Link href={restaurantUrl}>
                <Img
                  src={imageUrl}
                  alt={name}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </Link>
            </Column>
          </Row>
        )}

        {/* Restaurant Information */}
        <Row>
          <Column style={{
            padding: '20px',
            verticalAlign: 'top'
          }}>
            <Link
              href={restaurantUrl}
              style={{
                textDecoration: 'none',
                color: '#1f2937'
              }}
            >
              <Text style={{
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0 0 8px 0',
                color: '#1f2937',
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.3'
              }}>
                {name}
              </Text>
            </Link>

            {cuisineType && (
              <Text style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: '0 0 8px 0',
                fontFamily: 'Arial, sans-serif',
                fontStyle: 'italic'
              }}>
                {cuisineType}
              </Text>
            )}

            {location && (
              <Text style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 12px 0',
                fontFamily: 'Arial, sans-serif'
              }}>
                📍 {location}
              </Text>
            )}

            {description && (
              <Text style={{
                fontSize: '14px',
                color: '#4b5563',
                margin: '0',
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.5'
              }}>
                {description}
              </Text>
            )}
          </Column>
        </Row>
      </Container>
    </Section>
  );
};