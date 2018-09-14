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
        },
		ImObject:{
          get(){

          },
          set(){

          }
		}
      }
    })

##### 当你看到这篇文章的时候，默认你是一个vue的熟练使用者，你已经清楚的了解computed的机制和应用场景，当然如果你还是一个vue的小白，那么本篇文章可能并不是很适合你，你更应该先知道你接下来要了解的是一个怎样的工具，那么让我们开始吧！！！
##### vue的代码精彩并不仅仅在每一个函数的实现上，而是对这些函数的分工的考虑，更值得我们去学习。

### 目录

 - computed是什么？ 源头**initComputed**
 - 初始化computed函数
 - watcher是什么？
 - 为什么this.data变化会告知computed this.computed变量 源头**initData**
 - Dep是什么？
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

这里大概知道`defineComputed`它是一个工具型函数，我们关注的仍是主要代码。

	3. sharedPropertyDefinition.get = shouldCache ? createComputedGetter(key) : userDef;
	4. Object.defineProperty(target, key, sharedPropertyDefinition);

**3**函数中有`shouldCache`从意思上我们可以得知，缓存的意思。这里涉及到computed很重要的一个特点缓存，**重要**下面是官方的原话

> 我们可以将同一函数定义为一个方法而不是一个计算属性。两种方式的最终结果确实是完全相同的。然而，不同的是计算属性是基于它们的依赖进行缓存的。只在相关依赖发生改变时它们才会重新求值。这就意味着只要 message 还没有发生改变，多次访问 reversedMessage 计算属性会立即返回之前的计算结果，而不必再次执行函数。

这里我们可以知道了，`defineComputed`这个函数主要是为了在vm这个实例下面增加 `vm.indexReduceOne`和 `vm.indexPlusOne`这两个属性，这两个属性的get分别是在this.computed中对应的两个函数。

继续看**createComputedGetter**这个函数 
  
    function createComputedGetter(key) {
      return function computedGetter() {
        const watcher = this._computedWatchers && this._computedWatchers[key];
        if (watcher) {
          if (watcher.dirty) {
            watcher.evaluate();
          }
          if (Dep.target) {
            watcher.depend();
          }
          return watcher.value;
        }
      };
    }
`createComputedGetter`函数可能是最不容易理解那个，暂且我们先不去解释watcher下面的几个函数概念，会在分析`Watcher`的时候分别回来解释这些函数的用途。
	
这段代码是我们的代码的结束，`return watcher.value` 也就是我们计算属性的`get`返回值。也是我们分析`InitComputed`结束，我们先大致总结下这个函数主要做了哪些事。

- 将我们this.computed下面的计算属性分别实例一个watcher对象放到`this._computedWatchers`数组里面。
- 将我们this.computed下面的每一个计算属性都定义在vm这个实例对象下面，并且这个属性的get就是我们计算属性函数。**这里也就是为什么computed属性对应的一定要是函数，要不然就是拥有get的对象**


	
### Watcher是什么

在分析Watcher这段代码之前，我们只关注和computed有主要关系的代码片段，小伙伴一定手边要有一份源码，这样才能感受到和我处在同一个时空！！！

- constructor构造函数

	  constructor
	  (
		vm: Component,
		expOrFn: string | Function,
		cb: Function,
		options?: ?Object,
		isRenderWatcher?: boolean
	  ) {
		this.vm = vm
		if (isRenderWatcher) {
		  vm._watcher = this
		}
		vm._watchers.push(this)
		// options
		if (options) {
		  this.deep = !!options.deep
		  this.user = !!options.user
		  this.lazy = !!options.lazy
		  this.sync = !!options.sync
		} else {
		  this.deep = this.user = this.lazy = this.sync = false
		}
		this.cb = cb
		this.id = ++uid // uid for batching
		this.active = true
		this.dirty = this.lazy // for lazy watchers
		this.deps = []
		this.newDeps = []
		this.depIds = new Set()
		this.newDepIds = new Set()
		this.expression = process.env.NODE_ENV !== 'production'
		  ? expOrFn.toString()
		  : ''
		// parse expression for getter
		if (typeof expOrFn === 'function') {
		  this.getter = expOrFn
		} else {
		  this.getter = parsePath(expOrFn)
		  if (!this.getter) {
			this.getter = function () {}
			process.env.NODE_ENV !== 'production' && warn(
			  `Failed watching path: "${expOrFn}" ` +
			  'Watcher only accepts simple dot-delimited paths. ' +
			  'For full control, use a function instead.',
			  vm
			)
		  }
		}
		this.value = this.lazy
		  ? undefined
		  : this.get()
	  }
