const API_KEY = "653ada71ed7b4d56228b06e2f0fc17b5";
const tampico = {
  lat: 22.3,
  lon: -97.85,
};

// UTILIDADES

const toCelsius = (kelvin) => Math.floor((kelvin - 273) * 10) / 10;

const getDate = (milseconds) =>
  new Date(milseconds * 1000).toLocaleDateString();

const toCapitalize = (string) => string[0].toUpperCase() + string.slice(1);

// API

const getWeather = (lat, lon) => {
  isLoading = true;
  const request = new XMLHttpRequest();
  request.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,alerts&appid=${API_KEY}&lang=sp`
  );
  request.responseType = "json";
  request.send();

  request.onload = () => {
    populateContent(request.response.daily);
    $("table").show();
    $("#loading").hide();
  };
};
const populateContent = (data) => {
  $("#pronostico-table").html(
    data
      .map(({ dt, pressure, temp, weather }, i) => {
        return `
      <tr>
        <td>${getDate(dt)}</td>
        <td>${toCelsius(temp.min)}C</td>
        <td>${toCelsius(temp.max)}C</td>
        <td>${pressure} mb</td>
        <td>${toCapitalize(weather[0].description)}.</td>
      </tr>`;
      })
      .join("")
  );
};

// MAPA

const mymap = L.map("mapid").setView([tampico.lat, tampico.lon], 13);

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1Ijoiam9zZXJtZXIxMjMiLCJhIjoiY2tuZmVhOXQ4MDh6dDJ1bzQyaDhwbDk0eiJ9.Ls7pmGEsdZ64UDIW6ukPBw",
  }
).addTo(mymap);

mymap.on("click", (e) => {
  const { lat, lng } = e.latlng;
  getWeather(lat, lng);
  $("#coords").html(
    `${Math.floor(lat * 10) / 10} ${Math.floor(lng * 10) / 10}`
  );
  $("table").hide();
  $("#loading").show();
});

$("table").hide();
$("#loading").hide();
