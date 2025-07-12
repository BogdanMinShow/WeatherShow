import * as service from './modules/weather-service.js';
import * as ui from './modules/ui-controller.js';
import { logger } from './modules/logger.js';
import { historyService } from './modules/history-service.js';
import {getCoords} from './modules/location-service.js';
import { elements } from './modules/ui-controller.js';
import { CONFIG } from './modules/config.js';
// import { SpeedInsights } from "@vercel/speed-insights/react"
const autoLocate = localStorage.getItem("autolocate");
    if (autoLocate === null) {
        elements.autoLocate.setAttribute("checked", "true");
        localStorage.setItem("autolocate", "true");
    }else{
    if (autoLocate === "true") {
        elements.autoLocate.removeAttribute("unchecked");
        elements.autoLocate.setAttribute("checked", "true");
        localStorage.setItem("autolocate", "true");
    } else {
        elements.autoLocate.removeAttribute("checked");
        elements.autoLocate.setAttribute("unchecked", "true");
        localStorage.setItem("autolocate", "false");
        
    }}
//Incarcarea datelor ByDefault:
export async function defaults() {
  const coords = await getCoords();
  const ByCoords = await service.getWeatherByCoords(coords.latitude, coords.longitude);
  
  console.log("==============")
  const locationSource = coords.source === 'ip' ? '🛜Locație aproximativă bazată pe:\n ●IP' : '🌐Locație aproximativă bazată pe:\n ●GPS';
  logger.info(locationSource, '');

  let data = await service.getCurrentWeatherWithFallback(ByCoords.name).then(async (data)=> data)
    
    ui.showLoading();

    if (data.sys.country === "RO") {
            document.querySelector("html").setAttribute("lang", "ro");
        CONFIG.DEFAULT_LANG = "ro"
        languageBtn.style.marginLeft = "60px";
        languageBtn.textContent = "RO";
        elements.one.textContent = "STAREA-VREMII:"
        elements.two.textContent = "UMIDITATEA-DIN-ATMOSFERA:"
        elements.three.textContent = "PRESIUNEA-ATMOSFERICA:"
        elements.for.textContent = "VANT:"
        elements.five.textContent = "VIZIBILITATE:"
        elements.six.textContent = "RASARIT:"
        elements.seven.textContent = "APUS:"
        }
        if (data.sys.country !== "RO"){
        document.querySelector("html").setAttribute("lang", "en");
        CONFIG.DEFAULT_LANG = "en"
        languageBtn.style.marginLeft = "";
        languageBtn.textContent = "EN";
        elements.one.textContent = "WEATHER:"
        elements.two.textContent = "HUMIDITY:"
        elements.three.textContent = "AIR PRESSURE:"
        elements.for.textContent = "WIND:"
        elements.five.textContent = "VISIBILITY:"
        elements.six.textContent = "SUNRISE:"
        elements.seven.textContent = "SUNRISE:"
        }

        data = await service.getCurrentWeatherWithFallback(ByCoords.name).then(async (data)=> data)

        const tableData = []
    const ordinary = {
      "🏢Orașe": data.name,
      "🚩Țări": data.sys.country,
      "📡Coord": `LAT:${data.coord.lat} - LON:${data.coord.lon}`
    };
    tableData.push(ordinary);

    logger.info('📑Locatie identificata: \n ↪', data);
    logger.info('📄Locatia incarcata este:\n', `>${data.name}`);
    if (historyService.getHistory().length === 1 && historyService.getHistory().includes(data.name)) {
    ui.displayWeather(data);
    console.table(tableData)
    console.log("[HISTORY-LOGS]:\n", logger.getLogs());
    console.log("==============")
    return
    }
    historyService.addLocation(data);
    ui.renderHistory(historyService.getHistory());
    ui.displayWeather(data);
    console.table(tableData)
    console.log("[HISTORY-LOGS]:\n", logger.getLogs());
    console.log("==============")
}

