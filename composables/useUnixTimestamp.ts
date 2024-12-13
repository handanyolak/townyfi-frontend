export const useUnixTimestamp = async (): Promise<number> => {
  // const url = 'https://worldtimeapi.org/api/timezone/Etc/UTC'
  // const response = await fetch(url)
  // const data = await response.json()
  // console.log(data?.unixtime, Math.floor(Date.now() / 1000))
  return Math.floor(Date.now() / 1000)
}
