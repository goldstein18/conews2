import { ArtsGroup, ArtsGroupStatus, ArtsGroupStats } from '@/types/arts-groups';

/**
 * Calculate arts group statistics from a list of arts groups
 */
export const calculateArtsGroupStats = (artsGroups: ArtsGroup[]): ArtsGroupStats => {
  const stats: ArtsGroupStats = {
    total: artsGroups.length,
    approved: 0,
    pending: 0,
    declined: 0,
    deleted: 0
  };

  artsGroups.forEach(group => {
    switch (group.status) {
      case ArtsGroupStatus.APPROVED:
        stats.approved++;
        break;
      case ArtsGroupStatus.PENDING:
        stats.pending++;
        break;
      case ArtsGroupStatus.DECLINED:
        stats.declined++;
        break;
      case ArtsGroupStatus.DELETED:
        stats.deleted++;
        break;
    }
  });

  return stats;
};

/**
 * Filter arts groups by search term
 */
export const filterArtsGroupsBySearch = (
  artsGroups: ArtsGroup[],
  searchTerm: string
): ArtsGroup[] => {
  if (!searchTerm) return artsGroups;

  const lowerSearch = searchTerm.toLowerCase();
  return artsGroups.filter(group =>
    group.name.toLowerCase().includes(lowerSearch) ||
    group.company?.name.toLowerCase().includes(lowerSearch) ||
    group.email?.toLowerCase().includes(lowerSearch) ||
    group.artType?.toLowerCase().includes(lowerSearch) ||
    group.market?.toLowerCase().includes(lowerSearch)
  );
};

/**
 * Filter arts groups by status
 */
export const filterArtsGroupsByStatus = (
  artsGroups: ArtsGroup[],
  status: ArtsGroupStatus | 'ALL'
): ArtsGroup[] => {
  if (status === 'ALL') return artsGroups;
  return artsGroups.filter(group => group.status === status);
};

/**
 * Filter arts groups by market
 */
export const filterArtsGroupsByMarket = (
  artsGroups: ArtsGroup[],
  market: string
): ArtsGroup[] => {
  if (!market) return artsGroups;
  return artsGroups.filter(group => group.market === market);
};

/**
 * Filter arts groups by art type
 */
export const filterArtsGroupsByArtType = (
  artsGroups: ArtsGroup[],
  artType: string
): ArtsGroup[] => {
  if (!artType) return artsGroups;
  return artsGroups.filter(group => group.artType === artType);
};

/**
 * Sort arts groups by field and direction
 */
export const sortArtsGroups = (
  artsGroups: ArtsGroup[],
  field: 'name' | 'createdAt' | 'updatedAt' | 'status' | 'market' | 'artType',
  direction: 'asc' | 'desc'
): ArtsGroup[] => {
  const sorted = [...artsGroups].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'market':
        comparison = (a.market || '').localeCompare(b.market || '');
        break;
      case 'artType':
        comparison = (a.artType || '').localeCompare(b.artType || '');
        break;
    }

    return direction === 'asc' ? comparison : -comparison;
  });

  return sorted;
};

/**
 * Get status badge color class
 */
export const getStatusBadgeClass = (status: ArtsGroupStatus): string => {
  switch (status) {
    case ArtsGroupStatus.APPROVED:
      return 'bg-green-100 text-green-800 border-green-200';
    case ArtsGroupStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case ArtsGroupStatus.DECLINED:
      return 'bg-red-100 text-red-800 border-red-200';
    case ArtsGroupStatus.DELETED:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Get status label
 */
export const getStatusLabel = (status: ArtsGroupStatus): string => {
  switch (status) {
    case ArtsGroupStatus.APPROVED:
      return 'Approved';
    case ArtsGroupStatus.PENDING:
      return 'Pending';
    case ArtsGroupStatus.DECLINED:
      return 'Declined';
    case ArtsGroupStatus.DELETED:
      return 'Deleted';
    default:
      return 'Unknown';
  }
};

/**
 * Format founded year for display
 */
export const formatFoundedYear = (year?: number): string => {
  if (!year) return 'N/A';
  return year.toString();
};

/**
 * Format member count for display
 */
export const formatMemberCount = (count?: number): string => {
  if (!count || count === 0) return 'N/A';
  return count.toLocaleString();
};

/**
 * Truncate text to a specific length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
