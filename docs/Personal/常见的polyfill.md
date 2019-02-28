#### 1.手动实现 myReduce(MDN)

```js
Object.defineProperty(Array.prototype, "Myreduce", {
    value: function(callback /*, initialValue*/) {
        var o = Object(this);
        var len = o.length >>> 0;

        // Steps 3, 4, 5, 6, 7
        var k = 0;
        var value;

        if (arguments.length >= 2) {
            value = arguments[1];
        } else {
            while (k < len && !(k in o)) {
                k++;
            }

            // 3. If len is 0 and initialValue is not present,
            //    throw a TypeError exception.
            if (k >= len) {
                throw new TypeError(
                    "Reduce of empty array " + "with no initial value"
                );
            }
            value = o[k++];
        }

        // 8. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kPresent be ? HasProperty(O, Pk).
            // c. If kPresent is true, then
            //    i.  Let kValue be ? Get(O, Pk).
            //    ii. Let accumulator be ? Call(
            //          callbackfn, undefined,
            //          « accumulator, kValue, k, O »).
            if (k in o) {
                value = callback(value, o[k], k, o);
            }

            // d. Increase k by 1.
            k++;
        }

        // 9. Return accumulator.
        return value;
    }
});
[12, 23].Myreduce(function(a, b) {
    console.log(a, b);
}, 2);
```
