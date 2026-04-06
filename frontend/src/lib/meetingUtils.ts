/**
 * Generates an 8-character alphanumeric code (uppercase letters and numbers)
 * Format: 8 characters, uppercase letters (A-Z) and numbers (0-9)
 */
export const generateMeetingCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
};

/**
 * Formats a meeting code with a hyphen in the middle for better readability
 * Example: ABC12345 -> ABC1-2345
 */
export const formatMeetingCode = (code: string): string => {
  if (code.length === 8) {
    return `${code.substring(0, 4)}-${code.substring(4)}`;
  }
  return code;
};

/**
 * Removes formatting from a meeting code
 * Example: ABC1-2345 -> ABC12345
 */
export const normalizeMeetingCode = (code: string): string => {
  return code.replace(/[^A-Z0-9]/gi, '').toUpperCase();
};

