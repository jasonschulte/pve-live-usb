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
	return '8';
}

sub repoid {
	return 'fdf39912';
}

# this is diplayed on the GUI
sub version_text {
    return '5.2-8/fdf39912';
}

# this is returned by the API
sub version_info {
    return {
	'version' => '5.2',
	'release' => '8',
	'repoid' => 'fdf39912',
    }
}

1;
