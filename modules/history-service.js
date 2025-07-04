import { CONFIG } from "./config.js"
import { logger } from "./logger.js";

export class HistoryService {
  constructor() {
    this.storageKey = CONFIG.STORAGE_KEYS.SEARCH_HISTORY
    this.maxItems = CONFIG.MAX_HISTORY_ITEMS
  }

addLocation(weatherData) {
  const city = weatherData.name;
  const country = weatherData.sys?.country || "Unknown";
  const coord = weatherData.coord;
  const timestamp = Date.now()
  if (!city) return;

  const newLocation = { city, country, coord, timestamp };
  
  let history = this._loadFromStorage();
  const existingIndex = history.findIndex(
    (item) => item.city.toLowerCase() === city.toLowerCase());
  if (existingIndex !== -1) {
    history.splice(existingIndex, 1);
  }
  
  history.unshift(newLocation);

  if (history.length > this.maxItems) {
    history = history.slice(0, this.maxItems);
  }

  this._saveToStorage(history);
  logger.info(`|💾-Locația a fost salvata:\n  >🏢Oras:${city}; \n  >🚩Regiune:${country}; \n  >📡Coord: LAT:${coord.lat} - LON:${coord.lon}`);
}

  getHistory() {
    const history = this._loadFromStorage();
  return Array.isArray(history) ? history : [];
  }

  removeLocation(city) {
   let history = this._loadFromStorage();
    history = history.filter(
      (item) => item.city.toLowerCase() !== city.toLowerCase()
    );
    this._saveToStorage(history);
    console.log(`♨️Locația ștearsă: ${city}`);
  }

  clearHistory() {
     localStorage.removeItem(this.storageKey);
    console.log("♨️Istoricul a fost șters complet.");
  }

  _saveToStorage(history) {
     try {
    localStorage.setItem(this.storageKey, JSON.stringify(history));
  } catch (error) {
    console.error("‼️Locația nu s-a salvat‼️", error);
  }
  }
  _loadFromStorage() {
     try {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("‼️Locația nu s-a incarcat‼️", error);
    return [];
  }
  }
  moveToTop(cityName) {
        const history = this.getHistory()
        const index = history.findIndex(item => item.city === cityName)

        if (index !== -1) {
            const [item] = history.splice(index, 1)
            history.unshift(item)
            localStorage.setItem(this.storageKey, JSON.stringify(history))
        }
    }
}

export const historyService = new HistoryService()