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
  theme: document.querySelector("#theme"),
  language: document.querySelector("#language"),
  themeBtn: document.querySelector("#themeBtn"),
  languageBtn: document.querySelector("#languageBtn"),
  unitsBtn: document.querySelector("#unitsBtn"),
  WeatherImg: document.querySelector("#WeatherImg"),
  one: document.querySelector("#one"),
  two: document.querySelector("#two"),
  three: document.querySelector("#three"),
  for: document.querySelector("#for"),
  five: document.querySelector("#five"),
  six: document.querySelector("#six"),
  seven: document.querySelector("#seven"),
  loader: document.querySelector("#loader")
  // ... restul elementelor
}
elements.themeBtn.style.marginLeft = "60px"
elements.unitsBtn.style.marginLeft = "60px"
elements.languageBtn.style.marginLeft = "60px"

export function showLoading() {
    elements.loader.style.display = "none"
    console.log("Detectez locația...")
}

export function hideLoading() {
    elements.loader.style.display = ""
}

export function showError(message) {
    console.error(`${message}`)
}

export function showMessage(text){
    return text
}
//


export const displayWeather = (weatherData) => {
    if (weatherData) {
        const accesKey = weatherData
    elements.locationName.textContent=accesKey.name.toUpperCase()
        const celsiusTemp = accesKey.main.temp
        if (elements.unitsBtn.textContent === "°C") {
            if (celsiusTemp>35) {
                elements.WeatherImg.setAttribute("container","🌞")
            }
            if (celsiusTemp<35) {
                elements.WeatherImg.setAttribute("container","🌤️")
            }
            if (celsiusTemp<20) {
                elements.WeatherImg.setAttribute("container","⛅")
            }
            if (celsiusTemp<10) {
                elements.WeatherImg.setAttribute("container","🌥️")
            }
            if (celsiusTemp<0) {
                elements.WeatherImg.setAttribute("container","☁️")
            }
        }else if (elements.unitsBtn.textContent === "°F") {
            if (celsiusTemp>95) {
                elements.WeatherImg.setAttribute("container","🌞")
            }
            if (celsiusTemp<95) {
                elements.WeatherImg.setAttribute("container","🌤️")
            }
            if (celsiusTemp<68) {
                elements.WeatherImg.setAttribute("container","⛅")
            }
            if (celsiusTemp<50) {
                elements.WeatherImg.setAttribute("container","🌥️")
            }
            if (celsiusTemp<32) {
                elements.WeatherImg.setAttribute("container","☁️")
            }
        }
        elements.temp.setAttribute("data-unit",celsiusTemp.toFixed(1) + elements.unitsBtn.textContent) 
    elements.tempCaracter.textContent=accesKey.weather[0].description.toUpperCase()
    elements.Umidity.textContent=accesKey.main.humidity + " %"
    elements.pressureAtm.textContent=accesKey.main.pressure + " hPa"
    if (elements.unitsBtn.textContent==="°C") {
        elements.wind.textContent = accesKey.wind.speed + " Km/H"
    }else if (elements.unitsBtn.textContent==="°F") {
        elements.wind.textContent = accesKey.wind.speed + " m/s"
    }
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
}
//
