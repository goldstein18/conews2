import { gql } from "@apollo/client";

export const MY_COMPANY_DASHBOARD = gql`
  query MyCompanyDashboard($market: String) {
    myCompanyDashboard(market: $market) {
      company {
        id
        name
        email
        phone
        address
        city
        state
        logo
        status
        isActive
        userCount
        managerCount
        owner {
          id
          firstName
          lastName
          email
        }
        plan {
          id
          plan
          planSlug
          price
          priceLong
        }
        createdAt
        updatedAt
      }
      events {
        totalEvents
        pendingEvents
        liveEvents
        draftEvents
        pastEvents
        rejectedEvents
        featuredCount
      }
      banners {
        totalClicks
        totalImpressions
        ctr
        activeBanners
        totalBanners
        pendingBanners
        approvedBanners
      }
      featuredEvents {
        id
        title
        slug
        image
        imageUrl
        startDate
        endDate
        featuredFrom
        status
        market
      }
      assets {
        totalAvailable
        totalConsumed
        totalRemaining
        usagePercentage
        lowStockAssets
        outOfStockAssets
      }
      team {
        totalMembers
        activeMembers
        owners
        admins
      }
      generatedAt
      market
    }
  }
`;

export const ADMIN_DASHBOARD = gql`
  query AdminDashboard($market: String) {
    adminDashboard(market: $market) {
      # Overall Platform Statistics
      overall {
        totalCompanies
        activeCompanies
        pendingCompanies
        suspendedCompanies
        totalSubscribers
        totalCalendarMembers
        totalVenues
        totalRestaurants
        totalActiveEvents
        totalFeaturedEvents
      }

      # Revenue & Financial Metrics (MTD)
      revenue {
        currentMonthRevenue
        previousMonthRevenue
        growthRate
        averageRevenuePerCompany
        totalPayingCompanies
        revenueByPlan {
          planName
          revenue
          companiesCount
        }
      }

      # Companies Insights
      companies {
        # Last 5 Companies Created
        lastCreated {
          id
          name
          email
          city
          market
          status
          planName
          createdAt
          ownerName
          ownerEmail
        }

        # Companies Expiring in Next 30 Days
        expiringThisMonth {
          id
          name
          email
          expiryDate
          daysUntilExpiry
          planName
        }

        # Companies by City/Market
        byCity {
          city
          count
          activeCount
        }

        # Companies by Plan
        byPlan {
          planName
          count
        }

        # Companies by Status
        byStatus {
          status
          count
        }
      }

      # Events by City Statistics
      eventsByCity {
        citiesStats {
          city
          runningEvents
          featuredEvents
          pendingEvents
          totalApprovedEvents
        }
        totalRunningEvents
        totalFeaturedEvents
      }

      # Growth Metrics (Month over Month)
      growth {
        newCompaniesThisMonth
        newCompaniesLastMonth
        companiesGrowthRate
        newUsersThisMonth
        newUsersLastMonth
        usersGrowthRate
        newEventsThisMonth
        newEventsLastMonth
        eventsGrowthRate
      }

      # Users Demographics
      users {
        totalSubscribers
        totalCalendarMembers
        activeUsers
        inactiveUsers
        byMarket {
          market
          count
        }
      }

      generatedAt
      market
    }
  }
`;
