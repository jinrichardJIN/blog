# git 相关操作

#### 起因

因为今天和同事的交流中，发现自己在git的相关技术上，真的是很薄弱，导致经常犯一些错误。其实很多都是我们平时的基础，稍微理解就可以避免的

##### git rebase(变基)

首先要接触这个命令我们先要理解，这个操作出现是为了干什么，要知道我们在开源的项目中，假设是vue，react。master分支每一次的commit，都应该是具有一定意义或者新功能的发布，所以在master上，我们尽量让commit的直接对应某一个需求，或者修复一个重大bug。

但其实这些大型的多人开发的项目，master只对应一个，但是其实每一个开源工作者，都不可能在master上面开发，都会有自己的分支，而且每一位开发者在自己的分支上开发不可能只有一次commit，可能会有很多commit。所以当我们merge到master的时候，会将我们自己本地一些不必要的commitmerge到master上。所以我们就希望，在merge到master之前，将我们的commit整合为一个commit对应一个说明。rebase就是为了解决这个问题的。
其中rebase有几个常用的参数
[参考文章](https://git-scm.com/docs/git-rebase)

##### git reset git revert

git reset 具有三个常见的命令 --hard --soft --mixed

- git reset HEAD^ 回到上次
- git reset HEAD [hash] 回到某一个commit对应的hash
- git reset HEAD~[num] 如1，2，3前几次

--hard 是回到某一个commit 本地文件不会存在
--soft 只是删除的自己当前的commit 但是本地文件都仍然存在，可以重新commit 也就是文件都回到了commit之前的状态。

这里面如果我们不小心将本地commit 也push到远程的分支，所以当我们本地reset的时候，会和远程分支缺少一个commit记录，远程分支会认为我们需要pull，这里肯定不是我们想要的，所以只需要重新 push -f 强制推一次commit去远程，就可以pull去掉。因为本地和远程对应是根据head的指针来判定的。

git revert 是会直接回到某一个commit 并且舍弃本地文件，重新提交一个commit记录。

##### git stash 
当我们平时不小心在master分支上面开发的时候，我们需要checkout 到我们自己的分支上，所以这个是需要将我们工作区的文件给stash起来，然后git checkout 自己的分支时候 重新apply

##### git log git reflog glol

git log 是看当前提交日志
git reflog 是看所有的log 以方便我们回到某一次commit
glol

##### git checkout
git checkout origin/test:空分支 就可以将远程的分支删除
git checkout 本地文件 就可以将一个文件检出 类似github Desktop的discard忽略
git checkout -b 