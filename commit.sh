#!/bin/bash -ex

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
BOOTDISK=./bootdisk
ROOTFS=./rootfs

cd ${DIR}
kversion=`cd ${ROOTFS}/boot && ls -1 vmlinuz-* | tail -1 | sed 's@vmlinuz-@@'`
cp -vp ${ROOTFS}/boot/vmlinuz-${kversion} ${BOOTDISK}/casper/vmlinuz
cp -vp ${ROOTFS}/boot/initrd.img-${kversion} ${BOOTDISK}/casper/initrd.img
cp -vp ${ROOTFS}/boot/memtest86+.bin ${BOOTDISK}/boot

mksquashfs ${ROOTFS} ${BOOTDISK}/casper/filesystem.squashfs -noappend
echo -n $(du -s --block-size=1 ${ROOTFS} | tail -1 | awk '{print $1}') | tee ${BOOTDISK}/casper/filesystem.size

cp -vp ./grub.cfg ${BOOTDISK}/boot/grub/grub.cfg

echo "RUN This to install GRUB: 'grub-install --target=i386-pc --recheck --boot-directory=${BOOTDISK}/boot /dev/sdX'"
