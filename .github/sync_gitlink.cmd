@echo off

REM git remote add gitlink https://gitlink.org.cn/xieguigang/mzkit_docs.git

REM git pull local HEAD
REM git pull gitee HEAD
git pull gitlink HEAD

REM git push local HEAD
REM git push gitee HEAD
git push gitlink HEAD

echo synchronization of this code repository job done!