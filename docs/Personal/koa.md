# koa 中间件

### 一个常见的应用通常是长下面这样

```js
import Koa from "koa";
const app = new Koa();
app.use(bodyParser());
app.use(cors());
app.use(route.routes());
app.use(route.allowedMethods());
app.listen(3003);
```

### 首先我们分析 Koa 这个函数

1. 我们打开我们的 node_module 找到了我们的 koa 这个库，然后依照顺藤摸瓜的道理，我们找到了`package.json`下面这个 main.js

    <div align="center">
    <img width="80%" src="https://github.com/jinrichardJIN/blog/blob/master/images/koa/mainJs.jpeg?raw=true"/>
    </div>

2. 然后我们打开`lib/application.js`看到下面默认导出了一个类，很明显这个东西就是我们熟知的 Koa
   图片
3. 然后我们就看到了我们熟知的`listen` 和 `use` ，由于是分析中间件，所以其它代码不做分析。

### 在分析下面 listen 和 use 方法的时候，我们需要知道的是，中间件的作用。官方的说法是，中间是介于请求和响应之前的一些列操作。

#### listen 是什么

```js
function listen(...args) {
    debug("listen");
    const server = http.createServer(this.callback());
    return server.listen(...args);
}
```

可以看到 listen 正如 koa2 的官网所说的一样，是 http.createServer()的语法糖，并且可以支持同时监听多个应用。
这里会在 createServer(function(req,res){}),变为了 this.callback(),下面我们再看看 callback

#### callback

```js
function callback() {
    const fn = compose(this.middleware);
    if (!this.listenerCount("error")) this.on("error", this.onerror);
    const handleRequest = (req, res) => {
        const ctx = this.createContext(req, res);
        return this.handleRequest(ctx, fn);
    };
    return handleRequest;
}
```

这里首先将所有的中间件`this.middleware`交给了 compose 这个函数，这个函数是 koa-compose 提供的一个函数，我们稍后分析。
this.callback()的返回至是 handleRequest 这个函数,handleRequest 这个函数很直观的符合我们上面的 createServer 中的函数，但是`handleRequest`的内部为什么是

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

#### createContext

```js
function createContext(req, res) {
    const context = Object.create(this.context);
    const request = (context.request = Object.create(this.request));
    const response = (context.response = Object.create(this.response));
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
}
```

`createContext()`结果返回一个对象，从这里可以得知，这就是我们 koa2 包装的上下文。

#### handleRequest 是什么

可以看到，callback()最终返回的还是 handleRequet

```js
function handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = err => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    return fnMiddleware(ctx)
        .then(handleResponse)
        .catch(onerror);
}
```

` this.handbleRequest``fnMiddleware(ctx) `这样有一个函数执行结果，这个函数也正是依次将上下文传递到每一个中间件中。最终返回的是 Promise.resolve();

#### compose 是什么

上面说过 compose 是 koa-compose 的一个库，我不仅再次顺藤摸瓜，怀着忐忑的心情，打开了这个文件，看到只有 60 多行，啊啊啊啊，放心了，几百行的源码容易看哭宝宝有没有。下面源码

```js
function compose(middleware) {
    if (!Array.isArray(middleware))
        throw new TypeError("Middleware stack must be an array!");
    for (const fn of middleware) {
        if (typeof fn !== "function")
            throw new TypeError("Middleware must be composed of functions!");
    }

    /**
     * @param {Object} context
     * @return {Promise}
     * @api public
     */

    return function(context, next) {
        // last called middleware #
        let index = -1;
        return dispatch(0);
        function dispatch(i) {
            if (i <= index)
                return Promise.reject(
                    new Error("next() called multiple times")
                );
            index = i;
            let fn = middleware[i];
            if (i === middleware.length) fn = next;
            if (!fn) return Promise.resolve();
            try {
                return Promise.resolve(
                    fn(context, function next() {
                        return dispatch(i + 1);
                    })
                );
            } catch (err) {
                return Promise.reject(err);
            }
        }
    };
}
```

同样跳过上面两个对 middleware 的验证，compose 函数返回的是一个带着两个参数的匿名函数，是不是和下面的很像，没错这正式我们的常使用中间件的方式

```js
app.use(function(ctx, next) {});
```

compose()最终执行的结果始终是一个一个 promise 对象，依次执行中间件，这里有一个`function next`函数，这个函数是我们自己封装中间件的一个 next，也就是意味着，每个中间件的逻辑执行到 next(),会将执行权交给下一个中间件，然后等待所以中间件执行结束之后，栈式执行每个中间件后续的逻辑。这里借用一个张很经典的图

<img src="http://img.php.cn/upload/article/000/000/007/7e9dc74241b557e7c0b26bcd2dac4426-0.png">,

初接触者理解这个图很不知道所云，这里可以先看一下**<a href="https://github.com/jinrichardJIN/blog/issues/7">自己手动实现一个中间件</a>**方便你的理解。

#### use 是什么

```js
function use(fn) {
    if (typeof fn !== "function")
        throw new TypeError("middleware must be a function!");
    if (isGeneratorFunction(fn)) {
        deprecate(
            "Support for generators will be removed in v3. " +
                "See the documentation for examples of how to convert old middleware " +
                "https://github.com/koajs/koa/blob/master/docs/migration.md"
        );
        fn = convert(fn);
    }
    debug("use %s", fn._name || fn.name || "-");
    this.middleware.push(fn);
    return this;
}
```

呐尼！！！，为什么处理中间件 use 代码这么少？有一点不太对劲，不管了，先分析再说。
首先 use 和我们常见的一样，接受一个 fn 函数，前面两个 if 分别是对 fn 的类型和是否是 koa1 的 generator 进行验证，因为 koa1 是使用 generator 这种方式封装中间件

```js
app.use(\*function(req,res,next){
yeild next()
})
```

如果是 generator 那么通过 convert 转化为 es6 支持的 async 函数。
最终将这些函数 fn 通过`this.middleware.push(fn);`放入`this.middleware`数组中。然后返回 app 这个实例。
