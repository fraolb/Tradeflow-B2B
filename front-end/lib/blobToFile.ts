export const blobToFile = async (
  blob: Blob,
  fileName: string
): Promise<File> => {
  return new File([blob], fileName, {
    type: "application/pdf",
  });
};
