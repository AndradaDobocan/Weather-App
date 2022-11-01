const API_URL = "https://api.openweathermap.org/data/2.5/weather?units=metric&";

const API_KEY = "fd3a81af060da6279d48b0d6b97c22f0";

let cities = [];

const handleLanguageClick = (event) => {
    localStorage.setItem("language", event.target.value);
    checkSelectedLanguage();
}

const onCityClick = (event) => {
    event.target.style.visibility = "hidden";
  
    cities = cities.filter(
      (city) => city.includes(`id=${event.target.id}`) === false
    );
  
    localStorage.setItem("cities", JSON.stringify(cities));
  };
  
const registerCityListeners = () => {
    document
      .querySelectorAll(".city")
      .forEach((node) => node.addEventListener("click", onCityClick));
  };
  
const cityTemplate = (data) => {
    const cityName = data.name;
    const temperature = data.main.temp;
    const feelsLike = data.weather[0].main;
  
    return `<div class="city" id="${data.name}">
            <strong>${temperature}°C in ${cityName}</strong>
            <strong>Skies are: ${feelsLike}</strong>
            </div>`;
  };
  
const saveCityAndDisplayWeather = (data) => {
    const city = cityTemplate(data);
  
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
    document.querySelector("#city-list").innerHTML = cities.join("");
    registerCityListeners();
  };

const onLocationSuccess = (position) => {
    const latitude = position.coords.latitude;
    const { longitude } = position.coords;
  
    const request = `${API_URL}appid=${API_KEY}&lat=${latitude}&lon=${longitude}`;
  
    fetch(request)
      .then((res) => res.json())
      .then(saveCityAndDisplayWeather);
  };
  
const hideErrorMessages = () => {
    document.querySelector(".search-error-message").style.visibility = "hidden";
    document.querySelector(".location-error-message").style.visibility = "hidden";
  };

const handleLocationClick = () => {
    hideErrorMessages();
    navigator.geolocation.getCurrentPosition(onLocationSuccess, () => {
      document.querySelector(".location-error-message").style.visibility = "visible";
    });
  };

const handleSearchClick = () => {
    const location = document.querySelector("#location").value;
    hideErrorMessages();
  
    if (location.length > 0) {
      const request = `${API_URL}appid=${API_KEY}&q=${location}`;
  
      fetch(request)
        .then((res) => res.json())
        .then(saveCityAndDisplayWeather)
        .catch((error) => {
          document.querySelector(".search-error-message").style.visibility = "visible";
        });
    }
  };

const checkSelectedLanguage = () => {
    const language = localStorage.getItem("language");

    if (language) {
        if(language === "RO") {
            document.querySelectorAll(".text-ro")
            .forEach((node) => (node.style.display ="block"));

            document.querySelectorAll(".text-en")
            .forEach((node) => (node.style.display ="none"));

            document.querySelectorAll(".text-es")
            .forEach((node) => (node.style.display ="none"));
        } 
        else if (language === "ES") {
            document.querySelectorAll(".text-ro")
            .forEach((node) => (node.style.display ="none")); 

            document.querySelectorAll(".text-en")
            .forEach((node) => (node.style.display ="none"));

            document.querySelectorAll(".text-es")
            .forEach((node) => (node.style.display ="block"));
        } else {
            document.querySelectorAll(".text-en")
            .forEach((node) => (node.style.display ="block")); 

            document.querySelectorAll(".text-ro")
            .forEach((node) => (node.style.display ="none"));

            document.querySelectorAll(".text-es")
            .forEach((node) => (node.style.display ="none"));
        }
    }
}

const initPage = () => {
    checkSelectedLanguage();

    document
    .querySelector("#lang-ro")
    .addEventListener("click", handleLanguageClick);
    document
    .querySelector("#lang-en")
    .addEventListener("click", handleLanguageClick);
    document
    .querySelector("#lang-es")
    .addEventListener("click", handleLanguageClick);
    document
    .querySelector(".text-en#btn-location")
    .addEventListener("click", handleLocationClick);
    document
    .querySelector(".text-ro#btn-location")
    .addEventListener("click", handleLocationClick);
    document
    .querySelector(".text-es#btn-location")
    .addEventListener("click", handleLocationClick);
    document
    .querySelector(".text-en#btn-search-location")
    .addEventListener("click", handleSearchClick);
    document
    .querySelector(".text-ro#btn-search-location")
    .addEventListener("click", handleSearchClick);
    document
    .querySelector(".text-es#btn-search-location")
    .addEventListener("click", handleSearchClick);

  const savedCities = JSON.parse(localStorage.getItem("cities"));

  if (savedCities) {
    cities = savedCities;

    document.querySelector("#city-list").innerHTML = cities.join("");
  }
  registerCityListeners();
};

window.addEventListener("load", initPage);