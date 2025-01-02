export interface RavensFigure {
  name: string;
  visualFilename: string;
}

export interface RavensProblem {
  name: string;
  problemType: '2x2' | '3x3';
  problemSetName: string;
  hasVisual: boolean;
  hasVerbal: boolean;
  figures: Record<string, RavensFigure>;
}