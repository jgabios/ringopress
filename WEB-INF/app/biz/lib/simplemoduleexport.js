
exports.simpleexport = function(module){
    var rez = {};
    for(var item in module){
        if((module[item] instanceof Function) && module.hasOwnProperty(item)){
            rez[item]=module[item];
        }
    }
    return rez;
}