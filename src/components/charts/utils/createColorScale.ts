import * as d3 from 'd3';

export function createColorScale(domain: [number, number] = [100, 0]) {
  return d3.scaleSequential(d3.interpolateRdYlBu).domain(domain);
}

export function scoreToColor(score: number): string {
  return createColorScale()(score);
}

// Net displacement ranges -100 to +100: positive = displacement (red), negative = augmentation (blue)
export function ndToColor(nd: number): string {
  return d3.scaleSequential(d3.interpolateRdYlBu).domain([100, -100])(nd);
}
