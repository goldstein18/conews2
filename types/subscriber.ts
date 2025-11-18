/**
 * Subscriber types for cultural members (CULTURAL_MEMBER role)
 * Subscribers are free users who register to discover and attend events
 */

export interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  city: string;
  state: string;
  role?: {
    id: string;
    name: string;
    displayName: string;
  };
  userTags?: UserTag[];
  createdAt: string;
  updatedAt?: string;
}

export interface UserTag {
  id: string;
  tagId: string;
  userId: string;
  assignedAt: string;
  tag: {
    id: string;
    name: string;
    type: string;
    color?: string;
    display: string;
  };
}

export interface CreateSubscriberInput {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  city: string;
  state: string;
  tagIds?: string[];
  turnstileToken: string;
}

export interface UpdateSubscriberInput {
  id: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
}

export interface SubscriberRegistrationData {
  email: string;
  confirmEmail: string;
  firstName: string;
  lastName?: string;
  password: string;
  city: string;
  state: string;
  sendNotifications: boolean;
  turnstileToken: string;
}
