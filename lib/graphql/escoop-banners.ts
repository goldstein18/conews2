import { gql } from '@apollo/client';

// Query to get escoop banners by escoop ID
export const GET_ESCOOP_BANNERS = gql`
  query GetEscoopBanners($escoopId: ID!, $take: Int) {
    escoopBannersByEscoopId(escoopId: $escoopId, take: $take) {
      id
      title
      image
      link
      createdAt
    }
  }
`;

// Types for escoop banners
export interface EscoopBanner {
  id: string;
  title: string;
  image: string;
  link: string;
  createdAt: string;
}

export interface GetEscoopBannersVariables {
  escoopId: string;
  take?: number;
}

export interface GetEscoopBannersData {
  escoopBannersByEscoopId: EscoopBanner[];
}