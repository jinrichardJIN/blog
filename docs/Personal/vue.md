# vue

## Vue.emit 和 Vue.on 的源码实现

#### $on和$emit 在 vue 中是我们很常见的两个方法，这个方法更多是解决父子组件之间传递数据。接下来我们通过源码来认识下这两个函数，是如何实现这种发布者和订阅者模式的。

#### \$on

```js
Vue.prototype.$on = function(
    event: string | Array<string>,
    fn: Function
): Component {
    const vm: Component = this;
    if (Array.isArray(event)) {
        for (let i = 0, l = event.length; i < l; i++) {
            this.$on(event[i], fn);
        }
    } else {
        (vm._events[event] || (vm._events[event] = [])).push(fn);
        // optimize hook:event cost by using a boolean flag marked at registration
        // instead of a hash lookup
        if (hookRE.test(event)) {
            vm._hasHookEvent = true;
        }
    }
    return vm;
};
```

首先来分析各个参数的意思

-   event
    -   `event`代表着接受的事件，既可以是一个 string，也可以是一个数组。
-   fn
    -   fn 是一个函数

##### 重要片段

```js
this.$on(event[i], fn);
```

上面片段是当 event 是一个数组的时候，进行递归绑定

```js
(vm._events[event] || (vm._events[event] = [])).push(fn);
```

上面是在实例上定义一个数组，将事件对应的函数依次放进去。

##### \$emit

```js
Vue.prototype.$emit = function(event: string): Component {
    const vm: Component = this;
    if (process.env.NODE_ENV !== "production") {
        const lowerCaseEvent = event.toLowerCase();
        if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
            tip(
                `Event "${lowerCaseEvent}" is emitted in component ` +
                    `${formatComponentName(
                        vm
                    )} but the handler is registered for "${event}". ` +
                    `Note that HTML attributes are case-insensitive and you cannot use ` +
                    `v-on to listen to camelCase events when using in-DOM templates. ` +
                    `You should probably use "${hyphenate(
                        event
                    )}" instead of "${event}".`
            );
        }
    }
    let cbs = vm._events[event];
    if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        const args = toArray(arguments, 1);
        for (let i = 0, l = cbs.length; i < l; i++) {
            try {
                cbs[i].apply(vm, args);
            } catch (e) {
                handleError(e, vm, `event handler for "${event}"`);
            }
        }
    }
    return vm;
};
```

还是只关心重要代码

```js
if (cbs) {
    cbs = cbs.length > 1 ? toArray(cbs) : cbs;
    const args = toArray(arguments, 1);
    for (let i = 0, l = cbs.length; i < l; i++) {
        try {
            cbs[i].apply(vm, args);
        } catch (e) {
            handleError(e, vm, `event handler for "${event}"`);
        }
    }
}
```

从上面的代码得知，每当 emit 函数触发一次的时候，会将$on订阅的事件执行一遍，并将$emit 对应传递的参数放进去。

#### 结束语

$emit 和 $on 是很经典的一种父子组件传递数据的方式，并且$emit和$on 也在 vue 中实现了 v-model 语法糖

## Vue.use 的源码实现

问题的产生？

最近在使用 element-ui 的时候，发现每当使用一个组件，都要 use 一次。然后我的代码就变成了这个样子。所以就像知道 vue.use 这个难道就没有类似数组操作的方法嘛？然后就别问看源码。

```js
Vue.use(Button)
Vue.use(DatePicker)
...
...
```

```js
export function initUse(Vue: GlobalAPI) {
    Vue.use = function(plugin: Function | Object) {
        const installedPlugins =
            this._installedPlugins || (this._installedPlugins = []);
        if (installedPlugins.indexOf(plugin) > -1) {
            return this;
        }

        // additional parameters
        const args = toArray(arguments, 1);
        args.unshift(this);
        if (typeof plugin.install === "function") {
            plugin.install.apply(plugin, args);
        } else if (typeof plugin === "function") {
            plugin.apply(null, args);
        }
        installedPlugins.push(plugin);
        return this;
    };
}
```

从上面的源码可以看出，vue.use 的方法是将一个传入的 plugin，直接  执行这个传入的函数，或者执行对象下面的函数。

下面是我们通常一个插件的模样

```js
// index.js

import Vue from "vue";

// 我们自身的vue组件
import component from "./component.vue";

export default {
    install(Vue, options = {}) {
        Vue.component("component", Vue.extend(component));
    }
};
```

对应我们的插件和导出，大致就可以看出我们一个正常插件的实现方法了。
