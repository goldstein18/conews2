/**
 * Form data helper utilities for handling backend validation issues
 */

/**
 * Filters out empty strings from an object to prevent backend validation errors
 * Converts empty strings to null or omits them entirely
 * 
 * @param obj - The object to filter
 * @param requiredFields - Array of field names that should always be included even if empty
 * @param convertToNull - If true, converts empty strings to null; if false, omits them
 * @returns Filtered object
 */
export function filterEmptyFields<T extends Record<string, unknown>>(
  obj: T,
  requiredFields: string[] = [],
  convertToNull: boolean = false
): Partial<T> {
  const filtered: Partial<T> = {};
  
  Object.entries(obj).forEach(([key, value]) => {
    // Always include required fields even if empty
    if (requiredFields.includes(key)) {
      (filtered as Record<string, unknown>)[key] = value;
    } else if (value !== '' && value !== null && value !== undefined) {
      // Only include optional fields if they have actual values
      (filtered as Record<string, unknown>)[key] = value;
    } else if (convertToNull && value === '') {
      // Convert empty string to null if requested
      (filtered as Record<string, unknown>)[key] = null;
    }
    // Otherwise omit the field entirely
  });
  
  return filtered;
}

/**
 * Converts empty strings to null - useful for optional fields with validation
 * @param value - The string value to check
 * @returns null if empty string, otherwise the original value
 */
export function nullifyEmptyString(value: string | undefined | null): string | null {
  return value && value.trim() !== '' ? value : null;
}

/**
 * Venue-specific filter for update operations
 * Handles venue form data and filters out empty optional fields
 */
export function filterVenueUpdateFields(data: Record<string, unknown>) {
  // These fields are required and should always be included
  const requiredFields = [
    'id', 
    'name', 
    'description', 
    'address', 
    'city', 
    'state', 
    'zipcode', 
    'market', 
    'venueType', 
    'companyId', 
    'priority', 
    'hostsPrivateEvents'
  ];

  return filterEmptyFields(data, requiredFields, false);
}

/**
 * Venue-specific filter for create operations
 * Similar to update but without the id field requirement
 */
export function filterVenueCreateFields(data: Record<string, unknown>) {
  // These fields are required for creation
  const requiredFields = [
    'name', 
    'description', 
    'address', 
    'city', 
    'state', 
    'zipcode', 
    'market', 
    'venueType', 
    'companyId', 
    'image' // Required for creation (even if placeholder)
  ];

  return filterEmptyFields(data, requiredFields, false);
}