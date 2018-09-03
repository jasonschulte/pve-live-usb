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
ls -l
ls -al bootdisk/
rm bootdisk/boot 
mkdir bootdisk/boot
ls -al
ls -al bootdisk/
cd bootdisk/
mv initrd.img casper/
mv vmlinuz casper/
ls -al
ls -al casper/
echo -n $(sudo du -s --block-size=1 ${OSWORKDIR} | tail -1 | awk '{print $1}') | sudo tee ${BOOTDISK}/casper/filesystem.size
cd ..
echo $OSWORKDIR
export OSWORKDIR=~/osworkdir
export BOOTDISK=~/bootdisk
echo -n $(sudo du -s --block-size=1 ${OSWORKDIR} | tail -1 | awk '{print $1}') | sudo tee ${BOOTDISK}/casper/filesystem.size
ls -al
ls bootdisk/
ls bootdisk/casper/
cat bootdisk/casper/filesystem.size 
nano /boot/grub/grub.cfg 
cd bootdisk/
ls boot/
mkdir boot/grub
nano boot/grub/grub.cfg
cd ..
grub-install --target=i386-pc --recheck --boot-directory=${BOOTDISK}/boot /dev/sdb
ls -l bootdisk/
ls -l bootdisk/boot/
ls -l bootdisk/boot/grub/
ls -l bootdisk/boot/grub/i386-pc/
ls -l
rm casper_1.394_amd64.deb 
umount ./bootdisk
ls -l /etc/pve/
ls -l /etc/pve/priv/
cd osworkdir/
ls -l
ls etc/pve/
ls -al etc/
ls -al etc/pve/
cd ..
echo $OSWORKDIR
sudo rsync -av --dry-run --one-file-system --delete --exclude=/proc/* --exclude=/dev/* --exclude=/sys/* --exclude=/tmp/* --exclude=/lost+found --exclude=/var/tmp/* --exclude=/var/mail/* --exclude=/var/spool/* --exclude=/media/* --exclude=/etc/fstab --exclude=/etc/mtab --exclude=/etc/hosts --exclude=/var/lib/libvirt/images --exclude=${OSWORKDIR} --exclude=${BOOTDISK} / ${OSWORKDIR}
sudo rsync -av --one-file-system --delete --exclude=/proc/* --exclude=/dev/* --exclude=/sys/* --exclude=/tmp/* --exclude=/lost+found --exclude=/var/tmp/* --exclude=/var/mail/* --exclude=/var/spool/* --exclude=/media/* --exclude=/etc/fstab --exclude=/etc/mtab --exclude=/etc/hosts --exclude=/var/lib/libvirt/images --exclude=${OSWORKDIR} --exclude=${BOOTDISK} / ${OSWORKDIR}
mount
mount | grep etc
df -h
cp -av /etc/pve/* /root/osworkdir/etc/pve/
nano osworkdir/etc/network/interfaces
mount /dev/sdb2 bootdisk/
mksquashfs ${OSWORKDIR} ${BOOTDISK}/casper/filesystem.squashfs -noappend
echo -n $(sudo du -s --block-size=1 ${OSWORKDIR} | tail -1 | awk '{print $1}') | sudo tee ${BOOTDISK}/casper/filesystem.size
nano bootdisk/boot/grub/grub.cfg 
umount bootdisk
cat osworkdir/etc/hosts.
cat osworkdir/etc/hosts
mount
cat /etc/fstab 
cd /etc/systemd/
find ./ -name pve-cluster.service
cat system/multi-user.target.wants/pve-cluster.service 
pmxcfs --help
man pmxcfs
echo $OSWORKDIR
echo $BOOTDISK
mount /dev/sdb2 /root/bootdisk/
cp /etc/hosts /root/osworkdir/etc/hosts
nano /root/osworkdir/etc/hosts
cd /root/osworkdir/
rm -rf /etc/pve/*
cd /etc/pve/
ls -al
cd /root/osworkdir/etc/pve/
rm -rf *
ls -al
cd ..
cd 
ls -al
ls osworkdir/etc/pve/
cat osworkdir/etc/hosts
mount
sudo mksquashfs ${OSWORKDIR} ${BOOTDISK}/casper/filesystem.squashfs -noappend
echo -n $(sudo du -s --block-size=1 ${OSWORKDIR} | tail -1 | awk '{print $1}') | sudo tee ${BOOTDISK}/casper/filesystem.size
umount bootdisk
service restart pve-cluster.service
systemctl restart pve-cluster.service
ls -l /etc/pve/
nano osworkdir/etc/network/interfaces
mount /dev/sdb2 /root/bootdisk/
sudo mksquashfs ${OSWORKDIR} ${BOOTDISK}/casper/filesystem.squashfs -noappend
echo -n $(sudo du -s --block-size=1 ${OSWORKDIR} | tail -1 | awk '{print $1}') | sudo tee ${BOOTDISK}/casper/filesystem.size
ls -lh bootdisk/casper/
umount bootdisk
git
apt install git
ls -al
git checkout git@github.com:jasonschulte/mukh-os.git
git checkout git@github.com:jasonschulte/mukh-os
git checkout git@github.com:jasonschulte/mukh-os.git
git clone git@github.com:jasonschulte/mukh-os.git
ls -l
git clone git@github.com:jasonschulte/mukh-os.git
echo $SSH_AUTH_SOCK
cat .ssh/authorized_keys 
git clone git@github.com:jasonschulte/mukh-os.git
echo $SSH_AUTH_SOCK
nano .ssh/authorized_keys 
echo $SSH_AUTH_SOCK
nano /etc/ssh/sshd_config 
service ssh restart
echo $SSH_AUTH_SOCK
service sshd restart
echo $SSH_AUTH_SOCK
nano /etc/ssh/sshd_config 
echo $SSH_AUTH_SOCK
ip addr
cat /etc/hosts
cat /etc/hostname 
cd osworkdir/
ls etc/
ls etc/pve/
cd /var/log/
df -hs
df -hs ./
du -hs 
service ssh stop
service ssh status
netstat -tnlp
ip addr
service ssh start
reboot
mount /dev/sdb2 bootdisk/
cd osworkdir/
ls root/.ssh/
cat root/.ssh/authorized_keys 
ls -al root/.ssh/
cd etc/network
cat interfaces
echo $SSH_AUTH_SOCK
history |grep git
git clone git@github.com:jasonschulte/mukh-os.git
echo $SSH_AUTH_SOCK
git clone git@github.com:jasonschulte/mukh-os.git
echo $SSH_AUTH_SOCK
git clone git@github.com:jasonschulte/mukh-os.git
echo $SSH_AUTH_SOCK
git clone git@github.com:jasonschulte/mukh-os.git
ls -al
mv osworkdir/* mukh-os/
ls -al osworkdir/
rm osworkdir/
rmdir osworkdir/
cd mukh-os/
git status
git add -A .
df -h
pvdisplay 
lvdisplay 
shutdown -h now
pvdisplay 
pvresize /dev/sda3
pvdisplay 
gdisk /dev/sda
parted /dev/sda
gdisk /dev/sda
parted /dev/sda
gdisk /dev/sda
parted /dev/sda
gdisk /dev/dsa
parted /dev/sda
gdisk /dev/sda
reboot
pvdisplay 
pvresize /dev/sda3
pvdisplay 
vgdisplay 
lvdisplay 
lvresize -l +100%FREE /dev/pve/root
lvdisplay 
ls -l
resize2fs /dev/pve/root 
df -h
ls -al
cd mukh-os/
ls -al
cat README.md 
mkdir rootfs
mv * rootfs/
ls -al
mv rootfs/README.md ./
ls -al
git status
git add -A .
git commit -m "Initial commit"
git push origin HEAD
cd ..
mount /dev/sda2 bootdisk/
df -h
cd bootdisk/
ls -al
cd ..
umount bootdisk
mount /dev/sdb2 bootdisk/
cd bootdisk/
df -h
ls -al
du -h --max-depth=1
cat /etc/network/interfaces
cd ..
ls -al
umount bootdisk
