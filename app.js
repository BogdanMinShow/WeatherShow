import * as service from './modules/weather-service.js';
import * as ui from './modules/ui-controller.js';
import {getCoords} from './modules/location-service.js';
import { elements } from './modules/ui-controller.js';
import { CONFIG } from './modules/config.js';
//Functie de initializare a datelor din LocalStorage:
initializeSettings()
//Incarcarea datelor ByDefault:
async function defaults() {
  ui.showLoading()
  const coords = await getCoords()
  if (coords.source === 'ip') {
  console.log('Locație aproximativă bazată pe:\n ●IP')
    service.getWeatherByCoords(coords.latitude, coords.longitude).then((data) => {
        console.log('Locatie identificata \n ↪', data)
        console.log('Locatia incarcata este:\n', `>${data.name}`)
    ui.displayWeather(data)
    })}else{
  console.log('Locație aproximativă bazată pe:\n ●GPS')
    service.getCurrentWeather("Anina").then((data) => {
        console.log('Locatie identificata \n ↪', data)
        console.log('Locatia incarcata este:\n', `>${data.name}`)
    ui.displayWeather(data)
    })}
    return
}
//Functia pentru evenimente:
const setupEventListeners = () => {
  ui.elements.searchBtn.addEventListener("click",handleSearch)
  ui.elements.searchBar.addEventListener("keydown", (x)=>{
    if (x.key==="Enter") {
        handleSearch();
    }
  })
  //language
  elements.languageBtn.addEventListener("click", function(){
    if (elements.languageBtn.style.marginLeft==="60px") {
        elements.languageBtn.style.marginLeft= "-60px"
        elements.languageBtn.style.transitionDuration= "0.65s"
        elements.languageBtn.textContent="EN"
    }else if(elements.languageBtn.style.marginLeft==="-60px"){
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
    }else if(elements.languageBtn.style.marginLeft==="-60px"){
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
//theme
elements.themeBtn.addEventListener("click", function(){
    if (elements.themeBtn.style.marginLeft==="60px") {
        elements.themeBtn.style.marginLeft="-60px"
        elements.themeBtn.style.transitionDuration= "0.65s"
        elements.themeBtn.textContent="⏾"
    }else if(themeBtn.style.marginLeft==="-60px"){
        elements.themeBtn.style.marginLeft="60px"
        elements.themeBtn.style.transitionDuration= "0.65s"
        elements.themeBtn.textContent="𖤓"
    }
    //
    if (elements.themeBtn.style.marginLeft==="60px") {
        localStorage.setItem("theme", "")
        document.querySelector("body").style.backgroundColor= localStorage.getItem("theme")
    }else if(elements.themeBtn.style.marginLeft==="-60px"){
        localStorage.setItem("theme", "rgb(34, 40, 49)")
        document.querySelector("body").style.backgroundColor= localStorage.getItem("theme")
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
}
//Functie de initializare a datelor din LocalStorage:
function initializeSettings() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "rgb(34, 40, 49)") {
        document.querySelector("body").style.backgroundColor = savedTheme;
        themeBtn.style.marginLeft = "-60px";
        themeBtn.textContent = "⏾";
    } else {
        document.querySelector("body").style.backgroundColor = savedTheme;
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
        languageBtn.style.marginLeft = "-60px";
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
        elements.unitsBtn.style.transitionDuration= "0.65s";
        elements.unitsBtn.textContent="°C"
    }else{
        CONFIG.DEFAULT_UNITS = savedUnite
        elements.unitsBtn.style.marginLeft= ""
        elements.unitsBtn.style.transitionDuration= "0.65s"
        elements.unitsBtn.textContent="°F"
    }
    return
}
const handleSearch = async () => {
    console.log("=========================================")
    ui.showLoading()
    if (!isValidCity(ui.elements.searchBar.value)) {
        ui.showError("Nu s-au gasit date pentru acest oras")
        return
    }
    try{
    if (ui.elements.searchBar.value === "bucuresti" || ui.elements.searchBar.value === "Bucuresti") {
        const weatherService = await service.getCurrentWeatherWithFallback("București")
    console.log("Locatia incarcata este:\n >",weatherService.name)
    ui.hideLoading()
    console.log("Locatie identificata \n ↪",weatherService)
    ui.displayWeather(weatherService)
    console.log("=========================================")
    return
    }else{
    const weatherService = await service.getCurrentWeatherWithFallback(ui.elements.searchBar.value)
    if (weatherService.name === undefined) {
        throw new Error(`Nu s-au gasit date pentru: "${ui.elements.searchBar.value}"`)
    }
    console.log("Locatia incarcata este:\n >",weatherService.name)
    ui.hideLoading()
    console.log("Locatie identificata \n ↪",weatherService)
    ui.displayWeather(weatherService)
    console.log("=========================================")
    return
    }}catch (err){
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
setupEventListeners()
//