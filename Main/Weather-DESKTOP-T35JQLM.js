var latitude;
var longitude;
var cfbool = true;
var weather = {};
var main = {};
var wind = {};
var clouds = {};
var forecast = {};
var widirection;

function timeClock () {
    var liveTime = new Date();
    var hours = liveTime.getHours();
    var minutes = liveTime.getMinutes();
    var seconds = liveTime.getSeconds();
    var day = liveTime.getDay();
    var month = liveTime.getMonth();
    var date = liveTime.getDate();
    var year = liveTime.getYear();
    var timeString;
    var dateString;
    var ampm;
    
    if (hours < 12) {
        ampm = 'AM';
    }
    else {
        ampm = 'PM';
    }
    
    if (hours > 12) {
        hours = hours - 12;
    }
    else {
        hours = hours;
    }
    
    if (hours === 0) {
        hours = 12;
    }
    
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    //Made a couple of modifications here to add the date.
    var dayArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (date < 10) {
        date = '0' + date;
    }
    if (year > 0) {
        year = 1900 + year;
    }
    
    timeString = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
    dateString = dayArr[day] + ', ' + monthArr[month] + ' ' + date + ', ' + year;
    $('#time').html(timeString);
    $('#date').html(dateString);
}

function convertTempKtoF (tempK) {
    var tempF;
    tempF = (((tempK - 273.15) * 1.8) + 32).toFixed(1);
    return tempF;
}
    
function convertTempFtoC (tempF) {
    var tempC;
    tempC = (((tempF - 32) * 5) / 9).toFixed(1);
    return tempC;
}
    
function convertTempCtoF (tempC) {
    var tempF;
    tempF = ((tempC * 1.8) + 32).toFixed(1);
    return tempF;
}

function convertTempKtoC (tempK) {
    var tempC;
    tempC = (tempK - 273.15).toFixed(1);
    return tempC;
}

function dayOrNight (str) {
    var dayNight;
    if (str[str.length - 1] === 'd') {
        dayNight = 'day';
    }
    else if (str[str.length - 1] === 'n') {
        dayNight = 'night';
    }
    
    return dayNight;
}

function capitalizeFirstLetter (str) {
    return str[0].toUpperCase() + str.slice(1);
}

function windDirection (num) {
    var windString;
    if (num>=0 && num<=22.5) {
        windString = 'N';
        widirection = 'up';
    }
    else if (num>22.5 && num<67.5) {
        windString = 'NE';
        widirection = 'up-right';
    }
    else if (num>=67.5 && num<=112.5) {
        windString = 'E';
        widirection = 'right';
    }
    else if (num>112.5 && num<157.5) {
        windString = 'SE';
        widirection = 'down-right';
    }
    else if (num>=157.5 && num<=202.5) {
        windString = 'S';
        widirection = 'down';
    }
    else if (num>202.5 && num<247.5) {
        windString = 'SW';
        widirection = 'down-left';
    }
    else if (num>=247.5 && num<=292.5) {
        windString = 'W';
        widirection = 'left';
    }
    else if (num>292.5 && num<337.5) {
        windString = 'NW';
        widirection = 'up-left';
    }
    else if (num>=337.5 && num<=360) {
        windString = 'N';
        widirection = 'up';
    }
    else {
        windString = 'Invalid';
    }
    
    return windString;
}

function locator () {
    var location;
    var region;
    var countryCode;
    var locationString;
    $.getJSON("http://www.geoplugin.net/json.gp?jsoncallback=?", function (data) {
        location = data.geoplugin_city;
        region = data.geoplugin_region;
        countryCode = data.geoplugin_countryCode;
        latitude = data.geoplugin_latitude;
        longitude = data.geoplugin_longitude;
        locationString = location + ', ' + region + ', ' + countryCode;
        $('#place').html(locationString);
        todayWeather();
        
    });
}
    
function todayWeather () {
    $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude, function (elem) {
            
        weather.description = elem.weather[0].description;
        weather.id = elem.weather[0].id;
        weather.icon = elem.weather[0].icon;
            
        main.temp = elem.main.temp;
        main.pressure = elem.main.pressure;
        main.humidity = elem.main.humidity;
        main.tempMin = elem.main.temp_min;
        main.tempMax = elem.main.temp_max;
            
        wind.speed = elem.wind.speed;
        wind.degree = elem.wind.deg;
            
        clouds.cover = elem.clouds.all;
        
        //row1
        $('#temp-main-text').html(convertTempKtoF(main.temp) + '&deg' + 'F');
        $('#temp-min').html('Min: ' + convertTempKtoF(main.tempMin) + '&deg' + 'F');
        $('#temp-max').html('Max: ' + convertTempKtoF(main.tempMax) + '&deg' + 'F');
        $('#icon-container i').addClass('wi');
        $('#icon-container i').addClass('wi-owm-' + dayOrNight(weather.icon) + '-' + weather.id);
        
        //row2
        $('#weather-description').html(capitalizeFirstLetter(weather.description));
        $('#cloud-cover').html('Cloud Cover: ' + clouds.cover + '%');
        $('#humidity').html('Humidity: ' + main.humidity + '%');
        $('#wind-speed').html('Wind Speed: ' + wind.speed + ' MPH');
        $('#wind-direction').html('Wind Direction: ' + windDirection(wind.degree));
        $('#pressure').html('Pressure: ' + main.pressure + ' mb');
        $('#wind-direction-icon i').addClass('wi');
        $('#wind-direction-icon i').addClass('wi-direction-' + widirection);
        dailyForecast();
    });
}

