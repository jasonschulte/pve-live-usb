#!/bin/bash -xe

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
BOOTDISK=./bootdisk
ROOTFS=./rootfs

cd ${DIR}
mkdir -p ${BOOTDISK}/{casper,boot/grub}

apt clean
rsync -av --one-file-system --delete --exclude=/proc/* --exclude=/dev/* \
--exclude=/sys/* --exclude=/tmp/* --exclude=/lost+found \
--exclude=/var/tmp/* --exclude=/boot/grub/* \
--exclude=/var/mail/* --exclude=/var/spool/* --exclude=/media/* \
--exclude=/etc/fstab --exclude=/etc/mtab --exclude=/etc/hosts \
--exclude=/var/lib/libvirt/images \
--exclude=${DIR} / ${ROOTFS}

find ${ROOTFS}/var/log -type f | while read file
do
        cat /dev/null | tee $file
done

mount --bind /dev/ ${ROOTFS}/dev
mount -t proc proc ${ROOTFS}/proc
mount -t sysfs sysfs ${ROOTFS}/sys
mount --bind /run ${ROOTFS}/run

cat << EOF | chroot ${ROOTFS}
LANG=
depmod -a $(uname -r)
update-initramfs -u -k $(uname -r)
apt clean
EOF

umount ${ROOTFS}/run
umount ${ROOTFS}/sys
umount ${ROOTFS}/proc
umount ${ROOTFS}/dev

