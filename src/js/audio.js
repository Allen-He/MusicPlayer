// 音乐模块
;(function (root) {
    function AudioManage() {
        this.audio = new Audio(); //创建一个Audio实例
        this.status = 'pause'; //记录当前Audio实例对象的状态（播放or暂停）
    }
    AudioManage.prototype = {
        /** 加载音乐（暴露） */
        loadMusic: function (src) {
            this.audio.src = src; //设置音乐的路径
            this.audio.load(); //加载音乐（Audio对象的方法）
        },
        /** 播放音乐（暴露） */
        playMusic: function () {
            this.audio.play(); //播放音乐（Audio对象的方法）
            this.status = 'play';
        },
        /** 暂停音乐（暴露） */
        pauseMusic: function () {
            this.audio.pause(); //暂停音乐（Audio对象的方法）
            this.status = 'pause';
        },
        /** 音乐播放完成 --- 触发的事件（暴露） */
        endMusicEvent: function (fn) {
            this.audio.onended = fn;
        },
        /** 跳到音乐的某个时间点（暴露） */
        turnMusicTo: function (time) {
            this.audio.currentTime = time; //time的单位为：秒
        },
        /** 获取当前播放的时间 */
        getCurTime: function () {
            return this.audio.currentTime; //单位为：秒
        },
        /** 获取当前音乐的总时长 */
        getTotalTime: function () {
            return this.audio.duration; //单位为：秒
        }
    }

    root.music = new AudioManage(); //把Audio实例对象暴露出去，外面可以使用其原型上的方法

})(window.player || (window.player = {}));