function cfToggle () {
    cfbool = !cfbool;
    var newTemp;
    var newTempMin;
    var newTempMax;
    var forecastTempMax;
    var forecastTempMin;
    var windSpeed;
    if (cfbool === false) {
        newTemp = convertTempFtoC(convertTempKtoF(main.temp));
        newTempMin = convertTempFtoC(convertTempKtoF(main.tempMin));
        newTempMax = convertTempFtoC(convertTempKtoF(main.tempMax));
        forecastTempMax = convertTempFtoC(convertTempKtoF(forecast.tempMax));
        forecastTempMin = convertTempFtoC(convertTempKtoF(forecast.tempMin));
        windSpeed = (wind.speed * 1.60934).toFixed(2);
        $('#temp-main-text').html(newTemp + '&deg' + 'C');
        $('#temp-min').html('Min: ' + newTempMin + '&deg' + 'C');
        $('#temp-max').html('Max: ' + newTempMax + '&deg' + 'C');
        $('#wind-speed').html('Wind Speed: ' + windSpeed + ' KPH');
        for (var i=0; i<3; i++) {
            $('#day' + (i+1).toString() + '-temp-max').html(forecastTempMax + '&deg' + ' C');
            $('#day' + (i+1).toString() + '-temp-min').html(forecastTempMin + '&deg' + ' C');
        }
    }
    
    else {
        newTemp = convertTempCtoF(convertTempKtoC(main.temp));
        newTempMin = convertTempCtoF(convertTempKtoC(main.tempMin));
        newTempMax = convertTempCtoF(convertTempKtoC(main.tempMax));
        forecastTempMax = convertTempCtoF(convertTempKtoC(forecast.tempMax));
        forecastTempMin = convertTempCtoF(convertTempKtoC(forecast.tempMin));
        windSpeed = (wind.speed / 1.60934).toFixed(2);
        $('#temp-main-text').html(newTemp + '&deg' + 'F');
        $('#temp-min').html('Min: ' + newTempMin + '&deg' + 'F');
        $('#temp-max').html('Max: ' + newTempMax + '&deg' + 'F');
        $('#wind-speed').html('Wind Speed: ' + windSpeed + ' MPH');
        for (var i=0; i<3; i++) {
            $('#day' + (i+1).toString() + '-temp-max').html(forecastTempMax + '&deg' + ' F');
            $('#day' + (i+1).toString() + '-temp-min').html(forecastTempMin + '&deg' + ' F');
        }
    }
}

function dailyForecast () {
    $.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily?lat="+latitude+"&lon="+longitude+"&cnt=4", function (elem) {

        var forecastDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var forecastTime = new Date();
        var forecastDayNum = forecastTime.getDay();
        var counter = 0;
        
        for (var i=0; i<3; i++) {
            
            if (forecastDayNum + i + 1 > forecastDay.length - 1) {
                $('#day' + (i+1).toString() + '-title-text').html(forecastDay[counter]);
                counter++;
            }
            else {
                $('#day' + (i+1).toString() + '-title-text').html(forecastDay[forecastDayNum + i + 1]);
            }
            
            forecast.description = elem.list[i+1].weather[0].description;
            forecast.icon = elem.list[i+1].weather[0].id;
            forecast.tempMax = elem.list[i+1].temp.max;
            forecast.tempMin = elem.list[i+1].temp.min;
            
            $('#day' + (i+1).toString() + '-forecast-description').html(capitalizeFirstLetter(forecast.description));
            $('#day' + (i+1).toString() + '-temp-max').html(convertTempKtoF(forecast.tempMax) + '&deg' + ' F');
            $('#day' + (i+1).toString() + '-temp-min').html(convertTempKtoF(forecast.tempMin) + '&deg' + ' F');
            $('#day' + (i+1).toString() + '-icon i').addClass('wi');
            $('#day' + (i+1).toString() + '-icon i').addClass('wi-owm-' + forecast.icon);
        }
        
    });
}

$(document).ready(function () {
    timeClock();
    setInterval('timeClock()', 1000);
    locator();
    $('#cftoggle').click(function () {
        cfToggle();
    });
});