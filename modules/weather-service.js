import { ByDefault } from '../app.js'
import { CONFIG, API_ENDPOINTS, ERROR_MESSAGES} from './config.js'
import { elements } from './ui-controller.js'
export const getCurrentWeather = async (city) => {
        const resolved = await makeRequest(buildUrl(`${API_ENDPOINTS.CURRENT_WEATHER}`,{q:`${city}`})).then((data)=>{
            return data
        })
        return  resolved
    }
// console.log(getCurrentWeather())

export const getCurrentWeatherWithFallback = async (city) => {
  try {
    return await getCurrentWeather(city)
  } catch (error) {
    console.warn('Using fallback data due to:', error.message)
    return {
      ...ByDefault,
      isFallback: true,
      fallbackReason: error.message,
    }
  }
}

export const getWeatherByCoords = async (lat, lon) => {
    const url = buildUrl(API_ENDPOINTS.CURRENT_WEATHER, { lat, lon });
    return await makeRequest(url);
}

  // Similar, dar pentru coordonate

// În modules/weather-service.js
export const buildUrl = (endpoint, params = {}) => {
  // Cum combini base URL cu endpoint?
  const url = new URL(CONFIG.API_BASE_URL + endpoint)

  // Ce parametri sunt întotdeauna necesari?
  url.searchParams.set('appid', CONFIG.API_KEY)
  url.searchParams.set('units', CONFIG.DEFAULT_UNITS)
  url.searchParams.set('lang', CONFIG.DEFAULT_LANG)

  // Cum adaugi parametrii specifici (city, lat, lon)?
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value)
    }
  })

  return url.toString()
}
export const makeRequest = async (url) => {
  try {
    const response = await fetch(url)

    // Cum verifici că request-ul a fost successful?
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