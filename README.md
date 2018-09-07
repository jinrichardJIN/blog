     function Express(){
          let fns = [];

          let app = function(req,res){
            let i = 0;
            let next = function(){
              i++;
              if(i>=fns.length){
                return;
              }
              fns[i](req,res,next);
            }
            fns[0](req,res,next);
          }
          app.use = function(fn){
            fns.push(fn);
          }
          return app;
        }

        var app = Express();

        http.createServer(app).listen(3000,()=>{
          console.log('port 3000 is running')
        })

        /*
        middleware list
        */

        function middleware1(req, res, next) {
          console.log('1 is starting');
          next();
          console.log('1 is ending');
        }
        function middleware2(req, res, next) {
          console.log('2 is starting');
          next();
          console.log('2 is ending');
        }
        function middleware3(req, res, next) {
          console.log('3 is starting');
          next();
          console.log('3 is ending');
        }
        app.use(middleware1);
        app.use(middleware2);
        app.use(middleware3);
