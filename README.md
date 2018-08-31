richard blog
- 问题的产生？
  最近在使用element-ui的时候，发现每当使用一个组件，都要use一次。然后我的代码就变成了这个样子。
  <img src='https://github.com/jinrichardJIN/blog/blob/master/images/vue/use1.jpeg?raw=true'>
  这对于强迫症的我，肯定是不能忍的，所以我就好奇，Vue.use难道不支持这个方法，所以我决心去看源码

### Vue.use代码很容易找到，网上也很多，如下

    import { toArray } from '../util/index'
    export function initUse (Vue: GlobalAPI) {
      Vue.use = function (plugin: Function | Object) {
        const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
        if (installedPlugins.indexOf(plugin) > -1) {
          return this
        }

        // additional parameters
        const args = toArray(arguments, 1)
        args.unshift(this)
        if (typeof plugin.install === 'function') {
          plugin.install.apply(plugin, args)
        } else if (typeof plugin === 'function') {
          plugin.apply(null, args)
        }
        installedPlugins.push(plugin)
        return this
      }
    }
    
 可以看到use的代码，非常的简介简单。参数可以是对象，也可以是函数，但是会在安装之前判断有没有安装过通过_installedPlugins这样一个数组。这里有`toArray这个方法`，我们先看下这个方法。
 
 ### toArray
 
    export function toArray (list: any, start?: number): Array<any> {
      start = start || 0
      let i = list.length - start
      const ret: Array<any> = new Array(i)
      while (i--) {
        ret[i] = list[i + start]
      }
      return ret
    }
  `toArray`这个方法返回的是一个处理过的数组，截取了第一个参数，保留后面参数的数组。
  
### 分割线出来

这里注意的是有的plugin是通过install传入的，有的直接传入，不过都要记得需要将Vue的构造函数当作第一个参数给到我们的插件。

### 下面vue-router的构造函数

 