//Functia pentru evenimente:
const setupEventListeners = () => {
  ui.elements.searchBtn.addEventListener("click",function(){
    handleSearch();
    elements.searchBar.value = "";
})
  ui.elements.searchBar.addEventListener("keydown", (x)=>{
    if (x.key==="Enter") {
        handleSearch();
        elements.searchBar.value = ""
    }
  })
//Theme
elements.themeBtn.addEventListener("click", function(){
    if (elements.themeBtn.style.marginLeft==="60px") {
        elements.themeBtn.style.marginLeft=""
        elements.themeBtn.style.transitionDuration= "0.65s"
        elements.themeBtn.textContent="⏾"
    }else if(themeBtn.style.marginLeft===""){
        elements.themeBtn.style.marginLeft="60px"
        elements.themeBtn.style.transitionDuration= "0.65s"
        elements.themeBtn.textContent="𖤓"
    }
    //
    if (elements.themeBtn.style.marginLeft==="60px") {
        localStorage.setItem("theme", "background-image: url('wheather-animation.gif'); background-repeat:repeat;")
        document.querySelector("body").style.cssText= localStorage.getItem("theme")
    }else if(elements.themeBtn.style.marginLeft===""){
        localStorage.setItem("theme", "background-image: url('unicorn_night_animated.gif'); background-repeat:repeat; background-size: cover;")
        document.querySelector("body").style.cssText= localStorage.getItem("theme")
    }
})
  //Language
  elements.languageBtn.addEventListener("click", function(){
    if (elements.languageBtn.style.marginLeft==="60px") {
        elements.languageBtn.style.marginLeft= ""
        elements.languageBtn.style.transitionDuration= "0.65s"
        elements.languageBtn.textContent="EN"
    }else if(elements.languageBtn.style.marginLeft===""){
        elements.languageBtn.style.marginLeft= "60px"
        elements.languageBtn.style.transitionDuration= "0.65s";
        elements.languageBtn.textContent="RO"
    }
    //
    if (elements.languageBtn.style.marginLeft==="60px") {
        document.querySelector("html").removeAttribute("lang")
        localStorage.setItem("region", "ro")
        document.querySelector("html").setAttribute("lang", `${localStorage.getItem("region")}`)
        CONFIG.DEFAULT_LANG = localStorage.getItem("region")
        service.getCurrentWeather(elements.locationName.textContent).then((data)=>{
            ui.displayWeather(data)
        })
        elements.one.textContent = "STAREA-VREMII:"
        elements.two.textContent = "UMIDITATEA:"
        elements.three.textContent = "PRESIUNEA-ATMOSFERICA:"
        elements.for.textContent = "VANT:"
        elements.five.textContent = "VIZIBILITATE:"
        elements.six.textContent = "RASARIT:"
        elements.seven.textContent = "APUS:"
        return
    }else if(elements.languageBtn.style.marginLeft===""){
        document.querySelector("html").removeAttribute("lang")
        localStorage.setItem("region", "en")
        document.querySelector("html").setAttribute("lang", `${localStorage.getItem("region")}`)
        CONFIG.DEFAULT_LANG = localStorage.getItem("region")
        service.getCurrentWeather(elements.locationName.textContent).then((data)=>{
            ui.displayWeather(data)
        })
        elements.one.textContent = "WEATHER:"
        elements.two.textContent = "HUMIDITY:"
        elements.three.textContent = "AIR PRESSURE:"
        elements.for.textContent = "WIND:"
        elements.five.textContent = "VISIBILITY:"
        elements.six.textContent = "SUNRISE:"
        elements.seven.textContent = "SUNRISE:"
        return
    }
})
//Units
elements.unitsBtn.addEventListener("click", function(){
    if (elements.unitsBtn.style.marginLeft==="60px") {
        elements.unitsBtn.style.marginLeft= ""
        elements.unitsBtn.style.transitionDuration= "0.65s"
        elements.unitsBtn.textContent="°F"
    }else if(elements.unitsBtn.style.marginLeft===""){
        elements.unitsBtn.style.marginLeft= "60px"
        elements.unitsBtn.style.transitionDuration= "0.65s";
        elements.unitsBtn.textContent="°C"
    }
    //
    if (elements.unitsBtn.style.marginLeft==="60px") {
        localStorage.setItem("unite", "metric")
        CONFIG.DEFAULT_UNITS = localStorage.getItem("unite")
        service.getCurrentWeather(elements.locationName.textContent).then((data)=>{
            ui.displayWeather(data)
        })
    }
    else if(elements.unitsBtn.style.marginLeft===""){
        localStorage.setItem("unite", "imperial")
        CONFIG.DEFAULT_UNITS = localStorage.getItem("unite")
        service.getCurrentWeather(elements.locationName.textContent).then((data)=>{
            ui.displayWeather(data)
        })
    }
    return
})
// SETTINGS
elements.settingsBtn.addEventListener("click", function(){
    const btn = elements.btnContainer;
    const isHidden = !btn.classList.contains("show");
    if (isHidden) {
        btn.style.display = "block";
        void btn.offsetWidth;
        btn.classList.add("show");

        elements.settingsBtn.style.cssText = `
            background-color: rgb(78, 215, 241);
            border: solid;
            border-left-style: none;
            margin-left:-0.5em;
            scale: 0.8;
            border-radius: 20px;
            border-top-left-radius: 0px;
            border-bottom-left-radius: 0px;
            transition: 0.6s;
        `;
    } else {
        btn.classList.remove("show");
        setTimeout(() => {
            btn.style.display = "none";
        }, 300);

        elements.settingsBtn.style.cssText = "transition: 1s;";
    }
})
elements.autoLocate.addEventListener("click", function () {
    const isChecked = elements.autoLocate.hasAttribute("checked");

    if (isChecked) {
        elements.autoLocate.removeAttribute("checked");
        elements.autoLocate.setAttribute("unchecked", "true");
        localStorage.setItem("autolocate", "false");
    } else {
        elements.autoLocate.setAttribute("checked", "true");
        elements.autoLocate.removeAttribute("unchecked");
        localStorage.setItem("autolocate", "true");
    }
});
}

