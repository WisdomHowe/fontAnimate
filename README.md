# 打字效果-基于animate.css开发

调用方法如下：
```JavaScript
fontAnimate.init({
  el:"#title",
  fontDelay: 100, // 文字之间执行延迟
  className:"bounceIn"
});

fontAnimate.init({
  el: document.querySelectorAll(".wenzi"),
  fragment: true, // 是否分段执行， 否就是所有段落一起执行  默认为true
  delay: 1000, // 当前段落执行延迟
  fontDelay: 100, // 文字之间执行延迟
  className: "flipInX"
});
```