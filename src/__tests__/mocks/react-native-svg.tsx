import React from 'react'

const mock = (name: string) => {
  const Component = ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
    React.createElement(name, props, children)
  Component.displayName = name
  return Component
}

const Svg = mock('svg')
export default Svg
export const Circle = mock('circle')
export const ClipPath = mock('clipPath')
export const Defs = mock('defs')
export const Ellipse = mock('ellipse')
export const ForeignObject = mock('foreignObject')
export const G = mock('g')
export const Image = mock('image')
export const Line = mock('line')
export const LinearGradient = mock('linearGradient')
export const Marker = mock('marker')
export const Mask = mock('mask')
export const Path = mock('path')
export const Pattern = mock('pattern')
export const Polygon = mock('polygon')
export const Polyline = mock('polyline')
export const RadialGradient = mock('radialGradient')
export const Rect = mock('rect')
export const Stop = mock('stop')
export const Symbol = mock('symbol')
export const Text = mock('text')
export const TextPath = mock('textPath')
export const TSpan = mock('tspan')
export const Use = mock('use')
