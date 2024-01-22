# 在Linux系统上安装MZKit桌面工作站

<!-- 2024-01-22 -->

```bash
dnf -y update
reboot
dnf groupinstall 'Development Tools' -y
dnf -y install epel-release
dnf config-manager --set-enabled powertools
dnf -y install libxslt-devel libpng-devel libX11-devel zlib-devel libtiff-devel freetype-devel libxcb-devel  libxml2-devel libgcrypt-devel dbus-devel libjpeg-turbo-devel  fontconfig-devel gnutls-devel gstreamer1-devel libXcursor-devel libXi-devel libXrandr-devel libXfixes-devel libXinerama-devel libXcomposite-devel mesa-libOSMesa-devel libpcap-devel libusb-devel libv4l-devel libgphoto2-devel gstreamer1-devel libgudev SDL2-devel gsm-devel libvkd3d-devel libudev-devel make cmake gcc flex
```

```bash
wget https://dl.winehq.org/wine/source/9.0/wine-9.0.tar.xz
tar xvf wine-9.0.tar.xz
cd wine-*/
./configure --enable-win64 
make
sudo make install
```

```bash
wine64 --version
wine --help
```