export interface DedicatedCampaign {
  id: string;
  dedicatedId: string;
  brevoCampaignId: number;
  campaignName?: string;
  subject: string;
  status: string;
  templateId?: number;
  sentAt?: string;
  scheduledAt?: string;
  brevoLists: (string | number)[]; // Backend sends numbers, frontend uses strings
  brevoSegments: (string | number)[]; // Backend sends numbers, frontend uses strings
  brevoSender: {
    name: string;
    email: string;
  };
  recipientCount?: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Dedicated {
  id: string;
  subject: string;
  alternateText: string;
  link: string;
  sendDate: string;
  status: DedicatedStatus;
  market: string;
  companyId: string;
  userId: string;
  image: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string | null;
  company?: {
    id: string;
    name: string;
    email: string;
  };
  owner?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  campaign?: DedicatedCampaign;
}

export enum DedicatedStatus {
  PENDING = 'PENDING',
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  DELETED = 'DELETED'
}

export interface DedicatedFilterInput {
  status?: DedicatedStatus;
  market?: string;
  searchTerm?: string;
}

export interface DedicatedStats {
  total: number;
  pending: number;
  scheduled: number;
  sent: number;
  deleted: number;
  byMarket?: number;
}

export interface CreateDedicatedInput {
  subject: string;
  alternateText: string;
  link: string;
  sendDate: string;
  market: string;
  companyId: string;
  image?: string;
}

export interface UpdateDedicatedInput {
  id: string;
  subject?: string;
  alternateText?: string;
  link?: string;
  sendDate?: string;
  market?: string;
  image?: string;
}

export interface GenerateDedicatedImageUploadUrlInput {
  dedicatedId: string;
  fileName: string;
  contentType: string;
  fileSize: number;
}

export interface CreateDedicatedCampaignInput {
  dedicatedId: string;
  subject: string;
  htmlContent: string;
  listIds: string[];
  segmentIds?: string[];
  exclusionListIds?: string[];
  scheduledAt?: string;
  sender: {
    name: string;
    email: string;
  };
}

export interface UpdateDedicatedCampaignInput {
  dedicatedId: string;
  subject?: string;
  htmlContent?: string;
  listIds?: string[];
  segmentIds?: string[];
  exclusionListIds?: string[];
  scheduledAt?: string;
  sender?: {
    name: string;
    email: string;
  };
}
