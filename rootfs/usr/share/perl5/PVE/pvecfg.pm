package PVE::pvecfg;

use strict;
use vars qw(@ISA);
use Carp;

sub package {
	return 'pve-manager';
}

sub version {
	return '5.2';
}

sub release {
	return '1';
}

sub repoid {
	return '0fcd7879';
}

# this is diplayed on the GUI
sub version_text {
    return '5.2-1/0fcd7879';
}

# this is returned by the API
sub version_info {
    return {
	'version' => '5.2',
	'release' => '1',
	'repoid' => '0fcd7879',
    }
}

1;
