export const getCoords = () => new Promise(async (resolve, reject) => {
  // Funcția de fallback — când geolocația eșuează
  const fallbackToIp = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      function animation(){
        setTimeout(() => {
          console.log("Informatii IP se incarca...")
        }, 250);
        setTimeout(() => {
          console.log("Se iau informatii din ORAS...")
        }, 500);
        setTimeout(() => {
          console.log("●IP-ul este:\n", ` ►${data.ip}`)
          console.log("●Orasul este:\n", ` ►${data.city}`)
          console.log("●Judetul este:\n", ` ►${data.region}`)
        }, 1000);
      }
      animation() // Verifică structura în consola browserului

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
      const { latitude, longitude } = position.coords;
      resolve({
        latitude,
        longitude,
        source: 'gps',
        accuracy: 'precise'
      });
    },
    (error) => {
      console.warn('Geolocația a eșuat:', error.message);
      fallbackToIp();
    },
    {
      timeout: 5000,
      enableHighAccuracy: true,
      maximumAge: 0
    }
  );
});