构造函数和computed主要片段

### 分割线 记录搁置了好几天。。。。。/真的好烦哦！！！！

	// 记住这个getter
	this.getter = expOrFn 
	
	// 这里第一次不会执行this.get() 但是我们还是会在下面介绍get这个函数
	this.value = this.lazy
		  ? undefined
		  : this.get()
		  
### Watcher.get

	get () {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }
很简洁的代码，但是确实有一个非常巧妙的实现。

	// 这个会在下面讲到
	pushTarget(this)
	
	// 在赋值的同时，同样会执行this.getter这个函数，具体可以看下call的用法。
	value = this.getter.call(vm, vm)

很重要的一点***重要***在执行this.getter函数的同时，同样会进行对data内部的属性进行访问，也就这是在这里***这里***，实现了computed的对data属性的订阅。

	
### 为什么this.data变化会告知computed this.computed变量？

同样我们直接去看data.getter做了哪些操作，同样的套路我们看InitData，不过我们主要还是看Data的getter所以，不对initData这个函数进行细致分析。

	function initData(vm: Component) {
	  let data = vm.$options.data;
	  data = vm._data = typeof data === 'function' ? getData(data, vm) : data || {};
	  if (!isPlainObject(data)) {
		data = {};
		process.env.NODE_ENV !== 'production' &&
		  warn(
			'data functions should return an object:\n' +
			  'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
			vm
		  );
	  }
	  // proxy data on instance
	  const keys = Object.keys(data);
	  const props = vm.$options.props;
	  const methods = vm.$options.methods;
	  let i = keys.length;
	  while (i--) {
		const key = keys[i];
		if (process.env.NODE_ENV !== 'production') {
		  if (methods && hasOwn(methods, key)) {
			warn(`Method "${key}" has already been defined as a data property.`, vm);
		  }
		}
		if (props && hasOwn(props, key)) {
		  process.env.NODE_ENV !== 'production' &&
			warn(`The data property "${key}" is already declared as a prop. ` + `Use prop default value instead.`, vm);
		} else if (!isReserved(key)) {
		  proxy(vm, `_data`, key);
		}
	  }
	  // observe data
	  observe(data, true /* asRootData */);
	}
看主要代码
 	
	observe(data, true /* asRootData */);
	
##### observer
	
	export function observe (value: any, asRootData: ?boolean): Observer | void {
	  if (!isObject(value) || value instanceof VNode) {
		return
	  }
	  let ob: Observer | void
	  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
		ob = value.__ob__
	  } else if (
		shouldObserve &&
		!isServerRendering() &&
		(Array.isArray(value) || isPlainObject(value)) &&
		Object.isExtensible(value) &&
		!value._isVue
	  ) {
		ob = new Observer(value)
	  }
	  if (asRootData && ob) {
		ob.vmCount++
	  }
	  return ob
	}
	
#### Observer

	export class Observer {
	  value: any;
	  dep: Dep;
	  vmCount: number; // number of vms that has this object as root $data

	  constructor (value: any) {
		this.value = value
		this.dep = new Dep()
		this.vmCount = 0
		def(value, '__ob__', this)
		if (Array.isArray(value)) {
		  const augment = hasProto
			? protoAugment
			: copyAugment
		  augment(value, arrayMethods, arrayKeys)
		  this.observeArray(value)
		} else {
		  this.walk(value)
		}
	  }

	  /**
	   * Walk through each property and convert them into
	   * getter/setters. This method should only be called when
	   * value type is Object.
	   */
	  walk (obj: Object) {
		const keys = Object.keys(obj)
		for (let i = 0; i < keys.length; i++) {
		  defineReactive(obj, keys[i])
		}
	  }

	  /**
	   * Observe a list of Array items.
	   */
	  observeArray (items: Array<any>) {
		for (let i = 0, l = items.length; i < l; i++) {
		  observe(items[i])
		}
	  }
	}
	
