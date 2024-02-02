export const useLottie = (name: string) =>
  new URL(`../assets/lotties/${name}.json`, import.meta.url).href
