function getApi() {
    // Insert the API url to get a list of your repos
    //var requestUrl = 'https://api.github.com/users/ElliottLi97/repos';
    //var locationurl = 'http://api.openweathermap.org/geo/1.0/direct?q='+cityinput+'&limit=5&appid=1d01ab5b1c742650aa127b4ff6585e0c';
    var locationurltest = 'http://api.openweathermap.org/geo/1.0/direct?q=San Marcos&limit=5&appid=1d01ab5b1c742650aa127b4ff6585e0c';
    var lat = ""
    var long = ""
    fetch(locationurltest)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data)
        console.log(data[1].lat , data[1].lon)
        lat = data[1].lat
        long = data[1].lon
        getweather(lat,long)      
      });
  }

  getApi()

  function getweather(latitude, longitude){
      var locationweatheronecall = 'https://api.openweathermap.org/data/2.5/onecall?lat='+ latitude + '&lon=' + longitude + '&exclude=minutely,hourly,alerts&appid=1d01ab5b1c742650aa127b4ff6585e0c'

      fetch(locationweatheronecall)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data)
        console.log("Temperature",data.current.temp,"Wind Speed",data.current.wind_speed,"Humidity",data.current.humidity,"UVI",
        data.current.uvi,"Date", moment.unix(data.current.dt).format("MM/DD/YYYY") )
        for (let i = 1; i<6; i++){
          console.log("Temp", data.daily[i].temp.day,"wind speed",data.daily[i].wind_speed,"humidity",data.daily[i].humidity,"Date",
          moment.unix(data.daily[i].dt).format("MM/DD/YYYY"))
        }
      })
  }