(window.player||(window.player={})).listControl=function(e,n){var t=document.createElement("div"),a=document.createElement("div"),i=document.createElement("dl"),s=document.createElement("div"),l=[];t.className="list",a.className="title",a.innerHTML="播放列表",s.className="close",s.innerHTML="关闭",t.appendChild(a),e.forEach(function(e,n){var t=document.createElement("dd");t.innerHTML=e.name,t.addEventListener("touchend",function(){c(n)});var a=document.createElement("span");a.innerHTML=e.singer,t.appendChild(a),i.appendChild(t),l.push(t)}),t.appendChild(i),t.appendChild(s),n.appendChild(t),c(0);var r=t.offsetHeight;function d(){t.style.transition=".2s",t.style.transform="translateY("+r+"px)"}function c(e){for(var n=0;n<l.length;n++)l[n].className="";l[e].className="active"}return t.style.transform="translateY("+r+"px)",s.addEventListener("touchend",function(){d()}),{dom:t,musicList:l,slideUp:function(){t.style.transition=".2s",t.style.transform="translateY(0)"},slideDown:d,changeSelect:c}};