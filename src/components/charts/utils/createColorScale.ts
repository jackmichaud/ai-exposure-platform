import * as d3 from 'd3';

export function createColorScale(domain: [number, number] = [100, 0]) {
  return d3.scaleSequential(d3.interpolateRdYlBu).domain(domain);
}

export function scoreToColor(score: number): string {
  return createColorScale()(score);
}
