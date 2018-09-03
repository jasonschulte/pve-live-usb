nano .ssh/authorized_keys 
ls -al
nano .bashrc 
ls -l
cd /etc/
ls
cd network/
ls -al
nano interfaces
service networking restart
ifconfig
ip addr
df -h
ping 172.23.47.1
netstat -tnlp
apt install net-tools
apt-get update
apt install nettools
apt install netstat
apt search netstat
apt instal net-tools
apt install net-tools
netstat -tnlp
ls -al
ls /dev/sd*
dmesg
ls -al /dev/sd*
apt install grub2 xorriso squashfs-tools parted testdisk wipe partimage .xfsprogs reiserfsprogs jfsutils ntfs-3g dosfstools mtools casper lupin-casper
apt install grub2 xorriso squashfs-tools parted testdisk wipe partimage xfsprogs reiserfsprogs jfsutils ntfs-3g dosfstools mtools casper lupin-casper
cat /etc/issue
nano /etc/apt/sources.list
uname -a
apt install grub2 xorriso squashfs-tools parted testdisk wipe partimage xfsprogs reiserfsprogs jfsutils ntfs-3g dosfstools mtools
apt install xorriso squashfs-tools parted testdisk wipe partimage xfsprogs reiserfsprogs jfsutils ntfs-3g dosfstools mtools
grub-install --help
wget http://archive.ubuntu.com/ubuntu/pool/main/c/casper/casper_1.394_amd64.deb
dpkg -i --help
dpkg -i casper_1.394_amd64.deb 
apt search localechooser
apt search localechooser-data
apt intstall localechooser-data
apt in~stall localechooser-data
apt install localechooser-data
nano /etc/apt/sources.list
nano /etc/apt/sources.list.d/pve-enterprise.list 
nano /etc/apt/sources.list.d/ubuntu-bionic.list
apt-get update
ce /etc/apt/
cd /etc/apt/
ls -al
rm sources.list.d/ubuntu-bionic.list 
apt search add-apt-repository
apt install add-apt-repository
apt install software-properties-common
apt --fix-broken install
apt install software-properties-common
add-apt-repository 'deb http://us.archive.ubuntu.com/ubuntu/ bionic main restricted'
ls -l
cat sources.list
apt-get update
apt-key 
apt-key adv --keyserver keyserver.ubuntu.com
apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E084DAB9
apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3B4FE6ACC0B21F32
apt search dirmngr
apt install gnupg1-curl
apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3B4FE6ACC0B21F32
apt search dirmngr
apt install dirmngr
apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3B4FE6ACC0B21F32
apt-get update
apt install casper
df -h
pvdisplay 
vgdisplay 
lvdisplay 
vgdisplay 
lvdisplay 
pvdisplay 
vgdisplay 
lvextend -l +100%FREE root
lvextend -l +100%FREE /dev/pve/root
lvdisplay 
df -h
resize2fs /dev/mapper/pve-root 
df -h
apt install casper
apt purge initramfs-tools
dpkg-reconfigure 
dpkg-reconfigure initramfs-tools
apt install casper
apt-get autoremove --purge
apt-get casper-lupin
apt install casper-lupin
apt install lupin-capser
apt-get update
apt search lupin-casper
apt install lupin-casper
reboot
ls -l /dev/sd*
gdisk /dev/sdb
dd if=/dev/zero of=/dev/sdb count=4096 size=4096
dd if=/dev/zero of=/dev/sdb count=4096 bs=4096
gdisk /dev/sdb
export OSWORKDIR=~/osworkdir
export BOOTDISK=~/bootdisk
mkdir -p ${OSWORKDIR}
mkdir -p ${BOOTDISK}
mount /dev/sda2 ${BOOTDISK}
sudo rsync -av --dry-run --one-file-system --delete --exclude=/proc/* --exclude=/dev/* --exclude=/sys/* --exclude=/tmp/* --exclude=/lost+found --exclude=/var/tmp/* --exclude=/boot/* --exclude=/var/mail/* --exclude=/var/spool/* --exclude=/media/* --exclude=/etc/fstab --exclude=/etc/mtab --exclude=/etc/hosts --exclude=/var/lib/libvirt/images --exclude=${OSWORKDIR} --exclude=${BOOTDISK} / ${OSWORKDIR}
df -h
sudo rsync -av --one-file-system --delete --exclude=/proc/* --exclude=/dev/* --exclude=/sys/* --exclude=/tmp/* --exclude=/lost+found --exclude=/var/tmp/* --exclude=/boot/* --exclude=/var/mail/* --exclude=/var/spool/* --exclude=/media/* --exclude=/etc/fstab --exclude=/etc/mtab --exclude=/etc/hosts --exclude=/var/lib/libvirt/images --exclude=${OSWORKDIR} --exclude=${BOOTDISK} / ${OSWORKDIR}
ls -l
mount
mkfs.ext4 /dev/sdb2
mount
pvdisplay 
gdisk /dev/sda
umount /dev/sda2
mount /dev/sdb2 ${BOOTDISK}
sudo rsync -av --one-file-system --delete --exclude=/proc/* --exclude=/dev/* --exclude=/sys/* --exclude=/tmp/* --exclude=/lost+found --exclude=/var/tmp/* --exclude=/boot/* --exclude=/var/mail/* --exclude=/var/spool/* --exclude=/media/* --exclude=/etc/fstab --exclude=/etc/mtab --exclude=/etc/hosts --exclude=/var/lib/libvirt/images --exclude=${OSWORKDIR} --exclude=${BOOTDISK} / ${OSWORKDIR}
rm -rf osworkdir/*
df -h
pvdisplay 
vgdisplay 
nano /etc/fstab 
cat /proc/swaps 
cat /etc/fstab 
swapoff 
swapoff -a
nano /etc/fstab 
pvdisplay 
lvdisplay 
lvremove /dev/pve/swap 
lvextend -l +100%FREE /dev/pve/root
resize2fs /dev/pve/root 
df -h
sudo rsync -av --one-file-system --delete --exclude=/proc/* --exclude=/dev/* --exclude=/sys/* --exclude=/tmp/* --exclude=/lost+found --exclude=/var/tmp/* --exclude=/boot/* --exclude=/var/mail/* --exclude=/var/spool/* --exclude=/media/* --exclude=/etc/fstab --exclude=/etc/mtab --exclude=/etc/hosts --exclude=/var/lib/libvirt/images --exclude=${OSWORKDIR} --exclude=${BOOTDISK} / ${OSWORKDIR}
df -h
reboot
ls -l
export OSWORKDIR=~/osworkdir
export BOOTDISK=~/bootdisk
mkdir -p ${OSWORKDIR}
mkdir -p ${BOOTDISK}
mount /dev/sdb2 bootdisk/
mount
sudo rsync -av --dry-run --one-file-system --delete --exclude=/proc/* --exclude=/dev/* --exclude=/sys/* --exclude=/tmp/* --exclude=/lost+found --exclude=/var/tmp/* --exclude=/boot/* --exclude=/var/mail/* --exclude=/var/spool/* --exclude=/media/* --exclude=/etc/fstab --exclude=/etc/mtab --exclude=/etc/hosts --exclude=/var/lib/libvirt/images --exclude=${OSWORKDIR} --exclude=${BOOTDISK} / ${OSWORKDIR}
sudo mount  --bind /dev/ ${OSWORKDIR}/rootfs/dev
sudo mount -t proc proc ${OSWORKDIR}/rootfs/proc
sudo mount -t sysfs sysfs ${OSWORKDIR}/rootfs/sys
sudo mount -o bind /run ${OSWORKDIR}/rootfs/run
ls -l osworkdir/
sudo mount  --bind /dev/ ${OSWORKDIR}/dev
sudo mount -t proc proc ${OSWORKDIR}/proc
sudo mount -t sysfs sysfs ${OSWORKDIR}/sys
sudo mount -o bind /run ${OSWORKDIR}/run
sudo chroot ${OSWORKDIR} /bin/bash
ls -l /boot/
sudo rsync -av --one-file-system --delete --exclude=/proc/* --exclude=/dev/* --exclude=/sys/* --exclude=/tmp/* --exclude=/lost+found --exclude=/var/tmp/* --exclude=/var/mail/* --exclude=/var/spool/* --exclude=/media/* --exclude=/etc/fstab --exclude=/etc/mtab --exclude=/etc/hosts --exclude=/var/lib/libvirt/images --exclude=${OSWORKDIR} --exclude=${BOOTDISK} / ${OSWORKDIR}
sudo mount  --bind /dev/ ${OSWORKDIR}/dev
sudo mount -t proc proc ${OSWORKDIR}/proc
sudo mount -t sysfs sysfs ${OSWORKDIR}/sys
sudo mount -o bind /run ${OSWORKDIR}/run
sudo chroot ${OSWORKDIR} /bin/bash
mount
export kversion=`cd ${OSWORKDIR}/boot && ls -1 vmlinuz-* | tail -1 | sed 's@vmlinuz-@@'`
sudo cp -vp ${OSWORKDIR}/boot/vmlinuz-${kversion} ${BOOTDISK}/${FS_DIR}/vmlinuz
sudo cp -vp ${OSWORKDIR}/boot/initrd.img-${kversion} ${BOOTDISK}/${FS_DIR}/initrd.img
sudo cp -vp ${OSWORKDIR}/boot/memtest86+.bin ${BOOTDISK}/boot
sudo umount ${OSWORKDIR}/proc
sudo umount ${OSWORKDIR}/sys
sudo umount ${OSWORKDIR}/dev
sudo mksquashfs ${OSWORKDIR} ${BOOTDISK}/casper/filesystem.squashfs -noappend
mkdir bootdisk/casper
sudo mksquashfs ${OSWORKDIR} ${BOOTDISK}/casper/filesystem.squashfs -noappend
cat /boot/grub/grub.cfg 
ls -l
ls -l bootdisk/
head bootdisk/boot 
