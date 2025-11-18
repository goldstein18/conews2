import { gql } from '@apollo/client';

export const GET_PLANS = gql`
  query Plans {
    plans {
      createdAt
      deletedAt
      id
      plan
      planSlug
      price
      priceLong
      stripeId
      updatedAt
      description
      status
      allowances {
        appBanners
        banners
        createdAt
        dedicated
        eMags
        editorials
        escoopBanners
        escoopFeature
        escoops
        eventFeaturedHp
        events
        fbCarousels
        fbCovers
        fbSocialAd
        fbSocialBoost
        genreBlue
        genreBlue6
        genreBlue12
        genreGreen
        genreGreen6
        genreGreen12
        genreRed
        id
        lbhBanners
        lbvBanners
        mainFeatures
        marquee
        pageAd
        restaurants
        updatedAt
        venues
      }
    }
  }
`;

export const CREATE_PLAN_WITH_STRIPE = gql`
  mutation CreatePlanWithStripe($createPlanWithStripeInput: CreatePlanWithStripeInput!) {
    createPlanWithStripe(createPlanWithStripeInput: $createPlanWithStripeInput) {
      createdAt
      deletedAt
      id
      plan
      planSlug
      price
      priceLong
      stripeId
      updatedAt
    }
  }
`;

export const UPDATE_PLAN = gql`
  mutation UpdatePlan($id: ID!, $updatePlanInput: UpdatePlanInput!) {
    updatePlan(id: $id, updatePlanInput: $updatePlanInput) {
      id
      plan
      status
      description
    }
  }
`;