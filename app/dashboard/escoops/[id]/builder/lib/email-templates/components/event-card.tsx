import { Section, Container, Row, Column, Text, Img, Link } from '@react-email/components';

interface EventCardProps {
  title: string;
  imageUrl?: string;
  startDate?: string;
  location?: string;
  description?: string;
  eventUrl?: string;
  formattedDate?: string;
  layout?: 'compact' | 'featured';
  isFeatured?: boolean;
}

export const EventCard = ({
  title,
  imageUrl,
  startDate,
  location,
  description,
  eventUrl = '#',
  formattedDate,
  layout = 'compact',
  isFeatured = false
}: EventCardProps) => {
  // Use provided formattedDate or generate one
  const displayDate = formattedDate || (startDate
    ? new Date(startDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '');

  // Featured layout for "Upcoming Events" section
  if (layout === 'featured') {
    return (
      <Section style={{
        backgroundColor: '#ffffff',
        margin: '20px 0',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* Event Image - Full Width */}
          {imageUrl && (
            <Row>
              <Column>
                <Link href={eventUrl}>
                  <Img
                    src={imageUrl}
                    alt={title}
                    style={{
                      width: '100%',
                      height: '320px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </Link>
              </Column>
            </Row>
          )}

          {/* Event Details */}
          <Row>
            <Column style={{
              padding: '24px',
              verticalAlign: 'top'
            }}>
              {/* Featured Badge */}
              {isFeatured && (
                <Text style={{
                  backgroundColor: '#fbbf24',
                  color: '#92400e',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  display: 'inline-block',
                  margin: '0 0 12px 0',
                  fontFamily: 'Arial, sans-serif',
                  textAlign: 'center'
                }}>
                  ⭐ FEATURED EVENT
                </Text>
              )}

              {/* Date Range */}
              {displayDate && (
                <Text style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0 0 8px 0',
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: '500',
                  letterSpacing: '0.5px'
                }}>
                  {displayDate}
                </Text>
              )}

              {/* Event Title */}
              <Link
                href={eventUrl}
                style={{
                  textDecoration: 'none',
                  color: '#1f2937'
                }}
              >
                <Text style={{
                  fontSize: '22px',
                  fontWeight: 'bold',
                  margin: '0 0 12px 0',
                  color: '#1f2937',
                  fontFamily: 'Arial, sans-serif',
                  lineHeight: '1.3'
                }}>
                  {title}
                </Text>
              </Link>

              {/* Location */}
              {location && (
                <Text style={{
                  fontSize: '16px',
                  color: '#ef4444',
                  margin: '0 0 16px 0',
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: '500'
                }}>
                  📍 {location}
                </Text>
              )}

              {/* Description */}
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
  }

  // Compact layout (original design)
  return (
    <Section style={{
      backgroundColor: '#ffffff',
      margin: '16px 0',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
        <Row>
          {imageUrl && (
            <Column style={{ width: '180px', verticalAlign: 'top' }}>
              <Link href={eventUrl}>
                <Img
                  src={imageUrl}
                  alt={title}
                  style={{
                    width: '180px',
                    height: '120px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </Link>
            </Column>
          )}
          <Column style={{
            padding: '16px',
            verticalAlign: 'top',
            width: imageUrl ? '420px' : '100%'
          }}>
            <Link
              href={eventUrl}
              style={{
                textDecoration: 'none',
                color: '#1f2937'
              }}
            >
              <Text style={{
                fontSize: '18px',
                fontWeight: 'bold',
                margin: '0 0 8px 0',
                color: '#1f2937',
                fontFamily: 'Arial, sans-serif',
                lineHeight: '1.4'
              }}>
                {title}
              </Text>
            </Link>

            {displayDate && (
              <Text style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 8px 0',
                fontFamily: 'Arial, sans-serif'
              }}>
                📅 {displayDate}
              </Text>
            )}

            {location && (
              <Text style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0 0 8px 0',
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