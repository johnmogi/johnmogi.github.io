parcelRequire=function(e){var r="function"==typeof parcelRequire&&parcelRequire,n="function"==typeof require&&require,i={};function u(e,u){if(e in i)return i[e];var t="function"==typeof parcelRequire&&parcelRequire;if(!u&&t)return t(e,!0);if(r)return r(e,!0);if(n&&"string"==typeof e)return n(e);var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}return u.register=function(e,r){i[e]=r},i=e(u),u.modules=i,u}(function (require) {var b=document.getElementById("boardMaker");function d(r){numberOfSquares.style.border="1px solid black";for(var a=parseInt(12/r),e=0;e<r;e++)for(var n=0;n<r;n++){var $=document.createElement("div");$.classList="col-".concat(a," card-square"),$.id="square"+e+n,b.appendChild($)}}function f(r){if(console.log(r),isNaN(r)&&(messageBoard.innerHTML="enter a number"),r||(messageBoard.style.border="1px solid red",messageBoard.innerHTML="enter a number"),5===r||7===r)return r--}function c(r){b.innerHTML="",r?f(r):r=4,d(r),g(r)}function g(r){Math.floor(2*Math.random())%2==0&&console.log("true")}numberOfSquares.onchange=function(){c(numberOfSquares.value)},c();return{"kX88":{}};});