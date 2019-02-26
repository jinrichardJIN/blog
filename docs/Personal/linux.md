# linux

## 常用命令

###

####

#### 1.查看端口号

- netstat -tlnp
- netstat - anp|grep 80  ()


#### 2.文件操作

- vim /test/index.html
- :q (直接退出)
- :q! (强制退出)
- :wq (保存退出)
- :wq! (强制)

#### 3.连接远程服务器
- ssh root@0.0.0.0


#### 4.上传文件
- scp

#### 5.查看进程
- netstat -apn | grep 3000（查看指定的端口pid最好一列）


#### 6.杀死进程
- kill -9 pid（根据pid杀死进程）
- 