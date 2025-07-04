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
elements.recentObject.setAttribute("id", "recentLocation")
elements.recentObject.style.cssText=`
display: inline-block;
background-color: rgba(70, 70, 70, 0.5);
margin: 0.6em;
border-radius: 10px;
padding: 5px;
font-size: 20px;
`

// //

export const renderHistory = (historyItems) => {
  if (historyItems.length === 0) {
    logger.info("Nu ai căutări recente!");
    return;
  }
  Array.from(elements.AfterMesage.children).forEach(child => {
    if (child.id !== "mesage") {
      elements.AfterMesage.removeChild(child);
    }
  });

  const tableData = [];

  historyItems.forEach(x => {
    const getTimeAgo = (timestamp) => {
      const now = Date.now();
      const diff = now - timestamp;
      const sec = (diff / 1000).toFixed(0);
      const min = (sec / 60).toFixed(0);
      const hour = (min / 60).toFixed(0);
      const days = (hour / 24).toFixed(0);

      if (sec < 60) return `${sec} secunde în urmă`;
      if (min < 60) return `${min} minute în urmă`;
      if (hour < 24) return `${hour} ore în urmă`;
      return `${days} zile în urmă`;
    };

    const time = getTimeAgo(x.timestamp);
    const ordinary = {
      "🏢Orașe": x.city,
      "🚩Țări": x.country,
      "⏰Timp": time
    };
    tableData.push(ordinary);

    elements.recentObject.textContent = x.city;
    const clone = elements.recentObject.cloneNode(true);
    elements.AfterMesage.appendChild(clone);
    clone.addEventListener("click", async function () {
        // let count = 0;
        clone.addEventListener("dblclick", async function () {
            if (historyService.getHistory().length===1) {
                return
            }
            console.log("==============");
      await getCurrentWeatherWithFallback(clone.textContent).then((data) => {
        const test = tableData.filter((x) => x !== ordinary);
        test.unshift(ordinary);
        showLoading();
        logger.info('📑Locatie identificata: \n ↪', data);
        hideLoading();
        logger.info('📄Locatia incarcata este:\n', `>${data.name}`);
        historyService.addLocation(data);
        displayWeather(data);
        elements.searchBar.value = data.name;
        logger.info("🔎-Locații recente:", "");
        console.table(test);
        console.log("[HISTORY-LOGS]:\n", logger.getLogs());
      });
      console.log("==============");
        })
      const newDiv = document.createElement("button")
      newDiv.textContent = "[ X ]"
      newDiv.setAttribute("id", "deleteBtn")
      clone.appendChild(newDiv)
      if (clone.childNodes.length>2) {
        clone.lastChild.remove()
    }else if (historyService.getHistory().length===1) {
        newDiv.addEventListener("click", function(){
        logger.warn(`📛Nu poti sa stergi ultima locatie! [${clone.textContent.split("[")[0]}]`,"")
    })
        clone.addEventListener("click",function(){
            try {
                clone.removeChild(newDiv)
            } catch (error) {
                error
            }
        }) 
        return
    }else if (historyService.getHistory().length===2) {
        newDiv.addEventListener("click", async function(){
        historyService.removeLocation(clone.textContent.split("[")[0])
        renderHistory(historyService.getHistory())

        await getCurrentWeatherWithFallback(historyService.getHistory()[0].city).then((data) => {
        const test = tableData.filter((x) => x !== ordinary);
        test.unshift(ordinary);
        showLoading();
        logger.info('📑Locatie identificata (AUTO): \n ↪', data);
        hideLoading();
        logger.info('📄Locatia incarcata este (AUTO):\n', `>${data.name}`);
        displayWeather(data);
        elements.searchBar.value = data.name;
        logger.info("🔎-Locații recente:", "");
        console.table(test);
        console.log("[HISTORY-LOGS]:\n", logger.getLogs());
      });
    })
        clone.addEventListener("click",function(){
            try {
                clone.removeChild(newDiv)
            } catch (error) {
                error
            } 
    })
    }else{
      newDiv.addEventListener("click", function(){
        historyService.removeLocation(clone.textContent.split("[")[0])
        renderHistory(historyService.getHistory())
    })
      clone.addEventListener("click",function(){
            try {
                clone.removeChild(newDiv)
            } catch (error) {
                error
            } 
        }) 
}})
logger.info("🔎-Locații recente:", "");
  console.table(tableData);
})};
//
export function showLoading() {
    elements.loader.style.display = "none"
    logger.info("🔁Detectez locația...", "")
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