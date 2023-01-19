export const useSvg = (svgName: string) =>
  new URL(`../assets/img/${svgName}.svg`, import.meta.url).href
