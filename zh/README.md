# 中文帮助文档

<!-- 2022-07-14 -->

在本处，列举了通过MZKit工作站软件进行原始数据查看的一些基础操作流程。关于MZKit工作站软件更加进一步的数据分析操作，可以通过[此页面观看相关的教程视频](/bilibili.html)。

## 目录

### 非靶向数据查看篇

+ [查看LC-MS原始数据文件](/zh/#view-lc-ms)

### 质谱成像数据查看篇

+ [查看质谱成像原始数据文件](/zh/#view-ms-imaging)
+ [质谱成像离子峰简单统计](/zh/#msi-ions)
+ [质谱成像代谢物离子搜索](/zh/#msi-metabolite-query)


### 特别注意

在MZKit软件之中的大部分数据分析功能都是基于相应的``R#``脚本完成的。假若您无法正常使用MZKit软件上的大部分常用的数据分析功能，可能是MZKit软件的组件注册信息已经被破坏。这个时候会需要打开MZKit软件的安装文件夹进行手动修复：

1. 根据选择的MZKit软件的安装位置，访问至MZKit的数据服务脚本文件夹（一般情况下，默认位置为：``C:\Program Files\BioNovoGene\mzkit_win32\Rstudio\packages``）
2. 双击执行文件夹之中的``install_locals.cmd``批处理脚本进行MZKit软件组件注册信息的手动修复

![](/docs/images/local_installs.PNG)