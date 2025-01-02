import cv from '@techstark/opencv-js';
import { processImage } from './processImage';

export interface ImageFeatures {
  area: number;
  perimeter: number;
  vertices: number;
  shadedArea: number;
  components: number;
}

export async function extractFeatures(imageSrc: string, width: number, height: number): Promise<ImageFeatures> {
  const mat = await processImage(imageSrc, width, height);
  
  const [area, perimeter, vertices] = await getContour(mat);
  const shadedArea = getShadedArea(mat, width * height);
  const components = getComponents(mat);
  
  mat.delete();
  
  return {
    area,
    perimeter,
    vertices,
    shadedArea,
    components
  };
}

function getContour(mat: cv.Mat): [number, number, number] {
  const imgGray = new cv.Mat();
  const thresh = new cv.Mat();
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();

  try {
    cv.cvtColor(mat, imgGray, cv.COLOR_RGBA2GRAY);
    cv.threshold(imgGray, thresh, 100, 255, cv.THRESH_BINARY_INV);
    cv.findContours(thresh, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
    
    if (contours.size() === 0) {
      return [0, 0, 0];
    }
    
    let maxArea = 0;
    let maxContour = contours.get(0);
    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);
      const area = cv.contourArea(cnt);
      if (area > maxArea) {
        maxArea = area;
        maxContour = cnt;
      }
    }
    
    const perimeter = cv.arcLength(maxContour, true);
    const epsilon = 0.01 * perimeter;
    const approx = new cv.Mat();
    cv.approxPolyDP(maxContour, approx, epsilon, true);
    
    const vertices = approx.rows;
    
    return [
      Math.round(maxArea * 1000) / 1000,
      Math.round(perimeter * 1000) / 1000,
      Math.round(vertices * 1000) / 1000
    ];
  } finally {
    imgGray.delete();
    thresh.delete();
    contours.delete();
    hierarchy.delete();
  }
}

function getShadedArea(mat: cv.Mat, totalArea: number): number {
  const imgGray = new cv.Mat();
  const thresh = new cv.Mat();

  try {
    cv.cvtColor(mat, imgGray, cv.COLOR_RGBA2GRAY);
    cv.threshold(imgGray, thresh, 100, 255, cv.THRESH_BINARY_INV);
    const nonZero = cv.countNonZero(thresh);
    return Math.round((nonZero / totalArea) * 100) / 100;
  } finally {
    imgGray.delete();
    thresh.delete();
  }
}

function getComponents(mat: cv.Mat): number {
  const imgGray = new cv.Mat();
  const thresh = new cv.Mat();
  const labels = new cv.Mat();
  const stats = new cv.Mat();
  const centroids = new cv.Mat();

  try {
    cv.cvtColor(mat, imgGray, cv.COLOR_RGBA2GRAY);
    cv.threshold(imgGray, thresh, 100, 255, cv.THRESH_BINARY_INV);
    return cv.connectedComponentsWithStats(thresh, labels, stats, centroids);
  } finally {
    imgGray.delete();
    thresh.delete();
    labels.delete();
    stats.delete();
    centroids.delete();
  }
}