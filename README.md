# 畅课 Hack

## 功能

- [x] 视频十倍速
- [x] 屏蔽自动暂停
- [ ] 一键看完视频

## 说明

安装脚本后，访问任意畅课视频页，右上角将会出现外挂面板。
成功初始化后，播放视频会是十倍速，且不会有自动暂停。

## 安装

发布路径：https://github.com/CUC-Life-Hack/tronclass-hack/blob/master/dist/main.user.js

安装方法：请参阅 [TamperMonkey 使用说明](https://github.com/CUC-Life-Hack/.github/wiki/Tampermonkey-%E4%BD%BF%E7%94%A8%E8%AF%B4%E6%98%8E)。

## 已知 bug

- 现在的屏蔽暂停是通过劫持播放器对象的暂停方法实现的，所以在屏蔽自动暂停的同时也没法手动暂停了。
