import * as service from './modules/weather-service.js';
import * as ui from './modules/ui-controller.js';
import {getCoords} from './modules/location-service.js';
import { elements } from './modules/ui-controller.js';

async function defaults() {
  ui.showLoading()
  const coords = await getCoords()
  if (coords.source === 'ip') {
      ui.showMessage('Locație aproximativă bazată pe IP', 'warning')
    }
  ui.showMessage('Locație aproximativă bazată pe GPS', 'warning')
    service.getCurrentWeather("Anina").then((data) => {
        console.log('Received data:', data)
        console.log('City updated?', data.name === "Anina")
        const elements = ui.elements
    // console.log('Elements incarcate in DOM:', Object.keys(elements))
    ui.displayWeather(data)
    
    // ui.showError("ERROR:\n >Daca va fi cazul!")
    })
}
const setupEventListeners = () => {
  ui.elements.searchBtn.addEventListener("click",handleSearch)
  ui.elements.searchBar.addEventListener("keydown", (x)=>{
    if (x.key==="Enter") {
        handleSearch();
    }
  })
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
        
    }else if(elements.languageBtn.style.marginLeft==="-60px"){
        document.querySelector("html").removeAttribute("lang")
        localStorage.setItem("region", "en")
        document.querySelector("html").setAttribute("lang", `${localStorage.getItem("region")}`)
    }
    // console.log(elements.languageBtn.)
})
//Limba (ro/en)
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
        document.querySelector("body").style.backgroundColor=`${localStorage.getItem("theme")}`
    }else if(elements.themeBtn.style.marginLeft==="-60px"){
        localStorage.setItem("theme", "rgb(34, 40, 49)")
        document.querySelector("body").style.backgroundColor=`${localStorage.getItem("theme")}`
    }
    // console.log(themeBtn)
})
}

const handleSearch = async () => {
    if (!isValidCity(ui.elements.searchBar.value)) {
        ui.showError("Nu s-au gasit date pentru acest oras")
        return
    }
    ui.showLoading()
    try{
    const weatherService = await service.getCurrentWeatherWithFallback(ui.elements.searchBar.value)
    console.log("Locatia incarcata:\n >",weatherService.name)
    ui.hideLoading()
    console.log("Received data:\n",weatherService)
    ui.displayWeather(weatherService)
    }
    catch (err){
        console.error(err)
        ui.showError('Nu s-au gasit date pentru acest oras')
    }
}

export const isValidCity = (city) => {
  return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\s-]+$/.test(city.trim());
}
export const ByDefault = defaults()
setupEventListeners()
// Acceptă permisiunea când browser-ul întreabă
// getCoords().then((coords) => {
//   console.log('Coords received:', coords)
//   console.log('Has lat/lon?', coords.latitude && coords.longitude)
//   console.log('Source:', coords.source)
// })
// getCoords()
//   .then((coords) => service.getWeatherByCoords(coords.latitude, coords.longitude))
//   .then((main) => console.log('Weather for your location:', main))