//Functie de initializare a datelor din LocalStorage:
function initializeSettings() {
    //
    ui.renderHistory(historyService.getHistory())
    // THEME
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "background-image: url('unicorn_night_animated.gif'); background-repeat:repeat; background-size: cover;") {
        document.querySelector("body").style.cssText = savedTheme;
        themeBtn.style.marginLeft = "";
        themeBtn.textContent = "⏾";
    } else {
        document.querySelector("body").style.cssText = savedTheme;
        themeBtn.style.marginLeft = "60px";
        themeBtn.textContent = "𖤓";
    }
    // LANGUAGE
    const savedLanguage = localStorage.getItem("region");
    if (savedLanguage === null) {
        languageBtn.style.marginLeft = "60px";
        languageBtn.textContent = "RO";
        elements.one.textContent = "STAREA-VREMII:"
        elements.two.textContent = "UMIDITATEA:"
        elements.three.textContent = "PRESIUNEA-ATMOSFERICA:"
        elements.for.textContent = "VANT:"
        elements.five.textContent = "VIZIBILITATE:"
        elements.six.textContent = "RASARIT:"
        elements.seven.textContent = "APUS:"
    }else{
        if (savedLanguage === "ro") {
        document.querySelector("html").setAttribute("lang", "ro");
        CONFIG.DEFAULT_LANG = savedLanguage
        languageBtn.style.marginLeft = "60px";
        languageBtn.textContent = "RO";
        elements.one.textContent = "STAREA-VREMII:"
        elements.two.textContent = "UMIDITATEA-DIN-ATMOSFERA:"
        elements.three.textContent = "PRESIUNEA-ATMOSFERICA:"
        elements.for.textContent = "VANT:"
        elements.five.textContent = "VIZIBILITATE:"
        elements.six.textContent = "RASARIT:"
        elements.seven.textContent = "APUS:"
    }else{
        document.querySelector("html").setAttribute("lang", "en");
        CONFIG.DEFAULT_LANG = savedLanguage
        languageBtn.style.marginLeft = "";
        languageBtn.textContent = "EN";
        elements.one.textContent = "WEATHER:"
        elements.two.textContent = "HUMIDITY:"
        elements.three.textContent = "AIR PRESSURE:"
        elements.for.textContent = "WIND:"
        elements.five.textContent = "VISIBILITY:"
        elements.six.textContent = "SUNRISE:"
        elements.seven.textContent = "SUNRISE:"
    }}
    // UNITE
    const savedUnite = localStorage.getItem("unite")
    if (savedUnite===null) {
        elements.unitsBtn.style.marginLeft= "60px"
        elements.unitsBtn.textContent="°C"
        return
    }else{
        if (savedUnite === "metric") {
        CONFIG.DEFAULT_UNITS = savedUnite
        elements.unitsBtn.style.marginLeft= "60px"
        elements.unitsBtn.textContent="°C"
    }else{
        CONFIG.DEFAULT_UNITS = savedUnite
        elements.unitsBtn.style.marginLeft= ""
        elements.unitsBtn.textContent="°F"
    }}
    // AUTO-LOCATE
    
    }
