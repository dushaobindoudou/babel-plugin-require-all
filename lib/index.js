/**
* @Author: dushaobin <require dir all files>
* @Date:   2017-03-21
* @Email:  dushaobin@we.com
* @Project: require dir all files
* @Last modified by:   dushaobin
* @Last modified time: 2017-03-23
*/


var fs = require('fs');
var glob = require('glob');
var pathModule = require('path');
var expressionName = "requireAll";
var currentPath = process.cwd();
function getRequireInfo(node,t){
    if(node.arguments.length < 1){
        console.log('requireAll need dir path');
        return;
    }
    var dirPath = node.arguments[0].value;
    var splitPath = "";
    if(node.arguments.length >= 2){
        splitPath = node.arguments[1].value;
    }
    var absolutePath = pathModule.join(currentPath,dirPath);
    if(!fs.existsSync(absolutePath)){
        console.log('requireAll path is not exist:'+dirPath,absolutePath);
        return;
    }
    var files = glob.sync(pathModule.join(absolutePath,'/**/*.*'));
    var requireList = [];
    var wrapObj = [];
    files.forEach(function(v,i){
        if(!v){
            return;
        }
        var rName = '$' + v.replace(pathModule.extname(v),'').replace(pathModule.join(currentPath,splitPath)+pathModule.sep,"").replace(/\W/ig,'_');

        var requireExp = t.callExpression(
            t.identifier('require'),
            [t.stringLiteral(v)]
        );
        var varReq = t.variableDeclarator(t.identifier(rName),requireExp);
        var express = t.variableDeclaration('const',[varReq]);
        wrapObj.push(t.objectProperty(t.identifier(rName),t.identifier(rName)));
        requireList.push(express);
    });
    return {
        requireList:requireList,
        wrapObj:wrapObj
    }
}

module.exports = function(babel){
    var t = babel.types;
    return {
        visitor:{
            VariableDeclaration:function(path){
                path.node.declarations.forEach(function(v,i){
                    var initExp = v.init;
                    if(initExp.type === 'CallExpression' && initExp.callee.name === expressionName){
                        var requireInfo = getRequireInfo(initExp,t);
                        var varWarp = t.variableDeclarator(v.id,t.objectExpression(requireInfo.wrapObj));
                        requireInfo.requireList.push(t.variableDeclaration(path.node.kind,[varWarp]));
                        path.replaceWithMultiple(requireInfo.requireList);
                        path.skip();
                    }
                });
            },
            CallExpression:function(path){
                if(path.node.callee.name !== expressionName){
                    return;
                }
                var requireInfo = getRequireInfo(path.node,t);
                path.replaceWithMultiple(requireInfo.requireList);
            }
        }
    }
 }
