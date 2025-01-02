import cv from '@techstark/opencv-js';

export async function processImage(imageSrc: string, width: number, height: number): Promise<cv.Mat> {
  const response = await fetch(imageSrc);
  const blob = await response.blob();
  const img = await createImageBitmap(blob);
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);
  
  const imageData = ctx.getImageData(0, 0, width, height);
  return cv.matFromImageData(imageData);
}