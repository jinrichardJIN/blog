# computed详解

    var vm = new Vue({
      data:{
        index:1
      },
      computed:{
        indexPlusOne:function(){
          return this.index+1;
        },
        indexReduceOne:function(){
          return this.index-1;
        }
      }
    })

##### 当你看到这篇文章的时候，默认你是一个vue的熟练使用者，你已经清楚的了解computed的机制和应用场景，当然如果你还是一个vue的小白，那么本篇文章可能并不是很适合你，你更应该先知道你接下来要了解的是一个怎样的工具，那么让我们开始吧！！！

### 目录

 - computed是什么？
 - 初始化computed函数
 - 为什么this.data变化会告知computed this.computed变量
 - Dep是什么？
 - watcher是什么？
 - 我的疑问？？？ computed的更新视图，是在哪一步完成的
 
### computed是什么？

话不多说直接看源码
     
     function initComputed(vm: Component, computed: Object) {
      // $flow-disable-line
      const watchers = (vm._computedWatchers = Object.create(null));
      // computed properties are just getters during SSR
      const isSSR = isServerRendering();

      for (const key in computed) {
        const userDef = computed[key];
        const getter = typeof userDef === 'function' ? userDef : userDef.get;
        if (process.env.NODE_ENV !== 'production' && getter == null) {
          warn(`Getter is missing for computed property "${key}".`, vm);
        }

        if (!isSSR) {
          // create internal watcher for the computed property.
          watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
        }

        // component-defined computed properties are already defined on the
        // component prototype. We only need to define computed properties defined
        // at instantiation here.
        if (!(key in vm)) {
          defineComputed(vm, key, userDef);
        } else if (process.env.NODE_ENV !== 'production') {
          if (key in vm.$data) {
            warn(`The computed property "${key}" is already defined in data.`, vm);
          } else if (vm.$options.props && key in vm.$options.props) {
            warn(`The computed property "${key}" is already defined as a prop.`, vm);
          }
        }
      }
    }

相信这段代码，大家都能清楚的找到它所处在的位置。看完上面的代码我们主要知道`initComputed`这个函数主要的功能是
    
    1. watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions);
   
和

    2. defineComputed(vm, key, userDef);
    
首先我们先看上看的 **1** 这个函数，从函数的实现，我们大概清楚的是，`watchers`这个集合，存储着`Watcher`函数实例化的集合，并且传入了4个参数，我们先分析这四个函数

  - vm 当然是我们的实例
  
  - getter 
  
    `const getter = typeof userDef === 'function' ? userDef : userDef.get;`知道getter代表这我们this.computed中`indexReduceOne`和`indexPlusOne`的函数
    
  - noop 
  
      `export function noop (a?: any, b?: any, c?: any) {}`,noop就是一个函数**（理解的不对的地方，欢迎指正）**
	  
  - computedWatcherOptions
  
  	  `const computedWatcherOptions = { lazy: true };`是一个拥有lazy为true的对象。
			 
我们大概知道这4个参数代表的涵义，这里我们跳过去分析Watcher函数做了什么，因为我们会在下面Watcher是什么在进行细致的分析。

我们继续看**2**函数
  
   - vm 当然还是我们的实例
	 
	 - key 和 userDef 分别是 computed下面的函数名和函数

下面是 **defineComputed**
	
	export function defineComputed(target: any, key: string, userDef: Object | Function) {
		const shouldCache = !isServerRendering();
		if (typeof userDef === 'function') {
			sharedPropertyDefinition.get = shouldCache ? createComputedGetter(key) : userDef;
			sharedPropertyDefinition.set = noop;
		} else {
			sharedPropertyDefinition.get = userDef.get
				? shouldCache && userDef.cache !== false
					? createComputedGetter(key)
					: userDef.get
				: noop;
			sharedPropertyDefinition.set = userDef.set ? userDef.set : noop;
		}
		if (process.env.NODE_ENV !== 'production' && sharedPropertyDefinition.set === noop) {
			sharedPropertyDefinition.set = function() {
				warn(`Computed property "${key}" was assigned to but it has no setter.`, this);
			};
		}
		Object.defineProperty(target, key, sharedPropertyDefinition);
	}

这里大概知道`defineComputed`它是一个工具型函数，我们关注的仍是主要代码

		3. sharedPropertyDefinition.get = shouldCache ? createComputedGetter(key) : userDef;
		4. Object.defineProperty(target, key, sharedPropertyDefinition);

**3**函数中有`shouldCache`从意思上我们可以得知，缓存的意思。这里涉及到computed很重要的一个特点缓存，**重要**下面是官方的原话

> 我们可以将同一函数定义为一个方法而不是一个计算属性。两种方式的最终结果确实是完全相同的。然而，不同的是计算属性是基于它们的依赖进行缓存的。只在相关依赖发生改变时它们才会重新求值。这就意味着只要 message 还没有发生改变，多次访问 reversedMessage 计算属性会立即返回之前的计算结果，而不必再次执行函数。

这里我们可以知道了，`defineComputed`这个函数主要是为了在vm这个实例下面增加 `vm.indexReduceOne`和 `vm.indexPlusOne`这两个属性，这两个属性的get分别是在this.computed中对应的两个函数。

    
    
