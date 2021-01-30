;(function (root) {
    // 进度条
    function Progress() {
        this.frameId = null; //存储requestAnimationFrame的ID
        this.total

        this.init();
    }

    Progress.prototype = {
        init: function () {
            this.getDom();
            this.initDrag();
        },
        /** 获取DOM元素 */
        getDom: function () {
            this.curTimeDom = document.querySelector('.curTime');
            this.totalTimeDom = document.querySelector('.totalTime');
            this.frontBgDom = document.querySelector('.frontBg');
            this.circleDom = document.querySelector('.circle');
            this.dragDom = document.querySelector('.drag'); //进度条的父级元素
        },
        /** 初始化歌曲总时长（供外部调用---需传入获取到的歌曲的总时长---必须在加载音乐后提前调用一次） */
        initTotalTime: function (time) {
            this.totalTime = time;
            this.totalTimeDom.innerHTML = this.formatTime(time);
        },
        /** 开始渲染 */
        start: function () {
            cancelAnimationFrame(this.frameId);

            var frame = () => {
                // console.log('hhh');
                this.curTime = root.music.getCurTime();
                this.totalTime = root.music.getTotalTime();
                this.per = this.curTime / this.totalTime; //当前时间所占总时长的百分比

                if (this.per <= 1) {
                    //这个条件成立说明当前歌曲还没有播放完
                    this.render();
                } else {
                    //走到这里说明歌曲已经播放了100%了，停止播放（关掉定时器）
                    cancelAnimationFrame(this.frameId);
                }
    
                this.frameId = requestAnimationFrame(frame);
            }
            frame();
        },
        /** 停止渲染 */
        stop: function () {
            cancelAnimationFrame(this.frameId);
        },
        /** 渲染curTime、totalTime、frontBg和circle的位置 */
        render: function () {
            this.curTimeDom.innerHTML = this.formatTime(this.curTime || 0);
            this.totalTimeDom.innerHTML = this.formatTime(this.totalTime || 0);

            this.frontBgDom.style.width = (this.per * 100) + '%';
            this.circleDom.style.transform = 'translate(' + (this.per * this.dragDom.offsetWidth) + 'px)';
        },
        /** 格式化时间 */
        formatTime: function (time) {
            time = Math.round(time);

            //266
            var m = Math.floor(time / 60);  //分钟
            var s = time % 60;  //秒钟

            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;

            return m + ':' + s;
        },

        /** 拖拽 */
        initDrag: function () {
            var dragWidth = this.dragDom.offsetWidth;
            var dragLeftDis = this.curTimeDom.offsetWidth;
            var This = this;

            // 给circleDom按钮绑定“拖拽”相关事件
            this.circleDom.ontouchstart = function (ev) {
                var disX = 0; //记录拖拽距离
                var disPer = 0;  //记录拖拽距离所占总长度的百分比
                
                document.ontouchmove = function (ev) {
                    This.stop(); //当拖拽开始时，停止实时渲染功能（若歌曲正在播放）

                    disX = ev.changedTouches[0].pageX - dragLeftDis;
                    if(disX <= 0) {
                        disX = 0;
                    }else if(disX >= dragWidth) {
                        disX = dragWidth;
                    }
                    disPer = disX / dragWidth;

                    This.circleDom.style.transform = 'translate(' + disX + 'px)';
                    This.frontBgDom.style.width = (disPer * 100) + '%';
                    This.curTimeDom.innerHTML =  This.formatTime(disPer * This.totalTime);
                }

                document.ontouchend = function () {
                    player.music.turnMusicTo(disPer * This.totalTime);
                    This.start(); //当拖拽结束时，开启实时渲染功能（若歌曲正在播放）
                    
                    document.ontouchmove = null; //注销该事件
                    document.ontouchend = null; //注销该事件
                }
            }

            // 给dragDom绑定点击事件---调整歌曲播放进度
            this.dragDom.ontouchend = function (ev) {
                var disX = ev.changedTouches[0].pageX - dragLeftDis;
                var disPer = disX / dragWidth;
                
                This.circleDom.style.transform = 'translate(' + disX + 'px)';
                This.frontBgDom.style.width = (disPer * 100) + '%';
                This.curTimeDom.innerHTML =  This.formatTime(disPer * This.totalTime);
                player.music.turnMusicTo(disPer * This.totalTime);
            }
        }
    }

    root.progress = new Progress();

})(window.player || (window.player = {}));