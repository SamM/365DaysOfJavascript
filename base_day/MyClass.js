var MyClass = (function(){
    var MyClass = {};
    return MyClass;
})();

var module;
if(typeof module == "object") module.exports = MyClass;