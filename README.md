  
  # comouted实现原理
  
  目录:
   - 什么是computed
  
  
  
  
  ## 什么是computed
  
    var vm = new Vue({
      el: '#example',
      data: {
        message: 'Hello'
      },
      computed: {
        // 计算属性的 getter
        reversedMessage: function () {
          // `this` 指向 vm 实例
          return this.message.split('').reverse().join('')
        }
      }
    })
   像上面的一个经典的例子就是我们常用的computed，
   
