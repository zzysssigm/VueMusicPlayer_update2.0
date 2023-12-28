# 基于Vue3的音乐播放器与其后端服务（1.4）

## 前置准备与文件结构说明

test为前端测试项目，vuemusicpalyer为前端，backend为后端。

### 后端部分：

实现了音乐储存与数据挂载的后端服务。

具体而言，是采用mongodb+express模块实现了简单的非SQL数据库。

<1>启动：

在backend文件夹中，打开终端输入：

```
node serveob
```

即可；

<2>清空数据库：

在backend文件夹中，打开终端输入：

```
node erase
```

即可；

<3>将本地文件读入数据库：

同理可以实现api读入，为了方便调试，该项目读入的是本地文件。

使用fs库实现，只需要在终端中输入本地文件所在的路径，即可将本地文件储存在数据库中。

backend中有用于测试的文件夹：/music，输入/music后会根据文件夹是否存在，读入是否成功，音乐文件是否已经存在等进行终端反馈。

<4>API挂载

通过将音乐文件信息挂载到API，使得前端更方便访问数据。

同时进行了cors跨域处理。



**package.json：**

```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "multer": "^1.4.5-lts.1"
  }
}
```



### 前端部分：

经典老三件：vscode，node.js，npm；

配置vue环境，可以参考：[Vue3.0（一）：创建Vue3项目-CSDN博客](https://blog.csdn.net/qq_23215957/article/details/115229225)

大部分内容会在项目功能说明中提到。

**package.json：**

```json
{
  "name": "the_player",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "bootstrap": "^5.3.2",
    "core-js": "^3.8.3",
    "vue": "^3.2.13"
  },
  "devDependencies": {
    "@babel/core": "^7.12.16",
    "@babel/eslint-parser": "^7.12.16",
    "@vue/cli-plugin-babel": "~5.0.0",
    "@vue/cli-plugin-eslint": "~5.0.0",
    "@vue/cli-service": "~5.0.0",
    "eslint": "^7.32.0",
    "eslint-plugin-vue": "^8.0.3"
  },
  "eslintConfig": {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/vue3-essential",
      "eslint:recommended"
    ],
    "parserOptions": {
      "parser": "@babel/eslint-parser"
    },
    "rules": {}
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead",
    "not ie 11"
  ]
}

```



## 项目功能说明：

### （1）启动

只需要在根目录下启动终端，输入如下命令即可：

```
npm run serve
```

### （2）基础功能

基础功能有：”点击目录播放“，”全部播放“和”暂停“，以及一个简单的进度条，和显示音乐进度的数字。

有两种方式导入音乐：第一种是通过上传本地文件夹导入，第二种则是通过获取后端服务的API实现。

### （3）单曲循环模式：

点击后，可以使当前歌曲播放完之后重新播放。

样式上，点击后框的背景色会变成深蓝。

### （4）暂停渐弱：

暂停后音量会在500ms内归零，起到一个缓冲作用。

暂停和切换歌曲时会触发。

更新：对渐弱效果进行了优化

具体而言：

```javascript
// 定义一个自定义函数，模拟先快后慢的渐弱效果
    function easeOutSine(t, b, c, d) {
      return c * Math.sin((t / d) * (Math.PI / 2)) + b;
    }
```

这样听着会更舒服一点。

### （5）“下一首播放”功能

点击歌曲前的加号即可；

### （6）显示“当前正在播放的歌曲”的功能

在进度条上显示当前播放的歌曲的名字；

### （7）CSS样式更新：

新增了使得按钮看上去很“Q弹”的动画特效，点击“下一首播放”的按钮即可看到效果；

### （8）搜索

添加了简单的搜索功能，可以通过搜索来选择自己心仪的歌曲。

点击搜索结果中的歌曲即可播放。

### （9）音量条

创建了一个简单的可交互音量条（与系统音量独立），通过拖曳实现音量变化。

### （10）预览图：

![image-20231221015751180](preview(1.3).png)

