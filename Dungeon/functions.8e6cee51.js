parcelRequire=function(e){var r="function"==typeof parcelRequire&&parcelRequire,n="function"==typeof require&&require,i={};function u(e,u){if(e in i)return i[e];var t="function"==typeof parcelRequire&&parcelRequire;if(!u&&t)return t(e,!0);if(r)return r(e,!0);if(n&&"string"==typeof e)return n(e);var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}return u.register=function(e,r){i[e]=r},i=e(u),u.modules=i,u}(function (require) {var c=document.getElementById("diceBut"),a=document.getElementById("monsterBut"),b=document.getElementById("board"),d=b.getContext("2d");function e(){b.width+=0;var a=Math.floor(6*Math.random());return d.fillText(a,10,50)}c.onclick=function(){e()};return{"guaG":{}};});