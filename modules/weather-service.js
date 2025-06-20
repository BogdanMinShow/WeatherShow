import { MOCK_DATA} from './config.js'
export const getCurrentWeather = async (city) => {
    await new Promise((resolve) => setTimeout(resolve, 999))
        const resolved = await JSON.parse(JSON.stringify(MOCK_DATA.main))
        const newCity = city.toUpperCase(city[0])
        MOCK_DATA.main.name = newCity
        return  MOCK_DATA
    }
// console.log(getCurrentWeather())
export const getWeatherByCoords = async (lat, lon) => {
    console.log("Se incarca coordonatele...")
    await new Promise((resolve) => setTimeout(resolve, 999))
        const resolved = JSON.parse(JSON.stringify(MOCK_DATA.main.coord))
        if (!resolved) {
            console.log(Error("API-ul nu functioneaza!"))
        }
        lat = resolved.lat
        lon = resolved.lon
        return ({lat, lon})
    }
  // Similar, dar pentru coordonate
// console.log(getWeatherByCoords())