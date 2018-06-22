var module, define, require;

if(typeof define != "function"){
    define = function(definition){
        if(typeof module == "object") module.exports = definition(require);
    }
}

define(function(require){
    var LoadDays = require('days/0/LoadDays');

    var start_day = 0;
    var end_day = 365;

    var pageHeading = document.createElement('h1');
    pageHeading.innerHTML = "365 Days Of Writing Code In Javascript";
    document.body.appendChild(pageHeading);

    var loadingMsg = document.createElement('div');
    loadingMsg.className = "loading";

    loadingMsg.innerHTML = "Loading Days...";

    document.body.appendChild(loadingMsg);

    var days = document.createElement('div');
    days.className = "days";

    var daysHeading = document.createElement('h2');
    daysHeading.innerHTML = "0 Days Completed";
    
    document.body.appendChild(daysHeading);
    document.body.appendChild(days);

    var loaded = 0;

    function DayElement(info){
        var day = document.createElement('div');
        day.className = "day";

        var dayHeading = document.createElement('h3');
        dayHeading.innerHTML = "Day "+info.day;
        day.appendChild(dayHeading);

        var date = document.createElement('div');
        date.className = "date";
        date.innerHTML = info.date;
        day.appendChild(date);

        var scripts = document.createElement('div');
        scripts.className = "scripts";
        scripts.innerHTML = "<h4>Scripts:</h4>";

        var scriptList = document.createElement('ul');
        scripts.appendChild(scriptList);

        Object.keys(info.scripts).forEach(function(key){
            var link = document.createElement('a');
            link.href = "days/"+info.day+"/"+info.scripts[key].filename;
            link.innerHTML = key;
            link.target = "_blank";
            var listItem = document.createElement('li');
            listItem.appendChild(link);
            scriptList.appendChild(listItem);
        })

        day.appendChild(scripts);


        return day;
    }

    var loader = LoadDays(start_day, end_day);

    loader.onLoad(function(index, info){
        console.log("Day "+index+": ");
        console.log(info);
        loaded++;
        daysHeading.innerHTML = loaded+(loaded==1?" Day Completed":" Days Completed");
        var day = DayElement(info);
        days.appendChild(day);
    });

    loader.onError(function(index, error){
        console.log("Day "+index+" Error: ");
        console.log(error);
    });

    loader.onDone(function(days){
        console.log(days.length + " days were loaded");
        document.body.removeChild(loadingMsg);
    });

    return loader;
});