import { TagType } from '@/types/tags';

export const getTagTypeLabel = (type: TagType): string => {
  const labels: Record<TagType, string> = {
    [TagType.MAIN_GENRE]: 'Main Genre',
    [TagType.SUBGENRE]: 'Sub Genre',
    [TagType.SUPPORTING]: 'Supporting',
    [TagType.AUDIENCE]: 'Audience'
  };
  return labels[type];
};

export const getTagTypeColor = (type: TagType): string => {
  const colors: Record<TagType, string> = {
    [TagType.MAIN_GENRE]: 'bg-purple-100 text-purple-800',
    [TagType.SUBGENRE]: 'bg-blue-100 text-blue-800',
    [TagType.SUPPORTING]: 'bg-green-100 text-green-800',
    [TagType.AUDIENCE]: 'bg-orange-100 text-orange-800'
  };
  return colors[type];
};

export const formatMainGenreDisplay = (mainGenre?: string): string => {
  if (!mainGenre) return '-';
  return mainGenre.replace(/_/g, ' ');
};

export const validateHexColor = (color: string): boolean => {
  const hexRegex = /^#[0-9A-Fa-f]{6}$/;
  return hexRegex.test(color);
};

export const generateColorFromName = (name: string): string => {
  // Simple hash function to generate consistent colors
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Generate RGB values
  const r = Math.abs(hash) % 256;
  const g = Math.abs(hash >> 8) % 256;
  const b = Math.abs(hash >> 16) % 256;
  
  // Convert to hex
  const toHex = (num: number) => {
    const hex = num.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const sortTagsByOrder = <T extends { order: number }>(tags: T[]): T[] => {
  return [...tags].sort((a, b) => a.order - b.order);
};

export const groupTagsByType = <T extends { type: TagType }>(tags: T[]) => {
  return tags.reduce((acc, tag) => {
    if (!acc[tag.type]) {
      acc[tag.type] = [];
    }
    acc[tag.type].push(tag);
    return acc;
  }, {} as Record<TagType, T[]>);
};