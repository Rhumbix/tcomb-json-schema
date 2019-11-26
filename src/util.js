'use strict';

var t = require('tcomb');

function isInteger(n) {
  return n % 1 === 0;
}

function isNumber(n) {
	return !isNaN(n) 
}

var Null = t.irreducible('Null', function (x) {
  return x === null;
});
var Int = t.irreducible('Int', isInteger);
var Num = t.irreducible('Num', isNumber)
module.exports = {
  isInteger: isInteger,
  isNumber: isNumber,
  Null: Null,
  Int: Int,
  Num: Num
};
