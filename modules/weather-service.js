import { ByDefault } from '../app.js'
import { CONFIG, API_ENDPOINTS, ERROR_MESSAGES} from './config.js'
//Functia ge gasire a vremii:
export const getCurrentWeather = async (city) => {
        const resolved = await makeRequest(buildUrl(`${API_ENDPOINTS.CURRENT_WEATHER}`,{q:`${city}`})).then((data)=>{
            return data
        })
        return  resolved
    }
//In cazul unei errori de gasire a locatiei:
export const getCurrentWeatherWithFallback = async (city) => {
  try {
    return await getCurrentWeather(city)
  } catch (error) {
    console.warn('Locatia ramane, ultima locatie:\n ↪ERROR:', error.message)
    return {
      ...ByDefault,
      isFallback: true,
      fallbackReason: error.message,
    }
  }
}
//Gasirea vremii dupa coordonate:
export const getWeatherByCoords = async (lat, lon) => {
    const url = buildUrl(API_ENDPOINTS.CURRENT_WEATHER, { lat, lon });
    return await makeRequest(url);
}
//Construirea URL-ului:
export const buildUrl = (endpoint, params = {}) => {

  const url = new URL(CONFIG.API_BASE_URL + endpoint)

  url.searchParams.set('appid', CONFIG.API_KEY)
  url.searchParams.set('units', CONFIG.DEFAULT_UNITS)
  url.searchParams.set('lang', CONFIG.DEFAULT_LANG)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value)
    }
  })

  return url.toString()
}
//Construirea API-ului:
export const makeRequest = async (url) => {
  try {
    const response = await fetch(url)
    
    if (response.ok) {
      return await response.json()
    }
    if (!response.ok) {
      let message;
      switch (response.status) {
        case 404:
          message = ERROR_MESSAGES.CITY_NOT_FOUND;
          break;
        case 401:
          message = ERROR_MESSAGES.API_KEY_MISSING;
          break;
        case 500:
          message = 'Eroare internă a serverului. Încearcă din nou mai târziu.';
          break;
        default:
          message = ERROR_MESSAGES.UNKNOWN_ERROR;
      }
      throw new Error(message)
    }
    return await response.json()
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR); // Fără internet
    }
    throw new Error(error.message || ERROR_MESSAGES.UNKNOWN_ERROR)
  }
}