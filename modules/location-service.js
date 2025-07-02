import { logger } from "./logger.js";
export const getCoords = () => new Promise(async (resolve, reject) => {
  // Funcția de fallback — când geolocația eșuează
  const fallbackToIp = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      function animation(){
        setTimeout(() => {
          logger.warn("Informatii IP se incarca...")
        }, 250);
        setTimeout(() => {
          logger.warn("Se iau informatii din ORAS...")
        }, 500);
        setTimeout(() => {
          logger.info("●IP-ul este:\n", ` ►${data.ip}`)
          logger.info("●Orasul este:\n", ` ►${data.city}`)
          logger.info("●Judetul este:\n", ` ►${data.region}`)
        }, 1000);
      }
      animation()

      resolve({
        latitude: data.latitude,
        longitude: data.longitude,
        source: 'ip',
        accuracy: data.city
      });
    } catch (error) {
      reject(new Error('Nu am putut determina locația prin IP.'));
    }
  };

  if (!navigator.geolocation) {
    console.warn('Geolocația nu este suportată de browser. Se folosește fallback-ul IP.');
    return fallbackToIp();
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude ,data} = position.coords;
      resolve({
        latitude,
        longitude,
        source: 'gps',
        accuracy: 'precise'
      });
    },
    (error) => {
      console.warn(error.message);
      fallbackToIp();
    },
    {
      timeout: 5000,
      enableHighAccuracy: true,
      maximumAge: 0
    }
  );
});