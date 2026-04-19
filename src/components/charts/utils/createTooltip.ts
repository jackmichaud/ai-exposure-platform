import * as d3 from 'd3';

export function createTooltip(container: HTMLElement) {
  return d3
    .select(container)
    .append('div')
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('opacity', '0')
    .style('transition', 'opacity 150ms ease-out')
    .style('z-index', '50');
}
