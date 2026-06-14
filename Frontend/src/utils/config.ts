declare const process: {
  env: {
    API_BASE_URL?: string;
    ASSETS_BASE_URL?: string;
    DEMO_MODE?: string;
    PUBLIC_PATH?: string;
  };
};

export const DEMO_MODE = process.env.DEMO_MODE === 'true';
export const PUBLIC_PATH = process.env.PUBLIC_PATH || '/';
export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api';
export const ASSETS_BASE_URL = process.env.ASSETS_BASE_URL || 'http://localhost:3001';

export const getVacationImageUrl = (imageFilename: string | null): string | null => {
  if (!imageFilename) {
    return null;
  }

  if (imageFilename.startsWith('http://') || imageFilename.startsWith('https://')) {
    return imageFilename;
  }

  return `${ASSETS_BASE_URL}/uploads/${imageFilename}`;
};
