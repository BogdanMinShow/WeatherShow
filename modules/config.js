export const CONFIG = {
  API_KEY: 'f0bccf546e223e16796a07371e4f9407', // API KEY
  API_BASE_URL: 'https://api.openweathermap.org/data/2.5',
  DEFAULT_UNITS: `metric`,
  DEFAULT_LANG: `ro`,
  MAX_HISTORY_ITEMS: 10,
  STORAGE_KEYS: {
    SEARCH_HISTORY: 'weather_search_history',
    USER_PREFERENCES: 'weather_user_prefs',
  },
  LOGGING: {
    ENABLED: true,
    LEVEL: 'info', // 'debug', 'info', 'warn', 'error'
    MAX_LOGS: 100,
  },
}

export const API_ENDPOINTS = {
  CURRENT_WEATHER: `/weather`,
  FORECAST: `/forecast`,
}

export const ERROR_MESSAGES = {
  CITY_NOT_FOUND: "Orasul nu a fost gasit!",
  NETWORK_ERROR: "Conexiune la internet, lipsa!",
}