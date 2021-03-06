/**
 * Created by Derek Rada on 2/26/2015.
 */

var async = require('async');

// Setup Plugins
var __plugins = [];


// Add a plugin
exports.add_plugin = function add_plugin(pluginObject) {
    if (typeof pluginObject === "object" && typeof pluginObject.process === "function" && pluginObject.name != undefined) {
        __plugins.push(pluginObject);
        console.log("Succeeded in adding plugin " + pluginObject.name);
    } else {
        console.log("Failed adding plugin " + pluginObject.name);
    }
};


exports.handler = function slackPluginHandler(message) {

    var waterFall = [];
    for (var i = 0; i < __plugins.length; i++) {
        waterFall.push(__plugins[i].process.bind(__plugins[i], message))
    }
    async.series(
        waterFall,
        function (err) {
            if (err) {
                console.error(err)
            }
        }
    );
};

exports.updateUsers = function updateUsers(users) {

    for (var i = 0; i < __plugins.length; i++) {
        __plugins[i].setUsers(users);
    }
};

exports.updateLocations = function updateLocations(locations) {

    for (var i = 0; i < __plugins.length; i++) {
        __plugins[i].setLocations(locations);
    }
};

exports.setSelf = function setSelf(selfString) {

    for (var i = 0; i < __plugins.length; i++) {
        __plugins[i].setSelf(selfString);
    }
};


exports.getStats = function getStats() {

    var ret = [];
    for (var i = 0; i < __plugins.length; i++) {
        var stat = {
            name: __plugins[i].name,
            stats: __plugins[i].stats
        };
        ret.push(stat);
    }
    console.log("Stats: ", ret);
    return ret;
};