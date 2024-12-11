export const useUnixTimestamp = async (): Promise<number> => {
  const url = 'https://worldtimeapi.org/api/timezone/Etc/UTC'

  const response = await fetch(url)

  const data = await response.json()
  return data.unixtime
}
