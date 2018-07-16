var module, define, require, Rephrase, WordMatrix, llac, window, process;

if(typeof define != "function"){
    define = function(definition){
        Rephrase = definition(require);
        if(typeof module == "object") module.exports = Rephrase;
        define = null;
    }
}

define(function(require){

    var Rephrase = function(data, metadata){
        var rephrase = this;

        var onGetData = Rephrase.llac();
        this.onGetData = onGetData.listen;

        var preSetData = Rephrase.llac();
        this.preSetData = preSetData.listen;

        var onSetData = Rephrase.llac();
        this.onSetData = onSetData.listen;

        var onGetMetaData = Rephrase.llac();
        this.onGetMetaData = onGetMetaData.listen;

        var onSetMetaData = Rephrase.llac();
        this.onSetMetaData = onSetMetaData.listen;

        console.log('adding base')
        this.rephrase = Rephrase.WordMatrix.call(null, '\:')('Rephrase Base', true);
        console.log('adding metadata')
        this.metadata = this.rephrase.metadata = Rephrase.WordMatrix.call(this.rephrase, MetaDataSetter, MetaDataGetter)
        console.log('adding data')
        this.data = this.rephrase.data = Rephrase.WordMatrix.call(this.rephrase, DataSetter, DataGetter, onSetData)(['Rephrase Data'],true);

        function DataGetter(data){
            var rephrase = Rephrase.WordMatrix.getBase(this);
            var name = Rephrase.WordMatrix.getName(this).split(':').slice(-1)[0];
            name = name == 'data' ? '' : name;
            
            var metadata = rephrase.metadata(name)();
            if(typeof metadata == "object" && Object.keys(metadata).length){
                if(typeof metadata.viewCount == 'number') metadata.viewCount++;
                metadata.viewsSinceChange = typeof metadata.viewsSinceChange == 'number' ? metadata.viewsSinceChange + 1 : 1;
                metadata.viewsSinceStart = typeof metadata.viewsSinceStart == 'number' ? metadata.viewsSinceStart + 1 : 1;
                rephrase.metadata(name)(metadata, true);
            }else{
                console.log('uninitialized metadata on get data :', name);
                metadata = {};
                metadata.private = 'true';
                metadata.viewsSinceChange = 0;
                metadata.viewsSinceStart = 0;
                rephrase.metadata(name)(metadata, true);
            }
            onGetData.call(this, data, metadata);
            return data;
        }
    
        function DataSetter(data){
            data = Rephrase.Data(data);
            var rephrase = Rephrase.WordMatrix.getBase(this);
            var name = Rephrase.WordMatrix.getName(this).split(':').slice(-1)[0];
            name = name == 'data' ? '' : name;

            if(typeof rephrase.metadata == 'function'){
                var metadata = rephrase.metadata(name)();
                if(typeof metadata == 'object' && Object.keys(metadata).length){
                    metadata.viewsSinceChange = 0;
                    rephrase.metadata(name)(metadata, true);
                }else{
                    metadata = {};
                    metadata.private = 'true';
                    metadata.viewsSinceChange = 0;
                    metadata.viewsSinceStart = 0;
                    rephrase.metadata(name)(metadata, true);
                }
                onSetData.call(this, name, data, metadata);
            }else{
                onSetData.call(this, name, data);
            }

            return data;
        }
    
        function MetaDataGetter(metadata){
            metadata = Rephrase.MetaData(metadata);
            var name = Rephrase.WordMatrix.getName(this).split(':').slice(-1)[0];
            name = name == 'metadata' ? '' : name;
            onGetMetaData.call(this, name, metadata);
            return metadata;
        }
    
        function MetaDataSetter(metadata){
            var name = Rephrase.WordMatrix.getName(this).split(':').slice(-1)[0];
            name = name == 'metadata' ? '' : name;
            onSetMetaData.call(this, name, metadata);
            return metadata;
        }
    };

    Rephrase.isEncodedList = function(data){
        if(typeof data == 'string' && data.length){
            var matchList = /^([^\w]+|[^\w]+.+[^\w]*)(?:.*\1)+(?:.*\1)$/u;
            if(data.search(matchList)==0){
                var matches = data.match(matchList);
                var spacer = matches[1];
                data = data.split(spacer).slice(1,-1);
                return {token: spacer, items: data};
            }
        }
        return false;
    };

    Rephrase.isValidToken = function(string){
        if(typeof string != 'string') return false;
        var matchToken = /^([^\w]+|[^\w]+.+)$/u;
        if(string.search(matchToken)==0) return true;
        return false;
    }

    Rephrase.Data = function(data){
        if(typeof data == 'number') return [data];
        if(typeof data == 'string'){
            var list = Rephrase.isEncodedList(data);
            if(list){
                data = list.items;
            }else if(data.length == 0){
                data = [];
            }else{
                data = [data];
            }
            return data;
        }
        return Array.isArray(data) ? Array.from(data) : [] ;
    };

    Rephrase.MetaData = function(metadata){
        metadata = (typeof metadata == 'object') ? metadata : {} ;
        return metadata;
    }

    // Load Dependencies from global scope

    Rephrase.llac = llac;
    Rephrase.WordMatrix = WordMatrix;

    Rephrase.isEmpty = function(obj){
        if(Array.isArray(obj)) return obj.length == 0;
        else if(typeof obj == 'object' && obj != null) return Object.keys(obj).length == 0;
        else if(typeof obj == 'string') return obj.length == 0;
        else if(typeof obj == 'number') return obj === 0;
        else return !!obj;
    };

    if(typeof require == "function"){
        
        // If require function is available, load dependencies using require if not already loaded
        
        Rephrase.llac = typeof Rephrase.llac != 'undefined' ? Rephrase.llac : require('./llac');
        Rephrase.WordMatrix = typeof Rephrase.WordMatrix != 'undefined' ? Rephrase.WordMatrix : require('./WordMatrix');

        if(false && typeof process == 'object'){
            Rephrase.RedisStorage = require('./Rephrase-RedisStorage');
            Rephrase.FileStorage = require('./Rephrase-FileStorage');
            Rephrase.HTTPClient = require('./Rephrase-HTTPClient');
            Rephrase.HTTPServer = require('./Rephrase-HTTPServer');
        }
        if(false && typeof window == "object"){
            Rephrase.WebClient = require('./Rephrase-WebClient');
        }
    }

    return Rephrase;
    
});