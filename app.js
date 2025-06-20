import * as service from './modules/weather-service.js';
import * as config from './modules/config.js';
import * as ui from './modules/ui-controller.js';
//
// import('./modules/config.js').then((config) => {
//   console.log('MOCK_DATA:', config.MOCK_DATA)
// })
//
function defaults() {
    console.log('MOCK_DATA-INITIAL:', config.MOCK_DATA)

    console.time('weather-test')
    service.getCurrentWeather("Anina").then((data) => {
        console.timeEnd('weather-test') // ~1000ms?
        console.log('Received data:', data)
        console.log('City updated?', data.main.name === "Anina")
        const elements = ui.elements
    console.log('Elements incarcate in DOM:', Object.keys(elements))
    ui.displayWeather(JSON.parse(JSON.stringify(config.MOCK_DATA)))
    ui.showLoading()
    // ui.showError("ERROR:\n >Daca va fi cazul!")
    console.log("API initial, nemodificat!")
    })
}
const setupEventListeners = () => {
  ui.elements.searchBtn.addEventListener("click",handleSearch)
  ui.elements.searchBar.addEventListener("keydown", (x)=>{
    if (x.key==="Enter") {
        handleSearch();
    }
  })
}

const handleSearch = async () => {
    if (!isValidCity(ui.elements.searchBar.value)) {
        ui.showError("Nu s-au gasit date pentru acest oras")
        return
    }
    ui.showLoading()
    try{
    const weatherService = await service.getCurrentWeather(ui.elements.searchBar.value)
    console.log("Locatia incarcata:\n >",weatherService.main.name)
    ui.hideLoading()
    ui.displayWeather(weatherService)
    }
    catch (err){
        console.error(err)
        ui.showError('Nu s-au gasit date pentru acest oras')
    }
}

const isValidCity = (city) => {
  return city.length >= 2 && /^[a-zA-ZăâîșțĂÂÎȘȚ\\s-]+$/.test(city)
}
defaults()
setupEventListeners()
