export const extractInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2) // Take the first two parts
    .map((part) => part[0].toUpperCase()) // Get the first character of each part and capitalize it
    .join(""); // Concatenate the initials together
