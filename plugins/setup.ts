export default defineNuxtPlugin(() => {
  ;(BigInt.prototype as any).toJSON = function () {
    return this.toString()
  }
})
