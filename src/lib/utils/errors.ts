export const formatErrorMessages = (errorDetails: any) => {
  return Object.entries(errorDetails)
    .flatMap(([key, message]) => {
      if (Array.isArray(message)) {
        return message.map((msg) => `${key}: ${msg}`);
      }
      return `${key}: ${message}`;
    })
    .join("<br /> \n");
};
