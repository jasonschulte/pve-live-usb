TARGETS = udev keyboard-setup.sh hwclock.sh ebtables x11-common apparmor procps networking open-iscsi iscsid nfs-common rpcbind kmod
INTERACTIVE = udev keyboard-setup.sh
procps: udev
networking: procps
open-iscsi: networking iscsid
iscsid: networking
nfs-common: rpcbind hwclock.sh
rpcbind: networking
