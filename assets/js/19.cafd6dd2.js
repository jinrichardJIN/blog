(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{180:function(t,s,a){"use strict";a.r(s);var n=a(0),o=Object(n.a)({},function(){this.$createElement;this._self._c;return this._m(0)},[function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"content"},[a("h1",{attrs:{id:"常见的polyfill"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#常见的polyfill","aria-hidden":"true"}},[t._v("#")]),t._v(" 常见的polyfill")]),t._v(" "),a("h4",{attrs:{id:"_1-手动实现-myreduce-mdn"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-手动实现-myreduce-mdn","aria-hidden":"true"}},[t._v("#")]),t._v(" 1.手动实现 myReduce(MDN)")]),t._v(" "),a("div",{staticClass:"language-js extra-class"},[a("pre",{pre:!0,attrs:{class:"language-js"}},[a("code",[t._v("Object"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{attrs:{class:"token function"}},[t._v("defineProperty")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("Array"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("prototype"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{attrs:{class:"token string"}},[t._v('"Myreduce"')]),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    value"),a("span",{attrs:{class:"token punctuation"}},[t._v(":")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("function")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("callback "),a("span",{attrs:{class:"token comment"}},[t._v("/*, initialValue*/")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        "),a("span",{attrs:{class:"token keyword"}},[t._v("var")]),t._v(" o "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token function"}},[t._v("Object")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token keyword"}},[t._v("this")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),a("span",{attrs:{class:"token keyword"}},[t._v("var")]),t._v(" len "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" o"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("length "),a("span",{attrs:{class:"token operator"}},[t._v(">>>")]),t._v(" "),a("span",{attrs:{class:"token number"}},[t._v("0")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n        "),a("span",{attrs:{class:"token comment"}},[t._v("// Steps 3, 4, 5, 6, 7")]),t._v("\n        "),a("span",{attrs:{class:"token keyword"}},[t._v("var")]),t._v(" k "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token number"}},[t._v("0")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),a("span",{attrs:{class:"token keyword"}},[t._v("var")]),t._v(" value"),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n        "),a("span",{attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("arguments"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),t._v("length "),a("span",{attrs:{class:"token operator"}},[t._v(">=")]),t._v(" "),a("span",{attrs:{class:"token number"}},[t._v("2")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            value "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" arguments"),a("span",{attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{attrs:{class:"token number"}},[t._v("1")]),a("span",{attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("else")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),a("span",{attrs:{class:"token keyword"}},[t._v("while")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("k "),a("span",{attrs:{class:"token operator"}},[t._v("<")]),t._v(" len "),a("span",{attrs:{class:"token operator"}},[t._v("&&")]),t._v(" "),a("span",{attrs:{class:"token operator"}},[t._v("!")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("k "),a("span",{attrs:{class:"token keyword"}},[t._v("in")]),t._v(" o"),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n                k"),a("span",{attrs:{class:"token operator"}},[t._v("++")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n            "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n            "),a("span",{attrs:{class:"token comment"}},[t._v("// 3. If len is 0 and initialValue is not present,")]),t._v("\n            "),a("span",{attrs:{class:"token comment"}},[t._v("//    throw a TypeError exception.")]),t._v("\n            "),a("span",{attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("k "),a("span",{attrs:{class:"token operator"}},[t._v(">=")]),t._v(" len"),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n                "),a("span",{attrs:{class:"token keyword"}},[t._v("throw")]),t._v(" "),a("span",{attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),a("span",{attrs:{class:"token class-name"}},[t._v("TypeError")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("\n                    "),a("span",{attrs:{class:"token string"}},[t._v('"Reduce of empty array "')]),t._v(" "),a("span",{attrs:{class:"token operator"}},[t._v("+")]),t._v(" "),a("span",{attrs:{class:"token string"}},[t._v('"with no initial value"')]),t._v("\n                "),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n            "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n            value "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" o"),a("span",{attrs:{class:"token punctuation"}},[t._v("[")]),t._v("k"),a("span",{attrs:{class:"token operator"}},[t._v("++")]),a("span",{attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n        "),a("span",{attrs:{class:"token comment"}},[t._v("// 8. Repeat, while k < len")]),t._v("\n        "),a("span",{attrs:{class:"token keyword"}},[t._v("while")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("k "),a("span",{attrs:{class:"token operator"}},[t._v("<")]),t._v(" len"),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),a("span",{attrs:{class:"token comment"}},[t._v("// a. Let Pk be ! ToString(k).")]),t._v("\n            "),a("span",{attrs:{class:"token comment"}},[t._v("// b. Let kPresent be ? HasProperty(O, Pk).")]),t._v("\n            "),a("span",{attrs:{class:"token comment"}},[t._v("// c. If kPresent is true, then")]),t._v("\n            "),a("span",{attrs:{class:"token comment"}},[t._v("//    i.  Let kValue be ? Get(O, Pk).")]),t._v("\n            "),a("span",{attrs:{class:"token comment"}},[t._v("//    ii. Let accumulator be ? Call(")]),t._v("\n            "),a("span",{attrs:{class:"token comment"}},[t._v("//          callbackfn, undefined,")]),t._v("\n            "),a("span",{attrs:{class:"token comment"}},[t._v("//          « accumulator, kValue, k, O »).")]),t._v("\n            "),a("span",{attrs:{class:"token keyword"}},[t._v("if")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("k "),a("span",{attrs:{class:"token keyword"}},[t._v("in")]),t._v(" o"),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n                value "),a("span",{attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{attrs:{class:"token function"}},[t._v("callback")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("value"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" o"),a("span",{attrs:{class:"token punctuation"}},[t._v("[")]),t._v("k"),a("span",{attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" k"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" o"),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n            "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n            "),a("span",{attrs:{class:"token comment"}},[t._v("// d. Increase k by 1.")]),t._v("\n            k"),a("span",{attrs:{class:"token operator"}},[t._v("++")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n        "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n        "),a("span",{attrs:{class:"token comment"}},[t._v("// 9. Return accumulator.")]),t._v("\n        "),a("span",{attrs:{class:"token keyword"}},[t._v("return")]),t._v(" value"),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{attrs:{class:"token punctuation"}},[t._v("[")]),a("span",{attrs:{class:"token number"}},[t._v("12")]),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{attrs:{class:"token number"}},[t._v("23")]),a("span",{attrs:{class:"token punctuation"}},[t._v("]")]),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{attrs:{class:"token function"}},[t._v("Myreduce")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{attrs:{class:"token keyword"}},[t._v("function")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("a"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" b"),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),a("span",{attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    console"),a("span",{attrs:{class:"token punctuation"}},[t._v(".")]),a("span",{attrs:{class:"token function"}},[t._v("log")]),a("span",{attrs:{class:"token punctuation"}},[t._v("(")]),t._v("a"),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" b"),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),a("span",{attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),a("span",{attrs:{class:"token number"}},[t._v("2")]),a("span",{attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])])])}],!1,null,null,null);o.options.__file="常见的polyfill.md";s.default=o.exports}}]);