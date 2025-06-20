export const elements = {
  searchBar: document.querySelector("#searchBar"),
  searchBtn: document.querySelector("#searchBtn"),
  locationName: document.querySelector("#location"),
  temp: document.querySelector("#temp"),
  tempCaracter: document.querySelector("#tempCaracter"),
  Umidity: document.querySelector("#Umidity"),
  pressureAtm: document.querySelector("#pressureAtm"),
  wind: document.querySelector("#wind"),
  vizibility: document.querySelector("#vizibility"),
  sunrise: document.querySelector("#sunrise"),
  sunset: document.querySelector("#sunset"),
  // ... restul elementelor
}
export function showLoading() {
    console.log("Se incarca locatia...")
}

export function hideLoading() {
}

export function showError(message) {
    console.error(`${message}`)
}
//


export const displayWeather = (weatherData) => {
    if (weatherData) {
        const accesKey = weatherData.main
    elements.locationName.textContent=accesKey.name.toUpperCase()
        const celsiusTemp = accesKey.main.temp -  273.15
        elements.temp.setAttribute("data-unit",celsiusTemp.toFixed(1) +" °C") 
    elements.tempCaracter.textContent=accesKey.main.feels_like
    elements.Umidity.textContent=accesKey.main.humidity + " %"
    elements.pressureAtm.textContent=accesKey.main.pressure + " hPa"
    elements.wind.textContent = accesKey.wind.speed + " Km/H"
    elements.vizibility.textContent=accesKey.visibility/1000 +"Km"
    const sunriseTime = new Date(accesKey.sys.sunrise * 1000);
    const sunsetTime = new Date(accesKey.sys.sunset * 1000);

    elements.sunrise.textContent = sunriseTime.toLocaleTimeString([], {
     hour: '2-digit',
     minute: '2-digit'
    });

    elements.sunset.textContent = sunsetTime.toLocaleTimeString([], {
     hour: '2-digit',
     minute: '2-digit'
    });
    }
    
    console.log()
}
//
