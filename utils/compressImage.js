import sharp from "sharp";

export const compressImage = async (buffer) => {
  return sharp(buffer).jpeg({ quality: 30 }).toBuffer();
};
