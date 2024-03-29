var fivedayboxcontainer = document.querySelector('#five-day-forecast').children[1]
var currentweathercontainer = document.querySelector('#current-forecast')
var searchbutton = document.querySelector('#city-search-button')
var citysearchinput = document.querySelector('#city-search-input')
var citysearchhistory = document.querySelector('#city-history')
var cityinput = ""
var cityname = ""
var searchhistoryarray = []

searchbutton.addEventListener("click", function(){
  cityinput = citysearchinput.value.trim()
  getApi(citysearchinput.value.trim()) //take user inputs for city trims it and passes it to the geo coordinate finder API
})
citysearchhistory.addEventListener('click', event=>{
  cityinput = event.target.textContent
  getApi(cityinput)
})
function getApi(cityinput) {
    // Insert the API url to get a list of your repos
    //var requestUrl = 'https://api.github.com/users/ElliottLi97/repos';
    //var locationurl = 'http://api.openweathermap.org/geo/1.0/direct?q='+cityinput+'&limit=5&appid=1d01ab5b1c742650aa127b4ff6585e0c';
    if (document.getElementById("weather-container").style.visibility === "hidden"){
      document.getElementById("weather-container").style.visibility = "visible" //Unhides weather data container when the user does their first search 
    }
    let locationurltest = 'https://api.openweathermap.org/geo/1.0/direct?q='+cityinput+'&limit=5&appid=1d01ab5b1c742650aa127b4ff6585e0c';
    let lat = ""
    let long = ""
    fetch(locationurltest)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        if (data.length === 0){
          alert("A city could not be found with that name. Please try again.") //Alerts user if their searched city returns an empty array
        }else{
          console.log(data)
          console.log(data[0].lat , data[0].lon)
          lat = data[0].lat //latitude
          long = data[0].lon //longitude
          cityname = data[0].name
          for (let i = 0; i < searchhistoryarray.length; i++){ // logic to check for duplicat cities in the local storage / previous searched buttons
            if( cityname === searchhistoryarray[i]){
              //console.log('matching')
              getweather(lat,long)
              return
            }
          }
          searchhistoryarray.unshift(cityname) //adds new cities to start of local storage and history buttons
          let buttontemplate = '<button class="col-12">'+cityname+'</button>'
          let tempElement = document.createElement('div')
          tempElement.innerHTML = buttontemplate
          citysearchhistory.prepend(tempElement)    
          localStorage.setItem("city-names-history", JSON.stringify(searchhistoryarray))
          
          getweather(lat,long) //passes latitude and longitue to the weather API function
          
        }
    
      });
  }

  function getweather(latitude, longitude){
      let locationweatheronecall = 'https://api.openweathermap.org/data/2.5/onecall?lat='+ latitude + '&lon=' + longitude 
      + '&exclude=minutely,hourly,alerts&appid=1d01ab5b1c742650aa127b4ff6585e0c&units=imperial'

      fetch(locationweatheronecall)
      .then(function (response) {
        return response.json();
      })
      
      .then(function (data) {
        console.log(data)
        console.log("Current Conditions: Temperature:",data.current.temp,"Wind Speed:",data.current.wind_speed,"Humidity:",data.current.humidity,"UVI:",
        data.current.uvi,"Date:", moment.unix(data.current.dt).format("(MM/DD/YYYY)") )
        currdate = moment.unix(data.current.dt).format("(MM/DD/YYYY)")
        curricon = data.current.weather[0].icon
        currtemp = data.current.temp
        currwind = data.current.wind_speed
        currhumidity = data.current.humidity
        curruvi = data.current.uvi
        let currenttemplate = '<div id="current-weather-title" class="box-headers">'+cityname+' '+currdate
        +'<img src="https://openweathermap.org/img/wn/'+curricon+'.png" alt=""></img></div><div id="current-weather-stats">Temp: '
        +currtemp+' °F<br>  Wind: '+currwind+' MPH<br>  Humidity: '+currhumidity
        +' %<br>  UV Index: <div class="" id="uvcolor">'+curruvi+'</div> <br>'
        currentweathercontainer.innerHTML = currenttemplate
        UVcheck(curruvi)
        for (let i = 1; i<6; i++){
          //console.log("Temp:", data.daily[i].temp.day,"Wind Speed:",data.daily[i].wind_speed,"Humidity:",data.daily[i].humidity,"Date:",
          //moment.unix(data.daily[i].dt).format("MM/DD/YYYY")) //testing code
          fivedaydate = moment.unix(data.daily[i].dt).format("MM/DD/YYYY")
          fivedaytemp = data.daily[i].temp.day
          fivedaywind = data.daily[i].wind_speed
          fivedayhumidity = data.daily[i].humidity
          fivedayicon = data.daily[i].weather[0].icon
          let fivedaytemplate ='<div class="five-day-box-date">'+fivedaydate+'</div><img src="https://openweathermap.org/img/wn/'
          +fivedayicon+'.png" alt=""><br>Temp: '+fivedaytemp+'°F<br>Wind: '+fivedaywind+' MPH<br>Humidity: '+fivedayhumidity+' %<br>'
          fivedayboxcontainer.children[i-1].innerHTML = fivedaytemplate
        }
      })
  }

function UVcheck(UVI){ //changes uv box color 
  if (UVI<2){
    document.getElementById("uvcolor").classList.add('UVLow')
  }else if (UVI<8){
    document.getElementById("uvcolor").classList.add('UVMedium')
  }else {
    document.getElementById("uvcolor").classList.add('UVHigh')
  }
}

function onpageload(){
  if (JSON.parse(localStorage.getItem("city-names-history")) == null){
    console.log("Local Storage Empty")
    document.getElementById("weather-container").style.visibility = "hidden"    
    return
  }
  document.getElementById("weather-container").style.visibility = "hidden" //hides weather container on page load
  searchhistoryarray = JSON.parse(localStorage.getItem("city-names-history"))
  for (let i = 0; i<searchhistoryarray.length; i++){ //add history buttons based on local storage
    let buttontemplate = '<button class="col-12 historybutton">'+searchhistoryarray[i]+'</button>'
    let tempElement = document.createElement('div')
    tempElement.innerHTML = buttontemplate
    citysearchhistory.append(tempElement)     
  }
}
onpageload()

