export const MessageSocketType = {
  CREATE_DEGREE: "CREATE_DEGREE",
  UPDATE_DEGREE: "UPDATE_DEGREE",
} as const;

export type MessageSocketType =
  typeof MessageSocketType[keyof typeof MessageSocketType];
