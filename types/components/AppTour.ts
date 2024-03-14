export interface Step {
  title?: string
  target: string
  content: string
}

export interface TourData {
  top: Ref<number>
  left: Ref<number>
  width: Ref<number>
  height: Ref<number>
}
