;(function (root) {
    function listControl(data, wrap) {
        var list = document.createElement('div'),
            title = document.createElement('div'),
            dl = document.createElement('dl'),
            close = document.createElement('div'),
            musicList = []; //存储所有歌曲对应的DOM对象
        
        list.className = 'list';
        title.className = 'title';
        title.innerHTML = '播放列表';
        close.className = 'close';
        close.innerHTML = '关闭';

        list.appendChild(title);
        data.forEach(function (ele, index) {
            var dd = document.createElement('dd');
            dd.innerHTML = ele.name;
            // 给每个dd标签绑定点击事件   
            dd.addEventListener('touchend', function () {
                changeSelect(index);
            });
            var span = document.createElement('span');
            span.innerHTML = ele.singer;
            dd.appendChild(span);

            dl.appendChild(dd);
            musicList.push(dd);
        });

        list.appendChild(dl);
        list.appendChild(close);
        wrap.appendChild(list);

        changeSelect(0); //默认让第一首歌为选中状态

        var disY = list.offsetHeight;
        list.style.transform = 'translateY(' + disY + 'px)';

        /** 列表滑动显示 */
        function slideUp() {
            list.style.transition = '.2s';
            list.style.transform = 'translateY(0)';
        }
        /** 列表滑动隐藏 */
        function slideDown() {
            list.style.transition = '.2s';
            list.style.transform = 'translateY(' + disY + 'px)';
        }

        // 给关闭按钮绑定点击事件
        close.addEventListener('touchend', function () {
            slideDown();
        });

        /** 切换选中元素 */
        function changeSelect(index) {
            for(var i = 0; i < musicList.length; i++) {
                musicList[i].className = '';
            }
            musicList[index].className = 'active';
        }

        return {
            dom: list,
            musicList: musicList,
            slideUp: slideUp,
            slideDown: slideDown,
            changeSelect: changeSelect
        }
    }

    root.listControl = listControl;

})(window.player || (window.player = {}));