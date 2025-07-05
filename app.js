import * as service from './modules/weather-service.js';
import * as ui from './modules/ui-controller.js';
import { logger } from './modules/logger.js';
import { historyService } from './modules/history-service.js';
import {getCoords} from './modules/location-service.js';
import { elements } from './modules/ui-controller.js';
import { CONFIG } from './modules/config.js';
//Incarcarea datelor ByDefault:
async function defaults() {
  const coords = await getCoords();
  const ByCoords = await service.getWeatherByCoords(coords.latitude, coords.longitude);

  
  console.log("==============")
  const locationSource = coords.source === 'ip' ? '🛜Locație aproximativă bazată pe:\n ●IP' : '🌐Locație aproximativă bazată pe:\n ●GPS';
  logger.info(locationSource, '');

  await service.getCurrentWeatherWithFallback(ByCoords.name).then(async function (data) {
    const tableData = []
    const ordinary = {
      "🏢Orașe": data.name,
      "🚩Țări": data.sys.country,
    };
    tableData.push(ordinary);

    ui.showLoading();

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
  });
}

//Functia pentru evenimente:
const setupEventListeners = () => {
  ui.elements.searchBtn.addEventListener("click",handleSearch)
  ui.elements.searchBar.addEventListener("keydown", (x)=>{
    if (x.key==="Enter") {
        handleSearch();
    }
  })
//theme
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
  //language
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
        elements.two.textContent = "UMIDITATEA-DIN-ATMOSFERA:"
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
//units
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
}

//Functie de initializare a datelor din LocalStorage:
function initializeSettings() {
    //
    ui.renderHistory(historyService.getHistory())
    //
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
    const savedLanguage = localStorage.getItem("region");
    if (savedLanguage === null) {
        localStorage.setItem("region", "ro")
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
    }
    }
    
    const savedUnite = localStorage.getItem("unite")
    if (localStorage.getItem("unite")===null) {
        localStorage.setItem("unite", "metric")
        elements.unitsBtn.style.marginLeft= "60px"
        elements.unitsBtn.textContent="°C"
        return
    }else if(localStorage.getItem("unite")!==null){
        if (savedUnite === "metric") {
        CONFIG.DEFAULT_UNITS = savedUnite
        elements.unitsBtn.style.marginLeft= "60px"
        elements.unitsBtn.textContent="°C"
    }else{
        CONFIG.DEFAULT_UNITS = savedUnite
        elements.unitsBtn.style.marginLeft= ""
        elements.unitsBtn.textContent="°F"
    }
    return
    }
    
    return
}
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
        const weatherService = await service.getCurrentWeatherWithFallback(cityQuery)

        if (!weatherService || !weatherService.name) {
            elements.notFoundLocation.style.display = "block"
            setTimeout(() => {
                elements.notFoundLocation.style.display = ""
                ui.elements.searchBar.value = ""
            }, 2000)
            throw new Error(`Nu s-au găsit date pentru: "${inputValue}"`)
        }

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

        console.log("[HISTORY-LOGS]:\n", logger.getLogs())
        console.log("==============")

    } catch (err) {
        ui.showError(err.message)
    }
}
//
export const isValidCity = (city) => {
  return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(city.trim());
}
//
export const ByDefault = defaults()
//Functie de initializare a datelor din LocalStorage:
initializeSettings()
//
setupEventListeners()
//