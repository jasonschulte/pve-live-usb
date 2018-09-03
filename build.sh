#!/bin/bash -xe

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
BOOTDISK=./bootdisk
ROOTFS=./rootfs

cd ${DIR}
sudo mkdir -p ${BOOTDISK}/{casper,boot/grub}

sudo rsync -av --one-file-system --delete --exclude=/proc/* --exclude=/dev/* \
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
