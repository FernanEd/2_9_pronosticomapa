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

let request = new XMLHttpRequest();
request.open(
  "GET",
  `https://api.openweathermap.org/data/2.5/onecall?lat=${tampico.lat}&lon=${tampico.lon}&exclude=hourly,minutely,alerts&appid=${API_KEY}&lang=sp`
);
request.responseType = "json";
request.send();

request.onload = () => {
  populateContent(request.response.daily);
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
