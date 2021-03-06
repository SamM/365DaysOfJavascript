var module, define, require;

if(typeof define != "function"){
    define = function(definition){
        if(typeof module == "object") module.exports = definition(require);
    }
}

define(function(require){

    var llac = require('js/llac');
    var LoadDays = function(start, end){

        var callbacks = {};
        callbacks.load = llac();
        callbacks.done = llac();
        callbacks.error = llac();

        var listeners = {};
        listeners.onLoad = callbacks.load.listen;
        listeners.onDone = callbacks.done.listen;
        listeners.onError = callbacks.error.listen;


        function LoadDay(i){
            var callbacks = {};
            callbacks.load = llac();
            callbacks.error = llac();

            var listeners = {};
            listeners.onLoad = callbacks.load.listen;
            listeners.onError = callbacks.error.listen;

            var oReq = new XMLHttpRequest();

            listeners.request = oReq;

            oReq.addEventListener("load", callbacks.load);
            oReq.addEventListener("error", callbacks.error);

            oReq.open("GET", "days/"+i+"/INFO.json");
            oReq.send();

            return listeners;
        }

        var days = [];
        var day;
        var done = 0;

        function onLoad(event){
            if(day.request.status == 200){
                try{
                    days.push(JSON.parse(day.request.response));
                }catch(err){
                    days.push({ day:start+done, error: err, text: day.request.response });
                    callbacks.error(start+done, err, day.request.response);
                }
                callbacks.load(start+done, days.slice(-1)[0]);

                done++;

                if(done == end - start){
                    callbacks.done(days);
                }else{
                    day = LoadDay(start+done);
                    day.onLoad(onLoad);
                    day.onError(onError);
                }
            }else{
                onError(event);
            }
        }

        function onError(event){
            callbacks.error(start+done, new Error("Failed to load resource"), event);
            callbacks.done(days);
        }

        day = LoadDay(start+done);
        day.onLoad(onLoad);
        day.onError(onError);

        return listeners;
    };

    return LoadDays;
});