var module, define, require;

if(typeof define != "function"){
    define = function(definition){
        if(typeof module == "object") module.exports = definition(require);
    }
}

define(function(require){
    var LoadDays = require('LoadDays');

    var start_day = 0;
    var end_day = 365;

    var loader = LoadDays(start_day, end_day);

    loader.onLoad(function(index, info){
        console.log("Day "+index+": ");
        console.log(info);
    });

    loader.onError(function(index, error){
        console.log("Day "+index+" Error: ");
        console.log(error);
    });

    loader.onDone(function(days){
        console.log(days.length + " days were loaded");
    });

    return loader;
});