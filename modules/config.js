export const CONFIG = {
  API_KEY: 'f0bccf546e223e16796a07371e4f9407', // Unde obții asta?
  API_BASE_URL: 'https://api.openweathermap.org/data/2.5' /* care este URL-ul de bază? */,
  DEFAULT_UNITS: `metric` /* metric sau imperial? */,
  DEFAULT_LANG: `ro` /* ro, en, sau altceva? */,
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
  CURRENT_WEATHER: `/weather` /* ce endpoint pentru vremea curentă? */,
  FORECAST: `/forecast` /* ce endpoint pentru prognoză? */,
}

export const ERROR_MESSAGES = {
  CITY_NOT_FOUND: "Orasul nu a fost gasit!" /* ce mesaj prietenos? */,
  NETWORK_ERROR: "Conexiune la internet, lipsa!" /* ce mesaj când nu ai internet? */,
  // Ce alte erori pot apărea? (UNKONOM_ERROR)
}