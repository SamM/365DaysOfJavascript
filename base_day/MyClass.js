var module, define, require;

if(typeof define != "function"){
    define = function(definition){
        if(typeof module == "object") module.exports = definition(require);
    }
}

define(function(require){
    return {};
});