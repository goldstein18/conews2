import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const SEARCH_USERS_TO_IMPERSONATE = gql`
  query SearchUsersToImpersonate($search: String, $first: Int, $after: String) {
    membersPaginated(search: $search, first: $first, after: $after) {
      edges {
        node {
          id
          user {
            id
            email
            firstName
            lastName
            isActive
            role {
              id
              name
            }
          }
          company {
            id
            name
            email
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export interface UserToImpersonate {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  role: {
    id: string;
    name: string;
  };
  companyName: string;
  companyEmail: string;
}

export function useSearchUsers(search: string = '') {
  const [users, setUsers] = useState<UserToImpersonate[]>([]);

  const { data, loading, error } = useQuery(SEARCH_USERS_TO_IMPERSONATE, {
    variables: {
      search: search || undefined,
      first: 20,
    },
    skip: !search || search.length < 2,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      if (data?.membersPaginated?.edges) {
        interface MemberEdge {
          node: {
            user: {
              id: string;
              email: string;
              firstName: string;
              lastName: string;
              isActive: boolean;
              role?: {
                id: string;
                name: string;
              };
            };
            company?: {
              id: string;
              name: string;
              email: string;
            };
          };
        }

        const mappedUsers: UserToImpersonate[] = data.membersPaginated.edges
          .filter((edge: MemberEdge) => {
            const roleName = edge.node.user.role?.name;
            // Exclude SUPER_ADMIN and ADMIN from impersonation
            return roleName !== 'SUPER_ADMIN' && roleName !== 'ADMIN';
          })
          .map((edge: MemberEdge) => ({
            id: edge.node.user.id,
            email: edge.node.user.email,
            firstName: edge.node.user.firstName,
            lastName: edge.node.user.lastName,
            isActive: edge.node.user.isActive,
            role: edge.node.user.role || { id: '', name: '' },
            companyName: edge.node.company?.name || 'Unknown Company',
            companyEmail: edge.node.company?.email || '',
          }));

        setUsers(mappedUsers);
      }
    },
  });

  return {
    users,
    loading,
    error,
    totalCount: data?.membersPaginated?.totalCount || 0,
  };
}
