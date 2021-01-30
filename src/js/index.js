;(function ($, player) {
    function MusicPlayer(dom) {
        this.wrap = dom; //播放器的容器，用于加载listControl模块
        this.dataList = []; //存储请求到的数据
        // this.now = 1; //歌曲的索引
        this.indexObj = null; //索引值对象（用于切歌）
        this.rotateTimer = null; //专辑图片旋转的定时器
        this.list = null; //列表切歌对象（在listPlay中赋值）
    }

    MusicPlayer.prototype = {
        /** 初始化 */
        init: function () {
            this.getDom();
            this.getData('../mock/data.json');
        },
        /** 获取页面里的元素 */
        getDom: function () {
            this.record = document.querySelector('.songImg img'); //旋转图片
            this.controlBtns = document.querySelectorAll('.control li'); //底部导航里的按钮
        },
        /** 请求数据 */
        getData: function (url) {
            var This = this;
            $.ajax({
                url: url,
                method: "get",
                success: function (res) {
                    This.dataList = res; //存储请求过来的数据
                    
                    This.indexObj = new player.indexControl(res.length); //给索引值对象赋值

                    This.listPlay(); //“列表切歌listPlay”要放在loadMusic的前面，因为this.list对象是在该方法中声明的，要在loadMusic方法中使用

                    // This.loadMusic(This.now);
                    This.loadMusic(This.indexObj.curIndex);
                    This.controlMusic();
                },
                error: function () {
                    console.log('数据请求失败');
                }
            });
        },

        /** 加载音乐 */
        loadMusic: function (index) {
            var This = this;
            player.render(this.dataList[index]); //使用“渲染模块”
            player.music.loadMusic(this.dataList[index].audioSrc); //使用“音乐模块”加载音乐
            player.music.endMusicEvent(function () { //当前歌曲播放完后，自动切换到下一首
                player.music.status = 'play';
                This.loadMusic(This.indexObj.next());
            });
            player.progress.initTotalTime(this.dataList[index].duration); //初始化歌曲总时长

            // 使用“音乐模块”播放音乐（只有music对象的status值为play时才播放）
            if(player.music.status === 'play') {
                player.music.playMusic();
                this.controlBtns[2].className = 'playing';
                this.imgRotate(0); //切歌的时候旋转图片
                player.progress.start(); //开始实时渲染进度条
            }

            // 改变列表（this.list）中歌曲的选中状态
            this.list.changeSelect(index);
        },
        /** 控制音乐---绑定事件（上一首、暂停或播放、下一首）---使用“音乐模块” */
        controlMusic: function () {
            var This = this;
            // 上一首 
            this.controlBtns[1].addEventListener('touchend', function (ev) {
                player.music.status = 'play';
                // This.loadMusic(--This.now);
                This.loadMusic(This.indexObj.prev());
            });

            // 播放或暂停
            this.controlBtns[2].addEventListener('touchend', function (ev) {
                // 根据当前music对象的status判断是播放还是暂停
                if(player.music.status === 'play') {
                    player.music.pauseMusic();
                    player.music.status = 'pause';
                    this.className = '';
                    This.imgStop();
                    player.progress.stop(); //停止实时渲染进度条
                }else {
                    player.music.playMusic();
                    player.music.status = 'play';
                    this.className = 'playing';
                    This.imgRotate(This.record.dataset.rotate || 0); //传入上一次旋转的角度（若取不到该属性，则默认为0）
                    player.progress.start(); //开始实时渲染进度条
                }
            });

            // 下一首
            this.controlBtns[3].addEventListener('touchend', function (ev) {
                player.music.status = 'play';
                // This.loadMusic(++This.now);
                This.loadMusic(This.indexObj.next());
            });
        },
        /** 旋转专辑图片 */
        imgRotate: function (deg) {
            var This = this;
            clearInterval(this.rotateTimer);
            this.rotateTimer = setInterval(function () {
                deg = +deg + 0.2; //前面的“+”是将字符串转换为数字
                This.record.style.transform = 'rotate(' + deg + 'deg)';
                This.record.dataset.rotate = deg; //把旋转的角度存到标签身上，方便下次旋转时能够取到   
            }, 1000 / 60); //浏览器刷新频率是：60次/秒
        },
        /** 停止旋转专辑图片 */
        imgStop: function () {
            clearInterval(this.rotateTimer);
            this.rotateTimer = null;
        },
        /** 列表切歌 */
        listPlay: function () {
            this.list = player.listControl(this.dataList, this.wrap); //把listControl对象赋值给this.list
            var This = this;
            // 给列表按钮绑定点击事件
            this.controlBtns[4].addEventListener('touchend', function () {
                This.list.slideUp();
            });
            // 给歌曲列表中的每首歌曲绑定点击事件
            this.list.musicList.forEach(function (ele, index) {
                ele.addEventListener('touchend', function () {
                    // 如果点击的是当前正在播放或暂停的歌曲，则点击无效
                    if(This.indexObj.curIndex === index) {
                        return;
                    }else {
                        player.music.status = 'play'; //music对象的status变为播放状态
                        This.indexObj.curIndex = index; //更新索引值对象上的当前索引值
                        This.loadMusic(index); //加载对应的歌曲
                        This.list.slideDown(); //列表消失
                    }
                });
            });
        }
    }

    var musicPlayer = new MusicPlayer(document.getElementById('wrap'));
    musicPlayer.init();

})(window.Zepto, window.player);