#### defineReactive重头戏代码

	export function defineReactive (
	  obj: Object,
	  key: string,
	  val: any,
	  customSetter?: ?Function,
	  shallow?: boolean
	) {
	  const dep = new Dep()

	  const property = Object.getOwnPropertyDescriptor(obj, key)
	  if (property && property.configurable === false) {
		return
	  }

	  // cater for pre-defined getter/setters
	  const getter = property && property.get
	  if (!getter && arguments.length === 2) {
		val = obj[key]
	  }
	  const setter = property && property.set

	  let childOb = !shallow && observe(val)
	  Object.defineProperty(obj, key, {
		enumerable: true,
		configurable: true,
		get: function reactiveGetter () {
		  const value = getter ? getter.call(obj) : val
		  if (Dep.target) {
			dep.depend()
			if (childOb) {
			  childOb.dep.depend()
			  if (Array.isArray(value)) {
				dependArray(value)
			  }
			}
		  }
		  return value
		},
		set: function reactiveSetter (newVal) {
		  const value = getter ? getter.call(obj) : val
		  /* eslint-disable no-self-compare */
		  if (newVal === value || (newVal !== newVal && value !== value)) {
			return
		  }
		  /* eslint-enable no-self-compare */
		  if (process.env.NODE_ENV !== 'production' && customSetter) {
			customSetter()
		  }
		  if (setter) {
			setter.call(obj, newVal)
		  } else {
			val = newVal
		  }
		  childOb = !shallow && observe(newVal)
		  dep.notify()
		}
	  })
	}

我们主要看上面的`get`函数里面实现了什么
 
 	const dep = new Dep()
 	...
	get: function reactiveGetter () {
	  const value = getter ? getter.call(obj) : val
	  if (Dep.target) {
		dep.depend()
		if (childOb) {
		  childOb.dep.depend()
		  if (Array.isArray(value)) {
			dependArray(value)
		  }
		}
	  }
	  return value
	}

 上面的代码中，每当去定义data的属性的时候，都会 `const dep = new Dep()` 然后根据`Dep.target`这个变量来执行下面的`dep.depend()`；我们继续看Dep函数是什么？
### Dep
	
	export default class Dep {
	  static target: ?Watcher;
	  id: number;
	  subs: Array<Watcher>;

	  constructor () {
		this.id = uid++
		this.subs = []
	  }

	  addSub (sub: Watcher) {
		this.subs.push(sub)
	  }

	  removeSub (sub: Watcher) {
		remove(this.subs, sub)
	  }

	  depend () {
		if (Dep.target) {
		  Dep.target.addDep(this)
		}
	  }

	  notify () {
		// stabilize the subscriber list first
		const subs = this.subs.slice()
		for (let i = 0, l = subs.length; i < l; i++) {
		  subs[i].update()
		}
	  }
	}

	// the current target watcher being evaluated.
	// this is globally unique because there could be only one
	// watcher being evaluated at any time.
	Dep.target = null
	const targetStack = []

	export function pushTarget (_target: ?Watcher) {
	  if (Dep.target) targetStack.push(Dep.target)
	  Dep.target = _target
	}

	export function popTarget () {
	  Dep.target = targetStack.pop()
	}
Dep函数的代码虽然不多，但是确实vue双向绑定的实现精妙之处。
还记得我们上面的Watcher类中get函数下面的`pushTarget(this)`这个方法嘛？可以知道Dep.target此时应该就是我们的`computed`上面的属性的watcher的实例。那么此时就和data下面的属性进行了一个依赖。
	
	  addDep (dep: Dep) {
		const id = dep.id
		if (!this.newDepIds.has(id)) {
		  this.newDepIds.add(id)
		  this.newDeps.push(dep)
		  if (!this.depIds.has(id)) {
			dep.addSub(this)
		  }
		}
	  }
那么data属性的实例的dep对象下面的`this.subs`就拥有了computed下面这个属性的watcher了。


### 对上面进行一个总结











    
    
