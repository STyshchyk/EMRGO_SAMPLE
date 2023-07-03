export const isValidEmail = (email: string): boolean => !!email.match(/^\S+@\S+\.\S+$/);
