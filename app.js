import * as service from './modules/weather-service.js';
import * as ui from './modules/ui-controller.js';
import { logger } from './modules/logger.js';
import { historyService } from './modules/history-service.js';
import {getCoords} from './modules/location-service.js';
import { elements } from './modules/ui-controller.js';
import { CONFIG } from './modules/config.js';
//Functie de initializare a datelor din LocalStorage:
//

//
// import('./modules/config.js').then((config) => {
//   console.log('Config updated:', config.CONFIG)
//   console.log('Max history:', config.CONFIG.MAX_HISTORY_ITEMS)
// })
//
// window.logs.show() // Afișează toate log-urile stocate
// window.logs.clear() // Șterge log-urile din memorie
// window.logs.get() // Obține array-ul de log-uri pentru procesare
// //
// import('./modules/logger.js').then(({ logger }) => {
//   logger.info('Logger test started')
//   logger.debug('Debug message', { test: true })
//   logger.warn('Warning message')
//   logger.error('Error message', new Error('Test error'))

//   console.log('All logs:', logger.getLogs())
// })
//

// import('./modules/history-service.js').then(({ historyService }) => {
//   // Test salvare
//   const mockWeatherData = {
//     name: 'Cluj-Napoca',
//     sys: { country: 'RO' },
//     coord: { lat: 46.77, lon: 23.6 },
//   }

// //   historyService.addLocation(mockWeatherData)
// //   console.log('History after add:', historyService.getHistory())
// //   historyService.clearHistory()
// //   console.log('History after remove:', historyService.getHistory())
//   // Verifică în localStorage
//   console.log('In storage:', localStorage.getItem('weather_search_history'))
// })



//Incarcarea datelor ByDefault:
async function defaults() {
  ui.showLoading()
  const coords = await getCoords()
  if (coords.source === 'ip') {
  logger.warn('Locație aproximativă bazată pe:\n ●IP','')
    service.getWeatherByCoords(coords.latitude, coords.longitude).then((data) => {
        logger.warn('Locatie identificata \n ↪', data)
        logger.info('Locatia incarcata este:\n', `>${data.name}`)
        historyService.addLocation(data)

        // console.log('In storage:', localStorage.getItem(CONFIG.STORAGE_KEYS.SEARCH_HISTORY))
    ui.displayWeather(data)
    return
    })}else{
  logger.warn('Locație aproximativă bazată pe:\n ●GPS','')
    service.getCurrentWeatherWithFallback("Anina").then((data) => {
        logger.warn('Locatie identificata \n ↪', data)
        logger.info('Locatia incarcata este:\n', `>${data.name}`)
        historyService.addLocation(data)

        // console.log('In storage:', localStorage.getItem(CONFIG.STORAGE_KEYS.SEARCH_HISTORY))
    ui.displayWeather(data)
    return
    })} 
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
        // inversul animației: ascundere cu întârziere
        btn.classList.remove("show");
        setTimeout(() => {
            btn.style.display = "none";
        }, 300); // trebuie să fie egal cu timpul din `transition`

        elements.settingsBtn.style.cssText = "transition: 1s;";
    }
})
}

//Functie de initializare a datelor din LocalStorage:
function initializeSettings() {
    ui.renderHistory(historyService.getHistory())
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
    } else {
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
    const savedUnite = localStorage.getItem("unite")
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
const handleSearch = async () => { 
    console.log("==============")
    ui.showLoading()
    if (!isValidCity(ui.elements.searchBar.value)) {
        elements.toShort.style.display = "block"
        setTimeout(() => {
            elements.toShort.style.display = ""
            elements.searchBar.value = ""
        }, 2000);
        ui.showError("Orasul nu poate avea mai putin de 3 litere!")
        return
    }
    try{
    const test = historyService.getHistory()
    if (ui.elements.searchBar.value === "bucuresti" || ui.elements.searchBar.value === "Bucuresti") {
        const weatherService = await service.getCurrentWeatherWithFallback("București")
    logger.info("Locatia incarcata este:\n >",weatherService.name)
    ui.hideLoading()
    historyService.addLocation(weatherService)
    
    const newLocation = [{city: weatherService.name, country: weatherService.sys.country, coord: weatherService.coord, timestamp: Date.now()}]
    // console.log('In storage:', localStorage.getItem(CONFIG.STORAGE_KEYS.SEARCH_HISTORY))
    logger.info("Locatie identificata \n ↪",weatherService)
    ui.renderHistory(newLocation)
    ui.displayWeather(weatherService)
    console.log("==============")
    return
    }else{
    const weatherService = await service.getCurrentWeatherWithFallback(ui.elements.searchBar.value)
    if (weatherService.name === undefined) {
        elements.notFoundLocation.style.display = "block"
        setTimeout(() => {
            elements.notFoundLocation.style.display = ""
            elements.searchBar.value = ""
        }, 2000);
        throw new Error(`Nu s-au gasit date pentru: "${ui.elements.searchBar.value}"`)
    }
    logger.info("Locatia incarcata este:\n >",weatherService.name)
    ui.hideLoading()
    historyService.addLocation(weatherService)
    const resolve = test.find(x=>x.city === weatherService.name)
if (resolve && resolve.city === weatherService.name) {
    logger.info("Locatie identificata \n ↪", weatherService)
    ui.displayWeather(weatherService)
    console.log("==============")
    return
}else if (resolve === undefined){
    const newLocation = [{city: weatherService.name, country: weatherService.sys.country, coord: weatherService.coord, timestamp: Date.now()}]
    logger.info("Locatie identificata \n ↪",weatherService)
    ui.renderHistory(newLocation)
    ui.displayWeather(weatherService)
    console.log("==============")
    return
    }}}catch (err){
            ui.showError(err.message)
    }
}
//
export const isValidCity = (city) => {
  return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(city.trim());
}
//
export const ByDefault = defaults()
//
initializeSettings()
setupEventListeners()
//