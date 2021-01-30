;(function (root) {
    function Index(len) {
        this.curIndex = 0; //当前的索引值
        this.len = len; //数据的长度，用于做切歌的边界判断（共多少首歌曲）
    }

    Index.prototype = {
        /** 取上一个索引（上一首）*/
        prev: function () {
            return this.get(-1); //切到上一首
        },
        /** 取下一个索引（下一首）*/
        next: function () {
            return this.get(+1); //切到下一首
        },
        /** 获取索引，参数为：+1 或 -1 */
        get: function (val) {
            this.curIndex = (this.curIndex + val + this.len) % this.len; //★处理左右两侧过界的情况★
            return this.curIndex;
        }
    }

    root.indexControl = Index; //吧构造函数暴露出去，因为实例对象需要传参，所以实例对象不能暴露出去

})(window.player || (window.player = {}));