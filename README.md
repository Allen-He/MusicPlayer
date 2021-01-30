# MusicPlayer 项目总结（移动端网页）
**项目效果预览**：https://allen-he.github.io/MusicPlayer/dist/html/index.html

**项目技术栈**：HTML+CSS、LESS、原生JS、自动化构建工具Gulp、mock.js(模拟数据)、gaussBlur.js(高斯模糊工具库)、Zeptol.js(类似于jquery且体积较小的第三方库，该项目旨在使用其中封装的ajax请求)

**项目开发思想**：使用立即执行函数等 模拟实现 模块化开发（面向对象、面向过程）

**项目思路**：

1. 使用 HTML+CSS、LESS 构建静态页面（主要使用了LESS中的嵌套语法）

2. 根据“模块化开发思想”对整个项目进行模块划分：高斯模糊模块（gaussBlur.js）、渲染模块（render.js）、音乐模块（audio.js）、索引控制模块（indexControl.js）、列表切歌模块（listControl.js）、进度条模块（progress.js）、整体逻辑控制（index.js）

3. 根据以上的模块划分，依次实现各模块的具体功能，在开发具体各个小模块的同时要配合index.js进行联合调试及开发

**项目亮点**：
1. 使用如下方法将各模块的API暴露到全局对象window的player属性上，方便项目中各功能模块的相互调用（index.js在调用各模块时只需要关心如何使用，不需要关心模块的具体实现）
```js
(function(root){
    function render() {
      //...
    }
    root.render = render;
})(window.player || (window.player = {}));
```
2. 使用Zeptol.js中封装ajax请求以动态获取歌曲的相关数据（类似于jquery）
3. 面向对象开发（audio.js、indexControl.js、progress.js）与面向过程开发（render.js、listControl.js）的灵活运用
4. 合理地运用“this指向”的原理进行开发
5. 对H5新增的Audio对象的应用
# MusicPlayer
