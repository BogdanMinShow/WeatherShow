import { historyService } from './history-service.js'
import { logger } from './logger.js'
import {getCurrentWeatherWithFallback} from './weather-service.js'
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
  loader: document.querySelector("#loader"),
  btnContainer: document.querySelector("#BtnContainer"),
  settingsBtn: document.querySelector("#setting"),
  notFoundLocation: document.querySelector("#notFoundLocation"),
  toShort: document.querySelector("#toShort"),
  AfterMesage: document.querySelector("#recentSearch"),
  recentObject: document.createElement("button"),
  searchH: document.querySelector("#searchH")
  // ... restul elementelor
}
// RECENT-OBJEXT.STYLES: //
elements.recentObject.style.cssText=`
display: inline-block;
background-color: rgb(70, 70, 70);
margin: 1%;
border-radius: 10px;
padding: 10px;
font-size: 20px;
margin-top: 2%;
`

// //

export const renderHistory = (historyItems) => {
     if (historyItems.length === 0) {
     console.log("Nu ai cautari recente!")
    return
  }
    // Construiește HTML pentru fiecare item din istoric
    const tableData = [];
  historyItems.forEach(x => {
    const getTimeAgo = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  const sec = (diff / 10000).toFixed(2)
  const min = (sec / 60).toFixed(2)
  const hour = (min / 60).toFixed(2)
  const days = (hour / 24).toFixed(2)

  if (sec < 60) return `${sec} secunde in urmă`
  if (min < 60) return `${min} minute în urmă`
  if (hour < 24) return `${hour} minute în urmă`
  if (hour > 24) return `${days} minute în urmă`

  // Afișează orașul, țara și timpul relativ (ex: "2 ore în urmă")
}

    const time = getTimeAgo(x.timestamp);
    tableData.push({
      "Orașe": x.city,
      "Țari": x.country,
      "Timp": time
    });

    elements.recentObject.textContent = x.city
    const clone = elements.recentObject.cloneNode(true)
    elements.AfterMesage.appendChild(clone)
    // Fiecare item ar trebui să fie clickabil
    clone.addEventListener("click", async function(){
        console.log("==============")
        // showLoading()
        logger.info("Detectez locația...", "")
        await getCurrentWeatherWithFallback(clone.textContent).then((data)=>{
            historyService.addLocation(data)
            logger.info("Locatia incarcata este:\n >",data.name)
            hideLoading()
            logger.warn("Locatie identificata \n ↪", data)
            displayWeather(data)
            elements.searchBar.value = data.name
            console.table(tableData)
        })
        console.log("==============")
  })
  });
  console.table(tableData);
  }
//
export function showLoading() {
    elements.loader.style.display = "none"
    console.log("Detectez locația...")
}
//
export function hideLoading() {
    elements.loader.style.display = ""
}
//
export function showError(message) {
    console.error(`${message}`)
}
//
export function showMessage(text){
    return text
}
// //

//Ilustrare grafica:
export const displayWeather = (weatherData) => {
    if (weatherData) {
        // elements.AfterMesage.appendChild(elements.recentObject)
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
        elements.wind.textContent = accesKey.wind.speed + " m/s"
    }else if (elements.unitsBtn.textContent==="°F") {
        const newWindUnit = accesKey.wind.speed * 1.609344
        elements.wind.textContent = newWindUnit.toFixed(2) + " Km/h"
    }
    elements.vizibility.textContent=accesKey.visibility/1000 +"Km"
    const sunriseTime = new Date(accesKey.sys.sunrise * 1000);
    const sunsetTime = new Date(accesKey.sys.sunset * 1000);
//
    elements.sunrise.textContent = sunriseTime.toLocaleTimeString([], {
     hour: '2-digit',
     minute: '2-digit'
    });
//
    elements.sunset.textContent = sunsetTime.toLocaleTimeString([], {
     hour: '2-digit',
     minute: '2-digit'
    });
    }
}