import moment from 'moment';

export function formatMemberDate(dateString: string): string {
  const date = moment(dateString);
  return date.format('MMM YYYY');
}

export function getMemberStatusColor(isActive: boolean): string {
  return isActive ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50';
}

export function getMemberStatusText(isActive: boolean): string {
  return isActive ? 'Active' : 'Pending';
}

export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    'OWNER': 'Owner',
    'ADMIN': 'Admin',
    'MANAGER': 'Manager',
    'MEMBER': 'Member'
  };
  
  return roleMap[role] || role;
}

export function getRoleColor(role: string): string {
  const colorMap: Record<string, string> = {
    'OWNER': 'text-purple-600 bg-purple-50 border-purple-200',
    'ADMIN': 'text-blue-600 bg-blue-50 border-blue-200',
    'MANAGER': 'text-green-600 bg-green-50 border-green-200',
    'MEMBER': 'text-gray-600 bg-gray-50 border-gray-200'
  };
  
  return colorMap[role] || 'text-gray-600 bg-gray-50 border-gray-200';
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return moment(dateString).format('MMM DD, YYYY');
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
  return phoneRegex.test(phone);
}

export function formatPhoneNumber(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return value;
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  if (!url) return '';
  
  // Add https:// if no protocol is provided
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  
  return url;
}

export function getSocialPlatformName(key: string): string {
  const platformMap: Record<string, string> = {
    'facebook': 'Facebook',
    'instagram': 'Instagram',
    'twitter': 'Twitter',
    'linkedin': 'LinkedIn',
    'youtube': 'YouTube',
    'tiktok': 'TikTok',
    'website': 'Website'
  };
  
  return platformMap[key] || key;
}

export function getSocialIcon(platform: string): string {
  const iconMap: Record<string, string> = {
    'facebook': '👥',
    'instagram': '📷',
    'twitter': '🐦',
    'linkedin': '💼',
    'youtube': '▶️',
    'tiktok': '🎵',
    'website': '🌐'
  };
  
  return iconMap[platform] || '🔗';
}

export function getSocialPlatformPlaceholder(platform: string): string {
  const placeholderMap: Record<string, string> = {
    'facebook': 'https://facebook.com/yourpage',
    'instagram': 'https://instagram.com/yourhandle',
    'twitter': 'https://twitter.com/yourhandle',
    'linkedin': 'https://linkedin.com/company/yourcompany',
    'youtube': 'https://youtube.com/@yourchannel',
    'tiktok': 'https://tiktok.com/@yourhandle',
    'website': 'https://yourwebsite.com'
  };
  
  return placeholderMap[platform] || `https://${platform}.com/yourhandle`;
}