// Functia de search:
const handleSearch = async () => {
    try {
        console.log("==============")
        ui.showLoading()

        const inputValue = ui.elements.searchBar.value.trim()

         if (!isValidCity(inputValue)) {
            elements.toShort.style.display = "block"
            setTimeout(() => {
                elements.toShort.style.display = ""
                ui.elements.searchBar.value = ""
            }, 2000)
            logger.error("Orasul nu poate avea mai putin de 3 litere!", "")
            return
        }

        let cityQuery = inputValue.toLowerCase() === "bucuresti" ? "București" : inputValue
        let weatherService = await service.getCurrentWeatherWithFallback(cityQuery)

        if (!weatherService || !weatherService.name) {
            elements.notFoundLocation.style.display = "block"
            setTimeout(() => {
                elements.notFoundLocation.style.display = ""
                ui.elements.searchBar.value = ""
            }, 2000)
            throw new Error(`Nu s-au găsit date pentru: "${inputValue}"`)
        }
        // if (historyService.getHistory()[0].country === "RO") (TEST FUNCTIONAL)
        if (weatherService.sys.country === "RO") {
        document.querySelector("html").setAttribute("lang", "ro");
        CONFIG.DEFAULT_LANG = "ro"
        languageBtn.style.marginLeft = "60px";
        languageBtn.textContent = "RO";
        elements.one.textContent = "STAREA-VREMII:"
        elements.two.textContent = "UMIDITATEA-DIN-ATMOSFERA:"
        elements.three.textContent = "PRESIUNEA-ATMOSFERICA:"
        elements.for.textContent = "VANT:"
        elements.five.textContent = "VIZIBILITATE:"
        elements.six.textContent = "RASARIT:"
        elements.seven.textContent = "APUS:"
        }else{
        document.querySelector("html").setAttribute("lang", "en");
        CONFIG.DEFAULT_LANG = "en"
        languageBtn.style.marginLeft = "";
        languageBtn.textContent = "EN";
        elements.one.textContent = "WEATHER:"
        elements.two.textContent = "HUMIDITY:"
        elements.three.textContent = "AIR PRESSURE:"
        elements.for.textContent = "WIND:"
        elements.five.textContent = "VISIBILITY:"
        elements.six.textContent = "SUNRISE:"
        elements.seven.textContent = "SUNRISE:"
        }

        weatherService = await service.getCurrentWeatherWithFallback(cityQuery)

        logger.info('📄Locatia incarcata este:\n', `>${weatherService.name}`)
        ui.hideLoading()


        const history = historyService.getHistory()
        const exists = history.find(item => item.city === weatherService.name)

        if (exists) {
            historyService.moveToTop(weatherService.name)
        } else {
            historyService.addLocation(weatherService)
        }

        ui.renderHistory(historyService.getHistory())
        ui.displayWeather(weatherService)
        logger.info('📑Locatie identificata: \n ↪', weatherService)

        const tableData = [];

        historyService.getHistory().forEach(x=> {
            const getTimeAgo = (timestamp) => {
      const now = Date.now();
      const diff = now - timestamp;
      const sec = Math.floor(diff / 1000);
      const min = Math.floor(sec / 60);
      const hour = Math.floor(min / 60);
      const days = Math.floor(hour / 24);

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
        });

        console.table(tableData)

        console.log("[HISTORY-LOGS]:\n", logger.getLogs())
        console.log("==============")

    } catch (err) {
        logger.error(err.message,"")
    }
}
//
export const isValidCity = (city) => {
  return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(city.trim());
}
//
if (elements.autoLocate.hasAttribute("checked")===true) {
    defaults()
}else{
if (historyService.getHistory().length>0) {
    elements.searchBar.value = historyService.getHistory()[0].city
    handleSearch()
}else{
    defaults()
}}

//Functie de initializare a datelor din LocalStorage:
await initializeSettings()
//Functia de lansare a EventListeners-urilor:
setupEventListeners()