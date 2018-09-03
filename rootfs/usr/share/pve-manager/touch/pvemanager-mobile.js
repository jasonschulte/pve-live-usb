/**
 * Utility class for setting/reading values from browser cookies.
 * Values can be written using the {@link #set} method.
 * Values can be read using the {@link #get} method.
 * A cookie can be invalidated on the client machine using the {@link #clear} method.
 */
Ext.define('Ext.util.Cookies', {
    singleton: true,
    
    /**
     * Creates a cookie with the specified name and value. Additional settings for the cookie may be optionally specified
     * (for example: expiration, access restriction, SSL).
     * @param {String} name The name of the cookie to set.
     * @param {Object} value The value to set for the cookie.
     * @param {Object} [expires] Specify an expiration date the cookie is to persist until. Note that the specified Date
     * object will be converted to Greenwich Mean Time (GMT).
     * @param {String} [path] Setting a path on the cookie restricts access to pages that match that path. Defaults to all
     * pages ('/').
     * @param {String} [domain] Setting a domain restricts access to pages on a given domain (typically used to allow
     * cookie access across subdomains). For example, "sencha.com" will create a cookie that can be accessed from any
     * subdomain of sencha.com, including www.sencha.com, support.sencha.com, etc.
     * @param {Boolean} [secure] Specify true to indicate that the cookie should only be accessible via SSL on a page
     * using the HTTPS protocol. Defaults to false. Note that this will only work if the page calling this code uses the
     * HTTPS protocol, otherwise the cookie will be created with default options.
     */
    set : function(name, value){
        var argv = arguments,
            argc = arguments.length,
            expires = (argc > 2) ? argv[2] : null,
            path = (argc > 3) ? argv[3] : '/',
            domain = (argc > 4) ? argv[4] : null,
            secure = (argc > 5) ? argv[5] : false;
            
        document.cookie = name + "=" +
            escape(value) +
            ((expires === null) ? "" : ("; expires=" + expires.toUTCString())) +
            ((path === null) ? "" : ("; path=" + path)) +
            ((domain === null) ? "" : ("; domain=" + domain)) +
            ((secure === true) ? "; secure" : "");
    },

    /**
     * Retrieves cookies that are accessible by the current page. If a cookie does not exist, `get()` returns null. The
     * following example retrieves the cookie called "valid" and stores the String value in the variable validStatus.
     *
     *     var validStatus = Ext.util.Cookies.get("valid");
     *
     * @param {String} name The name of the cookie to get
     * @return {Object} Returns the cookie value for the specified name;
     * null if the cookie name does not exist.
     */
    get : function(name) {
        var parts = document.cookie.split('; '),
            len = parts.length,
            item, i, ret;

        // In modern browsers, a cookie with an empty string will be stored:
        // MyName=
        // In older versions of IE, it will be stored as:
        // MyName
        // So here we iterate over all the parts in an attempt to match the key.
        for (i = 0; i < len; ++i) {
            item = parts[i].split('=');
            if (item[0] === name) {
                ret = item[1];
                return ret ? unescape(ret) : '';
            }
        }
        return null;
    },

    /**
     * Removes a cookie with the provided name from the browser
     * if found by setting its expiration date to sometime in the past.
     * @param {String} name The name of the cookie to remove
     * @param {String} [path] The path for the cookie.
     * This must be included if you included a path while setting the cookie.
     */
    clear : function(name, path){
        if (this.get(name)) {
            path = path || '/';
            document.cookie = name + '=' + '; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=' + path;
        }
    }
});
Ext.ns('PVE');

// avoid errors related to Accessible Rich Internet Applications
// (access for people with disabilities)
// TODO reenable after all components are upgraded
Ext.enableAria = false;
Ext.enableAriaButtons = false;
Ext.enableAriaPanels = false;

// avoid errors when running without development tools
if (!Ext.isDefined(Ext.global.console)) {
    var console = {
	log: function() {}
    };
}
console.log("Starting PVE Manager");

Ext.Ajax.defaultHeaders = {
    'Accept': 'application/json'
};

Ext.define('PVE.Utils', { utilities: {

    // this singleton contains miscellaneous utilities

    toolkit: undefined, // (extjs|touch), set inside Toolkit.js

    bus_match: /^(ide|sata|virtio|scsi)\d+$/,

    log_severity_hash: {
	0: "panic",
	1: "alert",
	2: "critical",
	3: "error",
	4: "warning",
	5: "notice",
	6: "info",
	7: "debug"
    },

    support_level_hash: {
	'c': gettext('Community'),
	'b': gettext('Basic'),
	's': gettext('Standard'),
	'p': gettext('Premium')
    },

    noSubKeyHtml: 'You do not have a valid subscription for this server. Please visit <a target="_blank" href="http://www.proxmox.com/products/proxmox-ve/subscription-service-plans">www.proxmox.com</a> to get a list of available options.',

    kvm_ostypes: {
	'Linux': [
	    { desc: '4.X/3.X/2.6 Kernel', val: 'l26' },
	    { desc: '2.4 Kernel', val: 'l24' }
	],
	'Microsoft Windows': [
	    { desc: '10/2016', val: 'win10' },
	    { desc: '8.x/2012/2012r2', val: 'win8' },
	    { desc: '7/2008r2', val: 'win7' },
	    { desc: 'Vista/2008', val: 'w2k8' },
	    { desc: 'XP/2003', val: 'wxp' },
	    { desc: '2000', val: 'w2k' }
	],
	'Solaris Kernel': [
	    { desc: '-', val: 'solaris'}
	],
	'Other': [
	    { desc: '-', val: 'other'}
	]
    },

    get_health_icon: function(state, circle) {
	if (circle === undefined) {
	    circle = false;
	}

	if (state === undefined) {
	    state = 'uknown';
	}

	var icon = 'faded fa-question';
	switch(state) {
	    case 'good':
		icon = 'good fa-check';
		break;
	    case 'warning':
		icon = 'warning fa-exclamation';
		break;
	    case 'critical':
		icon = 'critical fa-times';
		break;
	    default: break;
	}

	if (circle) {
	    icon += '-circle';
	}

	return icon;
    },

    map_ceph_health: {
	'HEALTH_OK':'good',
	'HEALTH_WARN':'warning',
	'HEALTH_ERR':'critical'
    },

    render_ceph_health: function(healthObj) {
	var state = {
	    iconCls: PVE.Utils.get_health_icon(),
	    text: ''
	};

	if (!healthObj || !healthObj.status) {
	    return state;
	}

	var health = PVE.Utils.map_ceph_health[healthObj.status];

	state.iconCls = PVE.Utils.get_health_icon(health, true);
	state.text = healthObj.status;

	return state;
    },

    get_kvm_osinfo: function(value) {
	var info = { base: 'Other' }; // default
	if (value) {
	    Ext.each(Object.keys(PVE.Utils.kvm_ostypes), function(k) {
		Ext.each(PVE.Utils.kvm_ostypes[k], function(e) {
		    if (e.val === value) {
			info = { desc: e.desc, base: k };
		    }
		});
	    });
	}
	return info;
    },

    render_kvm_ostype: function (value) {
	var osinfo = PVE.Utils.get_kvm_osinfo(value);
	if (osinfo.desc && osinfo.desc !== '-') {
	    return osinfo.base + ' ' + osinfo.desc;
	} else {
	    return osinfo.base;
	}
    },

    render_hotplug_features: function (value) {
	var fa = [];

	if (!value || (value === '0')) {
	    return gettext('Disabled');
	}

	if (value === '1') {
	    value = 'disk,network,usb';
	}

	Ext.each(value.split(','), function(el) {
	    if (el === 'disk') {
		fa.push(gettext('Disk'));
	    } else if (el === 'network') {
		fa.push(gettext('Network'));
	    } else if (el === 'usb') {
		fa.push('USB');
	    } else if (el === 'memory') {
		fa.push(gettext('Memory'));
	    } else if (el === 'cpu') {
		fa.push(gettext('CPU'));
	    } else {
		fa.push(el);
	    }
	});

	return fa.join(', ');
    },

    render_qemu_bios: function(value) {
	if (!value) {
	    return Proxmox.Utils.defaultText + ' (SeaBIOS)';
	} else if (value === 'seabios') {
	    return "SeaBIOS";
	} else if (value === 'ovmf') {
	    return "OVMF (UEFI)";
	} else {
	    return value;
	}
    },

    render_scsihw: function(value) {
	if (!value) {
	    return Proxmox.Utils.defaultText + ' (LSI 53C895A)';
	} else if (value === 'lsi') {
	    return 'LSI 53C895A';
	} else if (value === 'lsi53c810') {
	    return 'LSI 53C810';
	} else if (value === 'megasas') {
	    return 'MegaRAID SAS 8708EM2';
	} else if (value === 'virtio-scsi-pci') {
	    return 'VirtIO SCSI';
	} else if (value === 'virtio-scsi-single') {
	    return 'VirtIO SCSI single';
	} else if (value === 'pvscsi') {
	    return 'VMware PVSCSI';
	} else {
	    return value;
	}
    },

    // fixme: auto-generate this
    // for now, please keep in sync with PVE::Tools::kvmkeymaps
    kvm_keymaps: {
	//ar: 'Arabic',
	da: 'Danish',
	de: 'German',
	'de-ch': 'German (Swiss)',
	'en-gb': 'English (UK)',
	'en-us': 'English (USA)',
	es: 'Spanish',
	//et: 'Estonia',
	fi: 'Finnish',
	//fo: 'Faroe Islands',
	fr: 'French',
	'fr-be': 'French (Belgium)',
	'fr-ca': 'French (Canada)',
	'fr-ch': 'French (Swiss)',
	//hr: 'Croatia',
	hu: 'Hungarian',
	is: 'Icelandic',
	it: 'Italian',
	ja: 'Japanese',
	lt: 'Lithuanian',
	//lv: 'Latvian',
	mk: 'Macedonian',
	nl: 'Dutch',
	//'nl-be': 'Dutch (Belgium)',
	no: 'Norwegian',
	pl: 'Polish',
	pt: 'Portuguese',
	'pt-br': 'Portuguese (Brazil)',
	//ru: 'Russian',
	sl: 'Slovenian',
	sv: 'Swedish',
	//th: 'Thai',
	tr: 'Turkish'
    },

    kvm_vga_drivers: {
	std: gettext('Standard VGA'),
	vmware: gettext('VMware compatible'),
	qxl: 'SPICE',
	qxl2: 'SPICE dual monitor',
	qxl3: 'SPICE three monitors',
	qxl4: 'SPICE four monitors',
	serial0: gettext('Serial terminal') + ' 0',
	serial1: gettext('Serial terminal') + ' 1',
	serial2: gettext('Serial terminal') + ' 2',
	serial3: gettext('Serial terminal') + ' 3'
    },

    render_kvm_language: function (value) {
	if (!value || value === '__default__') {
	    return Proxmox.Utils.defaultText;
	}
	var text = PVE.Utils.kvm_keymaps[value];
	if (text) {
	    return text + ' (' + value + ')';
	}
	return value;
    },

    kvm_keymap_array: function() {
	var data = [['__default__', PVE.Utils.render_kvm_language('')]];
	Ext.Object.each(PVE.Utils.kvm_keymaps, function(key, value) {
	    data.push([key, PVE.Utils.render_kvm_language(value)]);
	});

	return data;
    },

    console_map: {
	'__default__': Proxmox.Utils.defaultText + ' (HTML5)',
	'vv': 'SPICE (remote-viewer)',
	'html5': 'HTML5 (noVNC)',
	'xtermjs': 'xterm.js'
    },

    render_console_viewer: function(value) {
	value = value || '__default__';
	if (PVE.Utils.console_map[value]) {
	    return PVE.Utils.console_map[value];
	}
	return value;
    },

    console_viewer_array: function() {
	return Ext.Array.map(Object.keys(PVE.Utils.console_map), function(v) {
	    return [v, PVE.Utils.render_console_viewer(v)];
	});
    },

    render_kvm_vga_driver: function (value) {
	if (!value) {
	    return Proxmox.Utils.defaultText;
	}
	var text = PVE.Utils.kvm_vga_drivers[value];
	if (text) {
	    return text + ' (' + value + ')';
	}
	return value;
    },

    kvm_vga_driver_array: function() {
	var data = [['__default__', PVE.Utils.render_kvm_vga_driver('')]];
	Ext.Object.each(PVE.Utils.kvm_vga_drivers, function(key, value) {
	    data.push([key, PVE.Utils.render_kvm_vga_driver(value)]);
	});

	return data;
    },

    render_kvm_startup: function(value) {
	var startup = PVE.Parser.parseStartup(value);

	var res = 'order=';
	if (startup.order === undefined) {
	    res += 'any';
	} else {
	    res += startup.order;
	}
	if (startup.up !== undefined) {
	    res += ',up=' + startup.up;
	}
	if (startup.down !== undefined) {
	    res += ',down=' + startup.down;
	}

	return res;
    },

    extractFormActionError: function(action) {
	var msg;
	switch (action.failureType) {
	case Ext.form.action.Action.CLIENT_INVALID:
	    msg = gettext('Form fields may not be submitted with invalid values');
	    break;
	case Ext.form.action.Action.CONNECT_FAILURE:
	    msg = gettext('Connection error');
	    var resp = action.response;
	    if (resp.status && resp.statusText) {
		msg += " " + resp.status + ": " + resp.statusText;
	    }
	    break;
	case Ext.form.action.Action.LOAD_FAILURE:
	case Ext.form.action.Action.SERVER_INVALID:
	    msg = Proxmox.Utils.extractRequestError(action.result, true);
	    break;
	}
	return msg;
    },

    format_duration_short: function(ut) {

	if (ut < 60) {
	    return ut.toFixed(1) + 's';
	}

	if (ut < 3600) {
	    var mins = ut / 60;
	    return mins.toFixed(1) + 'm';
	}

	if (ut < 86400) {
	    var hours = ut / 3600;
	    return hours.toFixed(1) + 'h';
	}

	var days = ut / 86400;
	return days.toFixed(1) + 'd';
    },

    imagesText: gettext('Disk image'),
    backupFileText: gettext('VZDump backup file'),
    vztmplText: gettext('Container template'),
    isoImageText: gettext('ISO image'),
    containersText: gettext('Container'),

    storageSchema: {
	dir: {
	    name: Proxmox.Utils.directoryText,
	    ipanel: 'DirInputPanel',
	    faIcon: 'folder'
	},
	lvm: {
	    name: 'LVM',
	    ipanel: 'LVMInputPanel',
	    faIcon: 'folder'
	},
	lvmthin: {
	    name: 'LVM-Thin',
	    ipanel: 'LvmThinInputPanel',
	    faIcon: 'folder'
	},
	nfs: {
	    name: 'NFS',
	    ipanel: 'NFSInputPanel',
	    faIcon: 'building'
	},
	cifs: {
	    name: 'CIFS',
	    ipanel: 'CIFSInputPanel',
	    faIcon: 'building'
	},
	glusterfs: {
	    name: 'GlusterFS',
	    ipanel: 'GlusterFsInputPanel',
	    faIcon: 'building'
	},
	iscsi: {
	    name: 'iSCSI',
	    ipanel: 'IScsiInputPanel',
	    faIcon: 'building'
	},
	sheepdog: {
	    name: 'Sheepdog',
	    ipanel: 'SheepdogInputPanel',
	    hideAdd: true,
	    faIcon: 'building'
	},
	rbd: {
	    name: 'RBD',
	    ipanel: 'RBDInputPanel',
	    hideAdd: true,
	    faIcon: 'building'
	},
	rbd_ext: {
	    name: 'RBD (external)',
	    ipanel: 'RBDInputPanel',
	    faIcon: 'building'
	},
	pveceph: {
	    name: 'RBD (PVE)',
	    ipanel: 'PVERBDInputPanel',
	    faIcon: 'building'
	},
	zfs: {
	    name: 'ZFS over iSCSI',
	    ipanel: 'ZFSInputPanel',
	    faIcon: 'building'
	},
	zfspool: {
	    name: 'ZFS',
	    ipanel: 'ZFSPoolInputPanel',
	    faIcon: 'folder'
	},
	drbd: {
	    name: 'DRBD',
	    hideAdd: true
	}
    },

    format_storage_type: function(value, md, record) {
	if (value === 'rbd' && record) {
	    value = (record.get('monhost')?'rbd_ext':'pveceph');
	}

	var schema = PVE.Utils.storageSchema[value];
	if (schema) {
	    return schema.name;
	}
	return Proxmox.Utils.unknownText;
    },

    format_ha: function(value) {
	var text = Proxmox.Utils.noneText;

	if (value.managed) {
	    text = value.state || Proxmox.Utils.noneText;

	    text += ', ' +  Proxmox.Utils.groupText + ': ';
	    text += value.group || Proxmox.Utils.noneText;
	}

	return text;
    },

    format_content_types: function(value) {
	var cta = [];

	Ext.each(value.split(',').sort(), function(ct) {
	    if (ct === 'images') {
		cta.push(PVE.Utils.imagesText);
	    } else if (ct === 'backup') {
		cta.push(PVE.Utils.backupFileText);
	    } else if (ct === 'vztmpl') {
		cta.push(PVE.Utils.vztmplText);
	    } else if (ct === 'iso') {
		cta.push(PVE.Utils.isoImageText);
	    } else if (ct === 'rootdir') {
		cta.push(PVE.Utils.containersText);
	    }
	});

	return cta.join(', ');
    },

    render_storage_content: function(value, metaData, record) {
	var data = record.data;
	if (Ext.isNumber(data.channel) &&
	    Ext.isNumber(data.id) &&
	    Ext.isNumber(data.lun)) {
	    return "CH " +
		Ext.String.leftPad(data.channel,2, '0') +
		" ID " + data.id + " LUN " + data.lun;
	}
	return data.volid.replace(/^.*:(.*\/)?/,'');
    },

    render_serverity: function (value) {
	return PVE.Utils.log_severity_hash[value] || value;
    },

    render_cpu: function(value, metaData, record, rowIndex, colIndex, store) {

	if (!(record.data.uptime && Ext.isNumeric(value))) {
	    return '';
	}

	var maxcpu = record.data.maxcpu || 1;

	if (!Ext.isNumeric(maxcpu) && (maxcpu >= 1)) {
	    return '';
	}

	var per = value * 100;

	return per.toFixed(1) + '% of ' + maxcpu.toString() + (maxcpu > 1 ? 'CPUs' : 'CPU');
    },

    render_size: function(value, metaData, record, rowIndex, colIndex, store) {
	/*jslint confusion: true */

	if (!Ext.isNumeric(value)) {
	    return '';
	}

	return Proxmox.Utils.format_size(value);
    },

    render_bandwidth: function(value) {
	if (!Ext.isNumeric(value)) {
	    return '';
	}

	return Proxmox.Utils.format_size(value) + '/s';
    },

    render_timestamp_human_readable: function(value) {
	return Ext.Date.format(new Date(value * 1000), 'l d F Y H:i:s');
    },

    render_duration: function(value) {
	if (value === undefined) {
	    return '-';
	}
	return PVE.Utils.format_duration_short(value);
    },

    calculate_mem_usage: function(data) {
	if (!Ext.isNumeric(data.mem) ||
	    data.maxmem === 0 ||
	    data.uptime < 1) {
	    return -1;
	}

	return (data.mem / data.maxmem);
    },

    render_mem_usage_percent: function(value, metaData, record, rowIndex, colIndex, store) {
	if (!Ext.isNumeric(value) || value === -1) {
	    return '';
	}
	if (value > 1 ) {
	    // we got no percentage but bytes
	    var mem = value;
	    var maxmem = record.data.maxmem;
	    if (!record.data.uptime ||
		maxmem === 0 ||
		!Ext.isNumeric(mem)) {
		return '';
	    }

	    return ((mem*100)/maxmem).toFixed(1) + " %";
	}
	return (value*100).toFixed(1) + " %";
    },

    render_mem_usage: function(value, metaData, record, rowIndex, colIndex, store) {

	var mem = value;
	var maxmem = record.data.maxmem;

	if (!record.data.uptime) {
	    return '';
	}

	if (!(Ext.isNumeric(mem) && maxmem)) {
	    return '';
	}

	return PVE.Utils.render_size(value);
    },

    calculate_disk_usage: function(data) {

	if (!Ext.isNumeric(data.disk) ||
	    data.type === 'qemu' ||
	    (data.type === 'lxc' && data.uptime === 0) ||
	    data.maxdisk === 0) {
	    return -1;
	}

	return (data.disk / data.maxdisk);
    },

    render_disk_usage_percent: function(value, metaData, record, rowIndex, colIndex, store) {
	if (!Ext.isNumeric(value) || value === -1) {
	    return '';
	}

	return (value * 100).toFixed(1) + " %";
    },

    render_disk_usage: function(value, metaData, record, rowIndex, colIndex, store) {

	var disk = value;
	var maxdisk = record.data.maxdisk;
	var type = record.data.type;

	if (!Ext.isNumeric(disk) ||
	    type === 'qemu' ||
	    maxdisk === 0 ||
	    (type === 'lxc' && record.data.uptime === 0)) {
	    return '';
	}

	return PVE.Utils.render_size(value);
    },

    get_object_icon_class: function(type, record) {
	var status = '';
	var objType = type;

	if (type === 'type') {
	    // for folder view
	    objType = record.groupbyid;
	} else if (record.template) {
	    // templates
	    objType = 'template';
	    status = type;
	} else {
	    // everything else
	    status = record.status + ' ha-' + record.hastate;
	}

	var defaults = PVE.tree.ResourceTree.typeDefaults[objType];
	if (defaults && defaults.iconCls) {
	    var retVal = defaults.iconCls + ' ' + status;
	    return retVal;
	}

	return '';
    },

    render_resource_type: function(value, metaData, record, rowIndex, colIndex, store) {

	var cls = PVE.Utils.get_object_icon_class(value,record.data);

	var fa = '<i class="fa-fw x-grid-icon-custom ' + cls  + '"></i> ';
	return fa + value;
    },

    render_support_level: function(value, metaData, record) {
	return PVE.Utils.support_level_hash[value] || '-';
    },

    render_upid: function(value, metaData, record) {
	var type = record.data.type;
	var id = record.data.id;

	return Proxmox.Utils.format_task_description(type, id);
    },

    /* render functions for new status panel */

    render_usage: function(val) {
	return (val*100).toFixed(2) + '%';
    },

    render_cpu_usage: function(val, max) {
	return Ext.String.format(gettext('{0}% of {1}') +
	    ' ' + gettext('CPU(s)'), (val*100).toFixed(2), max);
    },

    render_size_usage: function(val, max) {
	if (max === 0) {
	    return gettext('N/A');
	}
	return (val*100/max).toFixed(2) + '% '+ '(' +
	    Ext.String.format(gettext('{0} of {1}'),
	    PVE.Utils.render_size(val), PVE.Utils.render_size(max)) + ')';
    },

    /* this is different for nodes */
    render_node_cpu_usage: function(value, record) {
	return PVE.Utils.render_cpu_usage(value, record.cpus);
    },

    /* this is different for nodes */
    render_node_size_usage: function(record) {
	return PVE.Utils.render_size_usage(record.used, record.total);
    },

    render_optional_url: function(value) {
	var match;
	if (value && (match = value.match(/^https?:\/\//)) !== null) {
	    return '<a target="_blank" href="' + value + '">' + value + '</a>';
	}
	return value;
    },

    render_san: function(value) {
	var names = [];
	if (Ext.isArray(value)) {
	    value.forEach(function(val) {
		if (!Ext.isNumber(val)) {
		    names.push(val);
		}
	    });
	    return names.join('<br>');
	}
	return value;
    },

    windowHostname: function() {
	return window.location.hostname.replace(Proxmox.Utils.IP6_bracket_match,
            function(m, addr, offset, original) { return addr; });
    },

    openDefaultConsoleWindow: function(consoles, vmtype, vmid, nodename, vmname) {
	var dv = PVE.Utils.defaultViewer(consoles);
	PVE.Utils.openConsoleWindow(dv, vmtype, vmid, nodename, vmname);
    },

    openConsoleWindow: function(viewer, vmtype, vmid, nodename, vmname) {
	// kvm, lxc, shell, upgrade

	if (vmid == undefined && (vmtype === 'kvm' || vmtype === 'lxc')) {
	    throw "missing vmid";
	}

	if (!nodename) {
	    throw "no nodename specified";
	}

	if (viewer === 'html5') {
	    PVE.Utils.openVNCViewer(vmtype, vmid, nodename, vmname);
	} else if (viewer === 'xtermjs') {
	    Proxmox.Utils.openXtermJsViewer(vmtype, vmid, nodename, vmname);
	} else if (viewer === 'vv') {
	    var url;
	    var params = { proxy: PVE.Utils.windowHostname() };
	    if (vmtype === 'kvm') {
		url = '/nodes/' + nodename + '/qemu/' + vmid.toString() + '/spiceproxy';
		PVE.Utils.openSpiceViewer(url, params);
	    } else if (vmtype === 'lxc') {
		url = '/nodes/' + nodename + '/lxc/' + vmid.toString() + '/spiceproxy';
		PVE.Utils.openSpiceViewer(url, params);
	    } else if (vmtype === 'shell') {
		url = '/nodes/' + nodename + '/spiceshell';
		PVE.Utils.openSpiceViewer(url, params);
	    } else if (vmtype === 'upgrade') {
		url = '/nodes/' + nodename + '/spiceshell';
		params.upgrade = 1;
		PVE.Utils.openSpiceViewer(url, params);
	    }
	} else {
	    throw "unknown viewer type";
	}
    },

    defaultViewer: function(consoles) {

	var allowSpice, allowXtermjs;

	if (consoles === true) {
	    allowSpice = true;
	    allowXtermjs = true;
	} else if (typeof consoles === 'object') {
	    allowSpice = consoles.spice;
	    allowXtermjs = !!consoles.xtermjs;
	}
	var vncdefault = 'html5';
	var dv = PVE.VersionInfo.console || vncdefault;
	if ((dv === 'vv' && !allowSpice) || (dv === 'xtermjs' && !allowXtermjs)) {
	    dv = vncdefault;
	}

	return dv;
    },

    openVNCViewer: function(vmtype, vmid, nodename, vmname) {
	var url = Ext.urlEncode({
	    console: vmtype, // kvm, lxc, upgrade or shell
	    novnc: 1,
	    vmid: vmid,
	    vmname: vmname,
	    node: nodename
	});
	var nw = window.open("?" + url, '_blank', "innerWidth=745,innerheight=427");
	nw.focus();
    },

    openSpiceViewer: function(url, params){

	var downloadWithName = function(uri, name) {
	    var link = Ext.DomHelper.append(document.body, {
		tag: 'a',
		href: uri,
		css : 'display:none;visibility:hidden;height:0px;'
	    });

	    // Note: we need to tell android the correct file name extension
	    // but we do not set 'download' tag for other environments, because
	    // It can have strange side effects (additional user prompt on firefox)
	    var andriod = navigator.userAgent.match(/Android/i) ? true : false;
	    if (andriod) {
		link.download = name;
	    }

	    if (link.fireEvent) {
		link.fireEvent('onclick');
	    } else {
                var evt = document.createEvent("MouseEvents");
                evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		link.dispatchEvent(evt);
	    }
	};

	Proxmox.Utils.API2Request({
	    url: url,
	    params: params,
	    method: 'POST',
	    failure: function(response, opts){
		Ext.Msg.alert('Error', response.htmlStatus);
	    },
	    success: function(response, opts){
		var raw = "[virt-viewer]\n";
		Ext.Object.each(response.result.data, function(k, v) {
		    raw += k + "=" + v + "\n";
		});
		var url = 'data:application/x-virt-viewer;charset=UTF-8,' +
		    encodeURIComponent(raw);

		downloadWithName(url, "pve-spice.vv");
	    }
	});
    },

    openTreeConsole: function(tree, record, item, index, e) {
	e.stopEvent();
	var nodename = record.data.node;
	var vmid = record.data.vmid;
	var vmname = record.data.name;
	if (record.data.type === 'qemu' && !record.data.template) {
	    Proxmox.Utils.API2Request({
		url: '/nodes/' + nodename + '/qemu/' + vmid + '/status/current',
		failure: function(response, opts) {
		    Ext.Msg.alert('Error', response.htmlStatus);
		},
		success: function(response, opts) {
		    var allowSpice = response.result.data.spice;
		    PVE.Utils.openDefaultConsoleWindow(allowSpice, 'kvm', vmid, nodename, vmname);
		}
	    });
	} else if (record.data.type === 'lxc' && !record.data.template) {
	    PVE.Utils.openDefaultConsoleWindow(true, 'lxc', vmid, nodename, vmname);
	}
    },

    // test automation helper
    call_menu_handler: function(menu, text) {

	var list = menu.query('menuitem');

	Ext.Array.each(list, function(item) {
	    if (item.text === text) {
		if (item.handler) {
		    item.handler();
		    return 1;
		} else {
		    return undefined;
		}
	    }
	});
    },

    createCmdMenu: function(v, record, item, index, event) {
	event.stopEvent();
	if (!(v instanceof Ext.tree.View)) {
	    v.select(record);
	}
	var menu;
	var template = !!record.data.template;
	var type = record.data.type;

	if (template) {
	    if (type === 'qemu' || type == 'lxc') {
		menu = Ext.create('PVE.menu.TemplateMenu', {
		    pveSelNode: record
		});
	    }
	} else if (type === 'qemu' ||
		   type === 'lxc' ||
		   type === 'node') {
	    menu = Ext.create('PVE.' + type + '.CmdMenu', {
		pveSelNode: record,
		nodename: record.data.node
	    });
	} else {
	    return;
	}

	menu.showAt(event.getXY());
    },

    // helper for deleting field which are set to there default values
    delete_if_default: function(values, fieldname, default_val, create) {
	if (values[fieldname] === '' || values[fieldname] === default_val) {
	    if (!create) {
		if (values['delete']) {
		    values['delete'] += ',' + fieldname;
		} else {
		    values['delete'] = fieldname;
		}
	    }

	    delete values[fieldname];
	}
    },

    loadSSHKeyFromFile: function(file, callback) {
	// ssh-keygen produces 740 bytes for an average 4096 bit rsa key, with
	// a user@host comment, 1420 for 8192 bits; current max is 16kbit
	// assume: 740*8 for max. 32kbit (5920 byte file)
	// round upwards to nearest nice number => 8192 bytes, leaves lots of comment space
	if (file.size > 8192) {
	    Ext.Msg.alert(gettext('Error'), gettext("Invalid file size: ") + file.size);
	    return;
	}
	/*global
	  FileReader
	*/
	var reader = new FileReader();
	reader.onload = function(evt) {
	    callback(evt.target.result);
	};
	reader.readAsText(file);
    },

    bus_counts: { ide: 4, sata: 6, scsi: 16, virtio: 16 },

    // types is either undefined (all busses), an array of busses, or a single bus
    forEachBus: function(types, func) {
	var busses = Object.keys(PVE.Utils.bus_counts);
	var i, j, count, cont;

	if (Ext.isArray(types)) {
	    busses = types;
	} else if (Ext.isDefined(types)) {
	    busses = [ types ];
	}

	// check if we only have valid busses
	for (i = 0; i < busses.length; i++) {
	    if (!PVE.Utils.bus_counts[busses[i]]) {
		throw "invalid bus: '" + busses[i] + "'";
	    }
	}

	for (i = 0; i < busses.length; i++) {
	    count = PVE.Utils.bus_counts[busses[i]];
	    for (j = 0; j < count; j++) {
		cont = func(busses[i], j);
		if (!cont && cont !== undefined) {
		    return;
		}
	    }
	}
    },

    mp_counts: { mps: 10, unused: 10 },

    forEachMP: function(func, includeUnused) {
	var i, cont;
	for (i = 0; i < PVE.Utils.mp_counts.mps; i++) {
	    cont = func('mp', i);
	    if (!cont && cont !== undefined) {
		return;
	    }
	}

	if (!includeUnused) {
	    return;
	}

	for (i = 0; i < PVE.Utils.mp_counts.unused; i++) {
	    cont = func('unused', i);
	    if (!cont && cont !== undefined) {
		return;
	    }
	}
    }
},

    singleton: true,
    constructor: function() {
	var me = this;
	Ext.apply(me, me.utilities);
    }

});

// Some configuration values are complex strings -
// so we need parsers/generators for them.

Ext.define('PVE.Parser', { statics: {

    // this class only contains static functions

    parseACME: function(value) {
	if (!value) {
	    return;
	}

	var res = {};
	var errors = false;

	Ext.Array.each(value.split(','), function(p) {
	    if (!p || p.match(/^\s*$/)) {
		return; //continue
	    }

	    var match_res;
	    if ((match_res = p.match(/^(?:domains=)?((?:[a-zA-Z0-9\-\.]+[;, ]?)+)$/)) !== null) {
		res.domains = match_res[1].split(/[;, ]/);
	    } else {
		errors = true;
		return false;
	    }
	});

	if (errors || !res) {
	    return;
	}

	return res;
    },

    parseBoolean: function(value, default_value) {
	if (!Ext.isDefined(value)) {
	    return default_value;
	}
	value = value.toLowerCase();
	return value === '1' ||
	       value === 'on' ||
	       value === 'yes' ||
	       value === 'true';
    },

    parseQemuNetwork: function(key, value) {
	if (!(key && value)) {
	    return;
	}

	var res = {};

	var errors = false;
	Ext.Array.each(value.split(','), function(p) {
	    if (!p || p.match(/^\s*$/)) {
		return; // continue
	    }

	    var match_res;

	    if ((match_res = p.match(/^(ne2k_pci|e1000|e1000-82540em|e1000-82544gc|e1000-82545em|vmxnet3|rtl8139|pcnet|virtio|ne2k_isa|i82551|i82557b|i82559er)(=([0-9a-f]{2}(:[0-9a-f]{2}){5}))?$/i)) !== null) {
		res.model = match_res[1].toLowerCase();
		if (match_res[3]) {
		    res.macaddr = match_res[3];
		}
	    } else if ((match_res = p.match(/^bridge=(\S+)$/)) !== null) {
		res.bridge = match_res[1];
	    } else if ((match_res = p.match(/^rate=(\d+(\.\d+)?)$/)) !== null) {
		res.rate = match_res[1];
	    } else if ((match_res = p.match(/^tag=(\d+(\.\d+)?)$/)) !== null) {
		res.tag = match_res[1];
	    } else if ((match_res = p.match(/^firewall=(\d+)$/)) !== null) {
		res.firewall = match_res[1];
	    } else if ((match_res = p.match(/^link_down=(\d+)$/)) !== null) {
		res.disconnect = match_res[1];
	    } else if ((match_res = p.match(/^queues=(\d+)$/)) !== null) {
		res.queues = match_res[1];
	    } else if ((match_res = p.match(/^trunks=(\d+(?:-\d+)?(?:;\d+(?:-\d+)?)*)$/)) !== null) {
		res.trunks = match_res[1];
	    } else {
		errors = true;
		return false; // break
	    }
	});

	if (errors || !res.model) {
	    return;
	}

	return res;
    },

    printQemuNetwork: function(net) {

	var netstr = net.model;
	if (net.macaddr) {
	    netstr += "=" + net.macaddr;
	}
	if (net.bridge) {
	    netstr += ",bridge=" + net.bridge;
	    if (net.tag) {
		netstr += ",tag=" + net.tag;
	    }
	    if (net.firewall) {
		netstr += ",firewall=" + net.firewall;
	    }
	}
	if (net.rate) {
	    netstr += ",rate=" + net.rate;
	}
	if (net.queues) {
	    netstr += ",queues=" + net.queues;
	}
	if (net.disconnect) {
	    netstr += ",link_down=" + net.disconnect;
	}
	if (net.trunks) {
	    netstr += ",trunks=" + net.trunks;
	}
	return netstr;
    },

    parseQemuDrive: function(key, value) {
	if (!(key && value)) {
	    return;
	}

	var res = {};

	var match_res = key.match(/^([a-z]+)(\d+)$/);
	if (!match_res) {
	    return;
	}
	res['interface'] = match_res[1];
	res.index = match_res[2];

	var errors = false;
	Ext.Array.each(value.split(','), function(p) {
	    if (!p || p.match(/^\s*$/)) {
		return; // continue
	    }
	    var match_res = p.match(/^([a-z_]+)=(\S+)$/);
	    if (!match_res) {
		if (!p.match(/\=/)) {
		    res.file = p;
		    return; // continue
		}
		errors = true;
		return false; // break
	    }
	    var k = match_res[1];
	    if (k === 'volume') {
		k = 'file';
	    }

	    if (Ext.isDefined(res[k])) {
		errors = true;
		return false; // break
	    }

	    var v = match_res[2];

	    if (k === 'cache' && v === 'off') {
		v = 'none';
	    }

	    res[k] = v;
	});

	if (errors || !res.file) {
	    return;
	}

	return res;
    },

    printQemuDrive: function(drive) {

	var drivestr = drive.file;

	Ext.Object.each(drive, function(key, value) {
	    if (!Ext.isDefined(value) || key === 'file' ||
		key === 'index' || key === 'interface') {
		return; // continue
	    }
	    drivestr += ',' + key + '=' + value;
	});

	return drivestr;
    },

    parseIPConfig: function(key, value) {
	if (!(key && value)) {
	    return;
	}

	var res = {};

	var errors = false;
	Ext.Array.each(value.split(','), function(p) {
	    if (!p || p.match(/^\s*$/)) {
		return; // continue
	    }

	    var match_res;
	    if ((match_res = p.match(/^ip=(\S+)$/)) !== null) {
		res.ip = match_res[1];
	    } else if ((match_res = p.match(/^gw=(\S+)$/)) !== null) {
		res.gw = match_res[1];
	    } else if ((match_res = p.match(/^ip6=(\S+)$/)) !== null) {
		res.ip6 = match_res[1];
	    } else if ((match_res = p.match(/^gw6=(\S+)$/)) !== null) {
		res.gw6 = match_res[1];
	    } else {
		errors = true;
		return false; // break
	    }
	});

	if (errors) {
	    return;
	}

	return res;
    },

    printIPConfig: function(cfg) {
	var c = "";
	var str = "";
	if (cfg.ip) {
	    str += "ip=" + cfg.ip;
	    c = ",";
	}
	if (cfg.gw) {
	    str += c + "gw=" + cfg.gw;
	    c = ",";
	}
	if (cfg.ip6) {
	    str += c + "ip6=" + cfg.ip6;
	    c = ",";
	}
	if (cfg.gw6) {
	    str += c + "gw6=" + cfg.gw6;
	    c = ",";
	}
	return str;
    },

    parseOpenVZNetIf: function(value) {
	if (!value) {
	    return;
	}

	var res = {};

	var errors = false;
	Ext.Array.each(value.split(';'), function(item) {
	    if (!item || item.match(/^\s*$/)) {
		return; // continue
	    }

	    var data = {};
	    Ext.Array.each(item.split(','), function(p) {
		if (!p || p.match(/^\s*$/)) {
		    return; // continue
		}
		var match_res = p.match(/^(ifname|mac|bridge|host_ifname|host_mac|mac_filter)=(\S+)$/);
		if (!match_res) {
		    errors = true;
		    return false; // break
		}
		if (match_res[1] === 'bridge'){
		    var bridgevlanf = match_res[2];
		    var bridge_res = bridgevlanf.match(/^(vmbr(\d+))(v(\d+))?(f)?$/);
		    if (!bridge_res) {
			errors = true;
			return false; // break
		    }
		    data.bridge = bridge_res[1];
		    data.tag = bridge_res[4];
		    /*jslint confusion: true*/
		    data.firewall = bridge_res[5] ? 1 : 0;
		    /*jslint confusion: false*/
		} else {
		    data[match_res[1]] = match_res[2];
		}
	    });

	    if (errors || !data.ifname) {
		errors = true;
		return false; // break
	    }

	    data.raw = item;

	    res[data.ifname] = data;
	});

	return errors ? undefined: res;
    },

    printOpenVZNetIf: function(netif) {
	var netarray = [];

	Ext.Object.each(netif, function(iface, data) {
	    var tmparray = [];
	    Ext.Array.each(['ifname', 'mac', 'bridge', 'host_ifname' , 'host_mac', 'mac_filter', 'tag', 'firewall'], function(key) {
		var value = data[key];
		if (key === 'bridge'){
		    if(data.tag){
			value = value + 'v' + data.tag;
		    }
		    if (data.firewall){
			value = value + 'f';
		    }
		}
		if (value) {
		    tmparray.push(key + '=' + value);
		}

	    });
	    netarray.push(tmparray.join(','));
	});

	return netarray.join(';');
    },

    parseLxcNetwork: function(value) {
	if (!value) {
	    return;
	}

	var data = {};
	Ext.Array.each(value.split(','), function(p) {
	    if (!p || p.match(/^\s*$/)) {
		return; // continue
	    }
	    var match_res = p.match(/^(bridge|hwaddr|mtu|name|ip|ip6|gw|gw6|firewall|tag|rate)=(\S+)$/);
	    if (!match_res) {
		// todo: simply ignore errors ?
		return; // continue
	    }
	    data[match_res[1]] = match_res[2];
	});

	return data;
    },

    printLxcNetwork: function(data) {
	var tmparray = [];
	Ext.Array.each(['bridge', 'hwaddr', 'mtu', 'name', 'ip',
			'gw', 'ip6', 'gw6', 'firewall', 'tag'], function(key) {
		var value = data[key];
		if (value) {
		    tmparray.push(key + '=' + value);
		}
	});

	/*jslint confusion: true*/
	if (data.rate > 0) {
	    tmparray.push('rate=' + data.rate);
	}
	/*jslint confusion: false*/
	return tmparray.join(',');
    },

    parseLxcMountPoint: function(value) {
	if (!value) {
	    return;
	}

	var res = {};

	var errors = false;
	Ext.Array.each(value.split(','), function(p) {
	    if (!p || p.match(/^\s*$/)) {
		return; // continue
	    }
	    var match_res = p.match(/^([a-z_]+)=(\S+)$/);
	    if (!match_res) {
		if (!p.match(/\=/)) {
		    res.file = p;
		    return; // continue
		}
		errors = true;
		return false; // break
	    }
	    var k = match_res[1];
	    if (k === 'volume') {
		k = 'file';
	    }

	    if (Ext.isDefined(res[k])) {
		errors = true;
		return false; // break
	    }

	    var v = match_res[2];

	    res[k] = v;
	});

	if (errors || !res.file) {
	    return;
	}

	var m = res.file.match(/^([a-z][a-z0-9\-\_\.]*[a-z0-9]):/i);
	if (m) {
	    res.storage = m[1];
	    res.type = 'volume';
	} else if (res.file.match(/^\/dev\//)) {
	    res.type = 'device';
	} else {
	    res.type = 'bind';
	}

	return res;
    },

    printLxcMountPoint: function(mp) {
	var drivestr = mp.file;

	Ext.Object.each(mp, function(key, value) {
	    if (!Ext.isDefined(value) || key === 'file' ||
		key === 'type' || key === 'storage') {
		return; // continue
	    }
	    drivestr += ',' + key + '=' + value;
	});

	return drivestr;
    },

    parseStartup: function(value) {
	if (value === undefined) {
	    return;
	}

	var res = {};

	var errors = false;
	Ext.Array.each(value.split(','), function(p) {
	    if (!p || p.match(/^\s*$/)) {
		return; // continue
	    }

	    var match_res;

	    if ((match_res = p.match(/^(order)?=(\d+)$/)) !== null) {
		res.order = match_res[2];
	    } else if ((match_res = p.match(/^up=(\d+)$/)) !== null) {
		res.up = match_res[1];
	    } else if ((match_res = p.match(/^down=(\d+)$/)) !== null) {
                res.down = match_res[1];
	    } else {
		errors = true;
		return false; // break
	    }
	});

	if (errors) {
	    return;
	}

	return res;
    },

    printStartup: function(startup) {
	var arr = [];
	if (startup.order !== undefined && startup.order !== '') {
	    arr.push('order=' + startup.order);
	}
	if (startup.up !== undefined && startup.up !== '') {
	    arr.push('up=' + startup.up);
	}
	if (startup.down !== undefined && startup.down !== '') {
	    arr.push('down=' + startup.down);
	}

	return arr.join(',');
    },

    parseQemuSmbios1: function(value) {
	var res = {};

	Ext.Array.each(value.split(','), function(p) {
	    var kva = p.split('=', 2);
	    res[kva[0]] = kva[1];
	});

	return res;
    },

    printQemuSmbios1: function(data) {

	var datastr = '';

	Ext.Object.each(data, function(key, value) {
	    if (value === '') { return; }
	    datastr += (datastr !== '' ? ',' : '') + key + '=' + value;
	});

	return datastr;
    },

    parseTfaConfig: function(value) {
	var res = {};

	Ext.Array.each(value.split(','), function(p) {
	    var kva = p.split('=', 2);
	    res[kva[0]] = kva[1];
	});

	return res;
    },

    parseQemuCpu: function(value) {
	if (!value) {
	    return {};
	}

	var res = {};

	var errors = false;
	Ext.Array.each(value.split(','), function(p) {
	    if (!p || p.match(/^\s*$/)) {
		return; // continue
	    }

	    if (!p.match(/\=/)) {
		if (Ext.isDefined(res.cpu)) {
		    errors = true;
		    return false; // break
		}
		res.cputype = p;
		return; // continue
	    }

	    var match_res = p.match(/^([a-z_]+)=(\S+)$/);
	    if (!match_res) {
		errors = true;
		return false; // break
	    }

	    var k = match_res[1];
	    if (Ext.isDefined(res[k])) {
		errors = true;
		return false; // break
	    }

	    res[k] = match_res[2];
	});

	if (errors || !res.cputype) {
	    return;
	}

	return res;
    },

    printQemuCpu: function(cpu) {
	var cpustr = cpu.cputype;
	var optstr = '';

	Ext.Object.each(cpu, function(key, value) {
	    if (!Ext.isDefined(value) || key === 'cputype') {
		return; // continue
	    }
	    optstr += ',' + key + '=' + value;
	});

	if (!cpustr) {
	    if (optstr) {
		return 'kvm64' + optstr;
	    }
	    return;
	}

	return cpustr + optstr;
    },

    parseSSHKey: function(key) {
	//                |--- options can have quotes--|     type    key        comment
	var keyre = /^(?:((?:[^\s"]|\"(?:\\.|[^"\\])*")+)\s+)?(\S+)\s+(\S+)(?:\s+(.*))?$/;
	var typere = /^(?:ssh-(?:dss|rsa|ed25519)|ecdsa-sha2-nistp\d+)$/;

	var m = key.match(keyre);
	if (!m) {
	    return null;
	}
	if (m.length < 3 || !m[2]) { // [2] is always either type or key
	    return null;
	}
	if (m[1] && m[1].match(typere)) {
	    return {
		type: m[1],
		key: m[2],
		comment: m[3]
	    };
	}
	if (m[2].match(typere)) {
	    return {
		options: m[1],
		type: m[2],
		key: m[3],
		comment: m[4]
	    };
	}
	return null;
    }
}});
// Sencha Touch related things

Proxmox.Utils.toolkit = 'touch',

Ext.Ajax.setDisableCaching(false);

// do not send '_dc' parameter
Ext.Ajax.disableCaching = false;
Ext.define('PVE.RestProxy', {
    extend: 'Ext.data.RestProxy',
    alias : 'proxy.pve',

    constructor: function(config) {
	var me = this;

	config = config || {};

	Ext.applyIf(config, {
	    pageParam : null,
	    startParam: null,
	    limitParam: null,
	    groupParam: null,
	    sortParam: null,
	    filterParam: null,
	    noCache : false,
	    reader: {
		type: 'json',
		rootProperty: config.root || 'data'
	    },
	    afterRequest: function(request, success) {
		me.fireEvent('afterload', me, request, success);
		return;
	    }
	});

	me.callParent([config]); 
    }
});

Ext.define('pve-domains', {
    extend: "Ext.data.Model",

    config: {
	fields: [ 'realm', 'type', 'comment', 'default', 'tfa',
		  { 
		      name: 'descr',
		      // Note: We use this in the RealmComboBox.js
		      // (see Bug #125)
		      convert: function(value, record) {
			  var info = record.data;
			  var text;

			  if (value) {
			      return value;
			  }
			  // return realm if there is no comment
			  text = info.comment || info.realm;

			  if (info.tfa) {
			      text += " (+ " + info.tfa + ")";
			  }

			  return text;
		      }
		  }
		],
	proxy: {
	    type: 'pve',
	    url: "/api2/json/access/domains"
	}
    }
});

Ext.define('pve-tasks', {
    extend: 'Ext.data.Model',
    config: {
	fields:  [ 
	    { name: 'starttime', type : 'date', dateFormat: 'timestamp' }, 
	    { name: 'endtime', type : 'date', dateFormat: 'timestamp' }, 
	    { name: 'pid', type: 'int' },
	    'node', 'upid', 'user', 'status', 'type', 'id'
	],
	idProperty: 'upid'
    }
});
Ext.define('PVE.MenuButton', {
    extend: 'Ext.Button',
    alias: 'widget.pveMenuButton',

    menuPanel: undefined,

    createMenuPanel: function() {
	var me = this;

	var data = me.getMenuItems() || [];

	var addHide = function (fn) {
	    return function () {
		if (me.menuPanel) {
		    me.menuPanel.hide();
		    Ext.Viewport.remove(me.menuPanel);
		    me.menuPanel.destroy();
		    me.menuPanel = undefined;
		}
		return fn.apply(this, arguments);
	    };
	};

	var items = [];

	if (me.getPveStdMenu()) {
	    items.push({
		xtype: 'button',
		ui: 'plain',
		text: gettext('Datacenter'),
		handler: addHide(function() {
		    PVE.Workspace.gotoPage('');
		})
	    });
	}

	data.forEach(function(el) {
	    items.push(Ext.apply(el, {
		xtype: 'button',
		ui: 'plain',
		handler: addHide(el.handler)
	    }));
	});

	if (me.getPveStdMenu()) {
	    items.push({ 
		xtype: 'button',
		ui: 'plain',
		text: gettext('Logout'),
		handler: addHide(function() {
		    PVE.Workspace.showLogin();
		})
	    });
	}

	me.menuPanel = Ext.create('Ext.Panel', {
	    modal: true,
	    hideOnMaskTap: true,
	    visible: false,
	    minWidth: 200,
	    layout: {
		type:'vbox',
		align: 'stretch'
	    },
	    items: items
	});

	PVE.Workspace.history.on('change', function() {
	    if (me.menuPanel) {
		Ext.Viewport.remove(me.menuPanel);
		me.menuPanel.destroy();
		me.menuPanel = undefined;
	    }
	});
    },

    config: {
	menuItems: undefined,
	pveStdMenu: false, // add LOGOUT
	handler:  function() {
	    var me = this;

	    if (!me.menuPanel) {
		me.createMenuPanel();
	    }
	    me.menuPanel.showBy(me, 'tr-bc?');
	}
    },

    initialize: function() {
	var me = this;

        this.callParent();

	if (me.getPveStdMenu()) {
	    me.setIconCls('more');
	}

    }
});
Ext.define('PVE.ATitleBar', {
    extend: 'Ext.TitleBar',
    alias: ['widget.pveTitleBar'],

    config: {
	docked: 'top',
	pveReloadButton: true,
	pveBackButton: true,
	pveStdMenu: true // add 'Login' and 'Datacenter' to menu by default
    },

    initialize: function() {
	var me = this;

	me.callParent();

	var items = [];

	if (me.getPveBackButton()) {
	    items.push({
		align: 'left',
		iconCls: 'arrow_left',
		handler: function() {
		    PVE.Workspace.goBack();
		}
	    });
	}

	if (me.getPveReloadButton()) {
	    items.push({
		align: 'right',
		iconCls: 'refresh',
		handler: function() {
		    this.up('pvePage').reload();
		}
	    });
	}

	items.push({
	    xtype: 'pveMenuButton',
	    align: 'right',
	    pveStdMenu: me.getPveStdMenu()
	});

	me.setItems(items);
    }


});
Ext.define('PVE.Page', {
    extend: 'Ext.Container',
    alias: 'widget.pvePage',

    statics: {
	pathMatch: function(loc) {
	    throw "implement this in subclass";
	}
    },

   config: {
	layout: 'vbox',
	appUrl: undefined
   }
});

Ext.define('PVE.ErrorPage', {
    extend: 'Ext.Panel',

    config: {
	html: "no such page",
	padding: 10,
	layout: {
	    type: 'vbox',
	    pack: 'center',
	    align: 'stretch'
	},
	items: [
	    {
		xtype: 'pveTitleBar',
		pveReloadButton: false,
		title: gettext('Error')
	    }
	]
    }
});

Ext.define('PVE.Workspace', { statics: {
    // this class only contains static functions

    loginData: null, // Data from last login call

    appWindow: null,

    history: null,

    pages: [ 
	'PVE.LXCMigrate',
	'PVE.LXCSummary',
	'PVE.QemuMigrate',
	'PVE.QemuSummary',
	'PVE.NodeSummary', 
	'PVE.ClusterTaskList',
	'PVE.NodeTaskList',
	'PVE.TaskViewer',
	'PVE.Datacenter'
    ],

    setHistory: function(h) {
	PVE.Workspace.history = h;

	PVE.Workspace.history.setUpdateUrl(true);

	PVE.Workspace.loadPage(PVE.Workspace.history.getToken());
	PVE.Workspace.history.on('change', function(loc) {
	    PVE.Workspace.loadPage(loc);
	});
    },

    goBack: function() {
	var actions = PVE.Workspace.history.getActions(),
	    lastAction = actions[actions.length - 2];

	var url = '';
	if(lastAction) {
	    actions.pop();
	    url = lastAction.getUrl();
	}

	// use loadPage directly so we don't cause new additions to the history
	PVE.Workspace.loadPage(url);
    },

    __setAppWindow: function(comp, dir) {

	var old = PVE.Workspace.appWindow;

	PVE.Workspace.appWindow = comp;

	if (old) {
	    if (dir === 'noanim') {
		Ext.Viewport.setActiveItem(PVE.Workspace.appWindow);
	    } else {
		var anim = { type: 'slide', direction: dir || 'left' };
		Ext.Viewport.animateActiveItem(PVE.Workspace.appWindow, anim);
	    }
	    // remove old after anim (hack, because anim.after does not work in 2.3.1a)
	    Ext.Function.defer(function(){
		if (comp !== old) {
		    Ext.Viewport.remove(old);
		}
	    }, 500);
	} else {
	    Ext.Viewport.setActiveItem(PVE.Workspace.appWindow);
	}
    },

    updateLoginData: function(loginData) {
	PVE.Workspace.loginData = loginData;
	Proxmox.CSRFPreventionToken = loginData.CSRFPreventionToken;
	Proxmox.UserName = loginData.username;

	// creates a session cookie (expire = null) 
	// that way the cookie gets deleted after browser window close
	Ext.util.Cookies.set('PVEAuthCookie', loginData.ticket, null, '/', null, true);

	PVE.Workspace.gotoPage('');
    },

    showLogin: function() {
	Proxmox.Utils.authClear();
	Proxmox.UserName = null;
	PVE.Workspace.loginData = null;

	PVE.Workspace.gotoPage('');
    },

    gotoPage: function(loc) {
	var match;

	var old = PVE.Workspace.appWindow;

	if (old.getAppUrl) {
	    var old_loc = old.getAppUrl();
	    if (old_loc !== loc) {
		PVE.Workspace.history.add(Ext.create('Ext.app.Action', { url: loc }));
	    } else {
		PVE.Workspace.loadPage(loc);
	    }
	} else {
	    PVE.Workspace.history.add(Ext.create('Ext.app.Action', { url: loc }));
	}
    },

    loadPage: function(loc) {
	loc = loc || '';

	var comp;

	if (!Proxmox.Utils.authOK()) {
	    comp = Ext.create('PVE.Login', {});
	} else {
	    Ext.Array.each(PVE.Workspace.pages, function(p, index) {
		var c = Ext.ClassManager.get(p);
		var match = c.pathMatch(loc);
		if (match) {
		    comp = Ext.create(p, { appUrl: loc });
		    return false; // stop iteration
		}
	    });
	    if (!comp) {
		comp = Ext.create('PVE.ErrorPage', {});
	    }
	}
	
	PVE.Workspace.__setAppWindow(comp, 'noanim');
    },

    obj_to_kv: function(d, names) {
	var kv = [];
	var done = { digest: 1 };
	var pushItem = function(item) {
	    if (done[item.key]) return;
	    done[item.key] = 1;
	    if (item.value) kv.push(item);
	}

	var keys = Ext.Array.sort(Ext.Object.getKeys(d));
	Ext.Array.each(names, function(k) {
	    if (typeof(k) === 'object') {
		Ext.Array.each(keys, function(n) {
		    if (k.test(n)) {
			pushItem({ key: n, value: d[n] });
		    }
		});
	    } else {

		pushItem({ key: k, value: d[k] });
	    }
	});
	Ext.Array.each(keys, function(k) {
	    pushItem({ key: k, value: d[k] });
	});
	return kv;
    }

}});
Ext.define('PVE.form.NodeSelector', {
    extend: 'Ext.field.Select',
    alias: ['widget.pveNodeSelector'],

    config: {
	autoSelect: false,
	valueField: 'node',
	displayField: 'node',
	store: {
	    fields: [ 'node', 'cpu', 'maxcpu', 'mem', 'maxmem', 'uptime' ],
	    autoLoad: true,
	    proxy: {
		type: 'pve',
		url: '/api2/json/nodes'
	    },
	    sorters: [
		{
		    property : 'node',
		    direction: 'ASC'
		}
	    ]
	},
 	value: ''
    }
});
Ext.define('PVE.form.RealmSelector', {
    extend: 'Ext.field.Select',
    alias: ['widget.pveRealmSelector'],

    config: {
	autoSelect: false,
	valueField: 'realm',
	displayField: 'descr',
	store: { model: 'pve-domains' },
 	value: 'pam'
    },

    needOTP: function(realm) {
	var me = this;

	var realmstore = me.getStore();

	var rec = realmstore.findRecord('realm', realm);

	return rec && rec.data && rec.data.tfa ? rec.data.tfa : undefined;
    },

    initialize: function() {
	var me = this;

	me.callParent();
	
	var realmstore = me.getStore();

	realmstore.load({
	    callback: function(r, o, success) {
		if (success) {
		    var def = me.getValue();
		    if (!def || !realmstore.findRecord('realm', def)) {
			def = 'pam';
			Ext.each(r, function(record) {
			    if (record.get('default')) { 
				def = record.get('realm');
			    }
			});
		    }
		    if (def) {
			me.setValue(def);
		    }
		}
	    }
	});
    }
});
Ext.define('PVE.Login', {
    extend: 'Ext.form.Panel',
    alias: "widget.pveLogin",
    config: {
	title: 'Login',
	padding: 10,
	appUrl: 'login',
	items: [
	    {
		xtype: 'image',
		src: '/pve2/images/proxmox_logo.png',
		height: 30,
		width: 209
	    },
	    {
	        xtype: 'fieldset',
	        title: 'Proxmox VE Login',
	        items: [
	            {
	                xtype: 'textfield',
	                placeHolder: gettext('User name'),
	                itemId: 'userNameTextField',
	                name: 'username',
	                required: true
	            },
	            {
	                xtype: 'passwordfield',
	                placeHolder: gettext('Password'),
	                itemId: 'passwordTextField',
	                name: 'password',
	                required: true
	            },
		    {
			xtype: 'textfield',
	                itemId: 'otpField',
			placeHolder: gettext('OTP'), 
			name: 'otp',
			allowBlank: false,
			hidden: true
		    },
		    {
			xtype: 'pveRealmSelector',
	                itemId: 'realmSelectorField',
			name: 'realm',
			listeners: {
			    change: function(f, value) {
				var form = this.up('formpanel');

				var otp_field = form.down('#otpField');

				if (f.needOTP(value)) {
				    otp_field.setHidden(false);
				    otp_field.enable();
				} else {
				    otp_field.setHidden(true);
				    otp_field.disable();
				}
			    }
			}
		    }
	        ]
	    },
	    {
	        xtype: 'label',
                html: 'Login failed. Please enter the correct credentials.',
	        itemId: 'signInFailedLabel',
	        hidden: true,
	        hideAnimation: 'fadeOut',
	        showAnimation: 'fadeIn',
	        style: 'color:#990000;margin:5px 0px;'
	    },
	    {
	        xtype: 'button',
	        itemId: 'logInButton',
	        ui: 'action',
	        text: 'Log In',
		handler: function() {
                    var form = this.up('formpanel');

		    var usernameField = form.down('#userNameTextField'),
	            passwordField = form.down('#passwordTextField'),
		    realmField = form.down('#realmSelectorField'),
		    otpField = form.down('#otpField'),
	            label = form.down('#signInFailedLabel');

		    label.hide();

		    var username = usernameField.getValue();
	            var password = passwordField.getValue();
	            var realm = realmField.getValue();
		    var otp = otpField.getValue();

		    Proxmox.Utils.API2Request({
			url: '/access/ticket',
			method: 'POST',
			waitMsgTarget: form,
			params: { username: username, password: password, realm: realm, otp: otp},
			failure: function(response, options) {
			    label.show();
			},
			success: function(response, options) {
			    usernameField.setValue('');
			    passwordField.setValue('');
			    PVE.Workspace.updateLoginData(response.result.data);
			}
		    });
		}
	    }
	]
    }
});
Ext.define('PVE.TaskListBase', {
    extend: 'PVE.Page',

    config: {
	baseUrl: undefined,
	items: [
	    {
		xtype: 'pveTitleBar'
	    },
	    {
		xtype: 'list',
		flex: 1,
		disableSelection: true,
		listeners: {
		    itemsingletap: function(list, index, target, record) {
			PVE.Workspace.gotoPage('nodes/' + record.get('node') + '/tasks/' + 
					       record.get('upid'));
		    }
		},
		itemTpl: [
		    '<div style="vertical-align: middle;">' +
		    '<span>{[this.desc(values)]}</span>',
		    '<span style=" font-size:small; float: right;">' +
		    '{starttime:date("M d H:i:s")} - {endtime:date("H:i:s")}' +
		    '</span></div>',
		    '<small>node: {node}<br /> Status: {[this.status(values)]}</small>',
		    {
			desc: function(values) {
			    return Proxmox.Utils.format_task_description(values.type, values.id);
			},
			status: function(values) {
			    return Ext.String.ellipsis(values.status, 160);
			}
		    }
		]
	    }
	]
    },

    reload: function() {
	var me = this;

	me.store.load();
    },

    initialize: function() {
	var me = this;

	me.store = Ext.create('Ext.data.Store', {
	    model: 'pve-tasks',
	    proxy: {
                type: 'pve',
		url: '/api2/json' + me.getBaseUrl()
	    },
	    sorters: [
		{
		    property : 'starttime',
		    direction: 'DESC'
		}
	    ]
	});

	var list = me.down('list');
	list.setStore(me.store);

	me.reload();
	
	this.callParent();
    }
});

Ext.define('PVE.ClusterTaskList', {
    extend: 'PVE.TaskListBase',

    statics: {
	pathMatch: function(loc) {
	    return loc.match(/^tasks$/);
	}
    },

    config: {
	baseUrl: '/cluster/tasks'
    },

    initialize: function() {
	var me = this;

	me.down('titlebar').setTitle(gettext('Tasks') + ': ' + gettext('Cluster'));

	var match = me.self.pathMatch(me.getAppUrl());
	if (!match) {
	    throw "pathMatch failed";
	}

	this.callParent();
    }
});

Ext.define('PVE.NodeTaskList', {
    extend: 'PVE.TaskListBase',

    statics: {
	pathMatch: function(loc) {
	    return loc.match(/^nodes\/([^\s\/]+)\/tasks$/);
	}
    },

    nodename: undefined,

    initialize: function() {
	var me = this;

	var match = me.self.pathMatch(me.getAppUrl());
	if (!match) {
	    throw "pathMatch failed";
	}

	me.nodename = match[1];

	me.setBaseUrl('/nodes/' + me.nodename + '/tasks');

	me.down('titlebar').setTitle(gettext('Tasks') + ': ' + me.nodename);

	this.callParent();
    }
});


Ext.define('PVE.TaskViewer', {
    extend: 'PVE.Page',
    alias: 'widget.pveTaskViewer',

    statics: {
	pathMatch: function(loc) {
	    return loc.match(/^nodes\/([^\s\/]+)\/tasks\/([^\s\/]+)$/);
	}
    },

    nodename: undefined,
    upid: undefined,
    taskInfo: undefined,
    taskStatus: 'running', // assume running

    config: {
	items: [
	    { 
		xtype: 'pveTitleBar'
	    },
	    {
		itemId: 'taskStatus',
		xtype: 'component',
		styleHtmlContent: true,
		style: 'background-color:white;',
		data: [],
		tpl: [
		    '<table style="margin-bottom:0px;">',
		    '<tpl for=".">',
		    '<tr><td>{key}</td><td>{value}</td></tr>',
		    '</tpl>',
		    '</table>'
		]
 	    },
	    {
		xtype: 'component',
		cls: 'dark',
 		padding: 5,
		html: gettext('Log')
	    },
	    {
		itemId: 'taskLog',
		xtype: 'container',
		flex: 1,
		scrollable: 'both',
		styleHtmlContent: true,
		style: 'background-color:white;white-space: pre;font-family: Monospace;',
		data: {},
		tpl: '{text}'
	    }
	]
    },

    reloadLog: function() {
	var me = this;

	var logCmp = me.down('#taskLog');

	Proxmox.Utils.API2Request({
	    url: "/nodes/" + me.nodename + "/tasks/" + me.upid + "/log",
	    method: 'GET',
	    success: function(response) {
		var d = response.result.data;

		var text = '';
		Ext.Array.each(d, function(el) {
		    text += Ext.htmlEncode(el.t) + "\n";
		});
		logCmp.setData({ text: text });
	    },
	    failure: function(response) {
		logCmp.setData({ text: response.htmlStatus } );
	    }
	});
    },

    reload: function() {
	var me = this;

	var statusCmp = me.down('#taskStatus');
	var logCmp = me.down('#taskLog');

	Proxmox.Utils.API2Request({
	    url: "/nodes/" + me.nodename + "/tasks/" + me.upid + "/status",
	    method: 'GET',
	    success: function(response) {
		me.reloadLog();

		var d = response.result.data;
		var kv = [];

		kv.push({ key: gettext('Taskstatus'), value: d.status });
		kv.push({ key: gettext('Node'), value: d.node });
		kv.push({ key: gettext('User'), value: d.user });
		kv.push({ key: gettext('Starttime'), value: Proxmox.Utils.render_timestamp(d.starttime) });

		me.setMasked(false);
		statusCmp.setData(kv);
		if (d.status !== 'stopped') {
		    Ext.defer(me.reload, 2000, me);
		}
	    },
	    failure: function(response) {
		me.setMasked({ xtype: 'loadmask', message: response.htmlStatus} );
	    }
	});
    },

   initialize: function() {
       var me = this;

       var match = me.self.pathMatch(me.getAppUrl());
       if (!match) {
	   throw "pathMatch failed";
       }

       me.nodename = match[1];
       me.upid = match[2];

       me.taskInfo = Proxmox.Utils.parse_task_upid(me.upid);

       me.down('titlebar').setTitle(me.taskInfo.desc);

       me.reload();

	this.callParent();
    }
});
Ext.define('PVE.ClusterInfo', {
    extend: 'Ext.Component',
    alias: 'widget.pveClusterInfo',

    config: {
	style: 'background-color: white;',
	styleHtmlContent: true,
	tpl: [
	    '<table style="margin-bottom:0px;">',
	    '<tr><td>Node:</td><td><b>{local_node}</large></b></tr>',
	    '<tpl if="cluster_name">',
	    '<tr><td>Cluster:</td><td>{cluster_name}</td></tr>',
	    '<tr><td>Members:</td><td>{nodes}</td></tr>',
	    '<tr><td>Quorate:</td><td>{quorate}</td></tr>',
	    '</tpl>',
	    '<tr><td>Version:</td><td>{version}</td></tr>',
	    '</table>',
	]
    },
});

Ext.define('PVE.Datacenter', {
    extend: 'PVE.Page',
    alias: 'widget.pveDatacenter',

    statics: {
	pathMatch: function(loc) {
	    if (loc === '') {
		return [''];
	    }
	}
    },

    config: {
	appUrl: '',
	items: [
	    {
		xtype: 'pveTitleBar',
		title: gettext('Datacenter'),
		pveBackButton: false
	    },
	    {
 		xtype: 'pveClusterInfo'
	    },
            {
                xtype: 'component',
                cls: 'dark',
		padding: 5,
 		html: gettext('Nodes')
            },
	    {
		xtype: 'list',
		flex: 1,
		disableSelection: true,
		sorters: 'name',
		listeners: {
		    itemsingletap: function(list, index, target, record) {
			PVE.Workspace.gotoPage('nodes/' + record.get('name'));
		    } 
		},
		itemTpl: '{name}' +
		    '<br><small>Online: {[Proxmox.Utils.format_boolean(values.online)]}</small>' +
		    '<br><small>Support: {[PVE.Utils.render_support_level(values.level)]}</small>'
	    }
	]	
    },

    reload: function() {
	var me = this;

	var ci = me.down('pveClusterInfo');

	me.setMasked(false);

	me.summary = {};

	Proxmox.Utils.API2Request({
	    url: '/version',
	    method: 'GET',
	    success: function(response) {
		var d = response.result.data;
		me.summary.version = d.version + '-' + d.release + '/' + d.repoid;
		ci.setData(me.summary);
	    }
	});

	var list = me.down('list');

	Proxmox.Utils.API2Request({
	    url: '/cluster/status',
	    method: 'GET',
	    success: function(response) {
		var d = response.result.data;
		list.setData(d.filter(function(el) { return (el.type === "node"); }));

		d.forEach(function(el) {
		    if (el.type === "node") {
			if (el.local) {
			    me.summary.local_node = el.name;
			}
		    } else if (el.type === "cluster") {
			me.summary.nodes = el.nodes;
			me.summary.quorate = Proxmox.Utils.format_boolean(el.quorate);
			me.summary.cluster_name = el.name;
		    }
		});

		ci.setData(me.summary);
	    },
	    failure: function(response) {
		me.setMasked({ xtype: 'loadmask', message: response.htmlStatus} );
	    }
	});
    },

    initialize: function() {
	var me = this;

	me.down('pveMenuButton').setMenuItems([
	    {
		text: gettext('Tasks'),
		handler: function() {
		    PVE.Workspace.gotoPage('tasks');
		}
	    }
	]);

	me.reload();
    }

});

Ext.define('PVE.NodeInfo', {
    extend: 'Ext.Component',
    alias: 'widget.pveNodeInfo',

    config: {
	style: 'background-color: white;',
	styleHtmlContent: true,
	data: [],
	tpl: [
	    '<table style="margin-bottom:0px;">',
	    '<tr><td>Version:</td><td>{pveversion}</td></tr>',
	    '<tr><td>Memory:</td><td>{[this.meminfo(values)]}</td></tr>',
	    '<tr><td>CPU:</td><td>{[this.cpuinfo(values)]}</td></tr>',
	    '<tr><td>Uptime:</td><td>{[Proxmox.Utils.format_duration_long(values.uptime)]}</td></tr>',
	    '</table>',
	    {
		meminfo: function(values) {
		    var d = values.memory;
		    if (!d) {
			return '-';
		    }
		    return Proxmox.Utils.format_size(d.used || 0) + " of " + Proxmox.Utils.format_size(d.total);
		},
		cpuinfo: function(values) {
		    if (!values.cpuinfo) {
			return '-';
		    }
		    var per = values.cpu * 100;
		    return per.toFixed(2) + "% (" + values.cpuinfo.cpus + " CPUs)";
		}
	    }
	]
    },
});

Ext.define('PVE.NodeSummary', {
    extend: 'PVE.Page',
    alias: 'widget.pveNodeSummary',

    statics: {
	pathMatch: function(loc) {
	    return loc.match(/^nodes\/([^\s\/]+)$/);
	}
    },

    nodename: undefined,

    config: {
	items: [
	    { 
		xtype: 'pveTitleBar'
	    },
	    {
		xtype: 'pveNodeInfo'
	    },
            {
                xtype: 'component',
                cls: 'dark',
		padding: 5,
 		html: gettext('Virtual machines')
            },
	    {
		xtype: 'list',
		flex: 1,
		disableSelection: true,
		listeners: {
		    itemsingletap: function(list, index, target, record) {
			PVE.Workspace.gotoPage('nodes/' + record.get('nodename') + '/' + 
					       record.get('type') + '/' + record.get('vmid'));
		    } 
		},
		grouped: true,
		itemTpl: [
		    '{name}<br>',
		    '<small>',
		    'id: {vmid} ',
		    '<tpl if="uptime">',
		    'cpu: {[this.cpuinfo(values)]} ',
		    'mem: {[this.meminfo(values)]} ',
		    '</tpl>',
		    '</small>',
		    {
			meminfo: function(values) {
			    if (!values.uptime) {
				return '-';
			    }
			    return Proxmox.Utils.format_size(values.mem);
			},
			cpuinfo: function(values) {
			    if (!values.uptime) {
				return '-';
			    }
			    return (values.cpu*100).toFixed(1) + '%';
			}
		    }
		]
	    }
	]
    },

    reload: function() {
 	var me = this;

	var ni = me.down('pveNodeInfo');

	Proxmox.Utils.API2Request({
	    url: '/nodes/' + me.nodename + '/status',
	    method: 'GET',
	    success: function(response) {
		var d = response.result.data;
		if (d.pveversion) {
		    d.pveversion = d.pveversion.replace(/pve\-manager\//, '');
		}
		ni.setData(d);
	    }
	});


	var list = me.down('list');

	list.setMasked(false);

	var error_handler = function(response) {
	    list.setMasked({ xtype: 'loadmask', message: response.htmlStatus} );
	};

	Proxmox.Utils.API2Request({
	    url: '/nodes/' + me.nodename + '/lxc',
	    method: 'GET',
	    success: function(response) {
		var d = response.result.data;
		d.nodename = me.nodename;
		d.forEach(function(el) { el.type = 'lxc'; el.nodename = me.nodename });
		me.store.each(function(rec) {
		    if (rec.get('type') === 'lxc') {
			rec.destroy();
		    }
		});
		me.store.add(d);
	    },
	    failure: error_handler
	});

	Proxmox.Utils.API2Request({
	    url: '/nodes/' + me.nodename + '/qemu',
	    method: 'GET',
	    success: function(response) {
		var d = response.result.data;
		d.forEach(function(el) { el.type = 'qemu'; el.nodename = me.nodename });
		me.store.each(function(rec) {
		    if (rec.get('type') === 'qemu') {
			rec.destroy();
		    }
		});
		me.store.add(d);
	    },
	    failure: error_handler
	});

    },

    initialize: function() {
	var me = this;

	var match = me.self.pathMatch(me.getAppUrl());
	if (!match) {
	    throw "pathMatch failed";
	}

	me.nodename = match[1];

	me.down('titlebar').setTitle(gettext('Node') + ': ' + me.nodename);

	me.down('pveMenuButton').setMenuItems([
	    {
		text: gettext('Tasks'),
		handler: function() {
		    PVE.Workspace.gotoPage('nodes/' + me.nodename + '/tasks');
		}
	    },
	]);

	me.store = Ext.create('Ext.data.Store', {
	    fields: [ 'name', 'vmid', 'nodename', 'type', 'memory', 'uptime', 'mem', 'maxmem', 'cpu', 'cpus'],
	    sorters: ['vmid'],
	    grouper: {
		groupFn: function(record) {
		    return record.get('type');
		}
	    },
	});

	var list = me.down('list');
	list.setStore(me.store);

	me.reload();

	this.callParent();
    }
});
Ext.define('PVE.MigrateBase', {
    extend: 'PVE.Page',

    nodename: undefined,
    vmid: undefined,
    vmtype: undefined, // qemu or lxc

    config: {
	items: [
	    {
		xtype: 'pveTitleBar',
		pveReloadButton: false
	    },
	    { 
		xtype: 'formpanel',
		flex: 1,
		padding: 10,
		items: [
		    {
			xtype: 'fieldset',
			items: [
			    {
				xtype: 'pveNodeSelector',
				placeHolder: gettext('Target node'),
				name: 'target',
				required: true,
			    },
			    {
				xtype: 'checkboxfield',
				name : 'online',
				checked: true,
				label: gettext('Online')
			    }
			]
		    },
		    {
			xtype: 'button',
			itemId: 'migrate',
			ui: 'action',
			text: gettext('Migrate')
		    }
		]
	    }
	]
    },

    initialize: function() {
	var me = this;

	var btn = me.down('#migrate');

	btn.setHandler(function() {
	    var form = this.up('formpanel');
	    var values = form.getValues();
	    
	    if (!values.target) {
		Ext.Msg.alert('Error', 'Please select a target node');
		return;
	    }

	    Proxmox.Utils.API2Request({
		params: { target: values.target, online: values.online ? 1 : 0 },
		url: '/nodes/' + me.nodename + '/' + me.vmtype + '/' + me.vmid + "/migrate",
		method: 'POST',
		failure: function(response, opts) {
		    Ext.Msg.alert('Error', response.htmlStatus);
		},
		success: function(response, options) {
		    var upid = response.result.data;
		    var page = 'nodes/'  + me.nodename + '/tasks/' + upid;
		    PVE.Workspace.gotoPage(page);
		}
	    });
	});
    }
});

Ext.define('PVE.QemuMigrate', {
    extend: 'PVE.MigrateBase',

    vmtype: 'qemu',

    statics: {
	pathMatch: function(loc) {
	    return loc.match(/^nodes\/([^\s\/]+)\/qemu\/(\d+)\/migrate$/);
	}
    },

    initialize: function() {
	var me = this;

	var match = me.self.pathMatch(me.getAppUrl());
	if (!match) {
	    throw "pathMatch failed";
	}

	me.nodename = match[1];
	me.vmid = match[2];

	me.down('titlebar').setTitle(gettext('Migrate') + ': VM ' + me.vmid);

	this.callParent();
    }
});

Ext.define('PVE.LXCMigrate', {
    extend: 'PVE.MigrateBase',

    vmtype: 'lxc',

    statics: {
	pathMatch: function(loc) {
	    return loc.match(/^nodes\/([^\s\/]+)\/lxc\/(\d+)\/migrate$/);
	}
    },

    initialize: function() {
	var me = this;

	var match = me.self.pathMatch(me.getAppUrl());
	if (!match) {
	    throw "pathMatch failed";
	}

	me.nodename = match[1];
	me.vmid = match[2];

	me.down('titlebar').setTitle(gettext('Migrate') + ': CT ' + me.vmid);

	this.callParent();
    }
});
Ext.define('PVE.VMSummaryBase', {
    extend: 'PVE.Page',

    nodename: undefined,
    vmid: undefined,
    vmtype: undefined, // qemu or lxc

    // defines the key/value config keys do display
    config_keys: undefined,

    vm_command: function(cmd, params) {
	var me = this;

	Proxmox.Utils.API2Request({
	    params: params,
	    url: '/nodes/' + me.nodename + '/' + me.vmtype + '/' + me.vmid +
		 '/status/' + cmd,
	    method: 'POST',
	    success: function(response, opts) {
		var upid = response.result.data;
		var page = 'nodes/' + me.nodename + '/tasks/' + upid;
		PVE.Workspace.gotoPage(page);
	    },
	    failure: function(response, opts) {
		Ext.Msg.alert('Error', response.htmlStatus);
	    }
	});
    },

    config: {
	items: [
	    {
		xtype: 'pveTitleBar'
	    },
	    {
		xtype: 'component',
		itemId: 'vmstatus',
		styleHtmlContent: true,
		style: 'background-color:white;',
		tpl: [
		    '<table style="margin-bottom:0px;">',
		    '<tr><td>Status:</td><td>{[this.status(values)]}</td></tr>',
		    '<tr><td>Memory:</td><td>{[this.meminfo(values)]}</td></tr>',
		    '<tr><td>CPU:</td><td>{[this.cpuinfo(values)]}</td></tr>',
		    '<tr><td>Uptime:</td><td>{[Proxmox.Utils.format_duration_long' +
			'(values.uptime)]}</td></tr>',
		    '</table>',
		    {
			meminfo: function(values) {
			    if (!Ext.isDefined(values.mem)) {
				return '-';
			    }
			    return Proxmox.Utils.format_size(values.mem || 0) + " of " +
				Proxmox.Utils.format_size(values.maxmem);
			},
			cpuinfo: function(values) {
			    if (!Ext.isDefined(values.cpu)) {
				return '-';
			    }
			    var per = values.cpu * 100;
			    return per.toFixed(2) + "% (" + values.cpus + " CPUs)";
			},
			status: function(values) {
			    return values.qmpstatus ? values.qmpstatus :
				values.status;
			}
		    }
		]
	    },
	    {
		xtype: 'component',
		cls: 'dark',
		padding: 5,
		html: gettext('Configuration')
	    },
	    {
		xtype: 'container',
		scrollable: 'both',
		flex: 1,
		styleHtmlContent: true,
		itemId: 'vmconfig',
		style: 'background-color:white;white-space:pre',
		tpl: [
		    '<table style="margin-bottom:0px;">',
		    '<tpl for=".">',
		    '<tr><td>{key}</td><td>{value}</td></tr>',
		    '</tpl>',
		    '</table>'
		]
	    }
	]
    },

    reload: function() {
	var me = this;

	var vm_stat = me.down('#vmstatus');

	var error_handler = function(response) {
	    me.setMasked({ xtype: 'loadmask', message: response.htmlStatus });
	};

	Proxmox.Utils.API2Request({
	    url: '/nodes/' + me.nodename + '/' + me.vmtype + '/' + me.vmid +
		 '/status/current',
	    method: 'GET',
	    success: function(response) {
		var d = response.result.data;

		me.render_menu(d);

		vm_stat.setData(d);
	    },
	    failure: error_handler
	});

	var vm_cfg = me.down('#vmconfig');

	Proxmox.Utils.API2Request({
	    url: '/nodes/' + me.nodename + '/' + me.vmtype + '/' + me.vmid +
		 '/config',
	    method: 'GET',
	    success: function(response) {
		var d = response.result.data;
		var kv = PVE.Workspace.obj_to_kv(d, me.config_keys);
		vm_cfg.setData(kv);
	    },
	    failure: error_handler
	});
    },

    render_menu: function(data) {
	var me = this;

	// use two item arrays for format reasons.
	// display start, stop and migrate by default
	var top_items = [
	    {
		text: gettext('Start'),
		handler: function() {
		    me.vm_command("start", {});
		}
	    },
	    {
		text: gettext('Stop'),
		handler: function() {
		    me.vm_command("stop", {});
		}
	    }
	];

	var bottom_items = [{
	    text: gettext('Migrate'),
	    handler: function() {
		PVE.Workspace.gotoPage('nodes/' + me.nodename + '/' + me.vmtype +
				       '/' + me.vmid +'/migrate');
	    }
	}];

	// use qmpstatus with qemu, as it's exacter
	var vm_status = (me.vmtype === 'qemu') ? data.qmpstatus : data.status;

	if(vm_status === 'running') {

	    top_items.push(
		{
		    text: gettext('Shutdown'),
		    handler: function() {
			me.vm_command("shutdown", {});
		    }
		},
		{
		    text: gettext('Suspend'),
		    handler: function() {
			me.vm_command("suspend", {});
		    }
		}
	    );

	    bottom_items.push({
		text: gettext('Console'),
		handler: function() {
		    var vmtype = me.vmtype === 'qemu' ? 'kvm' : me.vmtype;
		    PVE.Utils.openConsoleWindow('html5', vmtype, me.vmid,
						me.nodename);
		}
	    });

	    if(data.spice || me.vmtype==='lxc') {
		bottom_items.push({
		    text: gettext('Spice'),
		    handler: function() {
			var vmtype = me.vmtype === 'qemu' ? 'kvm' : me.vmtype;
			PVE.Utils.openConsoleWindow('vv', vmtype, me.vmid,
						    me.nodename);
		    }
		});
	    }

	} else if(vm_status === 'paused') {
	    top_items.push({
		text: gettext('Resume'),
		handler: function() {
		    me.vm_command("resume", {});
		}
	    });
	}

	// concat our item arrays and add them to the menu
	me.down('pveMenuButton').setMenuItems(top_items.concat(bottom_items));

    },

    initialize: function() {
	var me = this;

	me.reload();

	this.callParent();
    }
});
Ext.define('PVE.QemuSummary', {
    extend: 'PVE.VMSummaryBase',
    alias: 'widget.pveQemuSummary',

    statics: {
	pathMatch: function(loc) {
	    return loc.match(/^nodes\/([^\s\/]+)\/qemu\/(\d+)$/);
	}
    },

    vmtype: 'qemu',

    config_keys: [
	'name', 'memory', 'sockets', 'cores', 'ostype', 'bootdisk', /^net\d+/,
	/^ide\d+/, /^virtio\d+/, /^sata\d+/, /^scsi\d+/, /^unused\d+/
    ],

    initialize: function() {
	var me = this;

	var match = me.self.pathMatch(me.getAppUrl());
	if (!match) {
	    throw "pathMatch failed";
	}

	me.nodename = match[1];
	me.vmid = match[2];

	me.down('titlebar').setTitle('VM: ' + me.vmid);

	this.callParent();
    }
});
Ext.define('PVE.LXCSummary', {
    extend: 'PVE.VMSummaryBase',
    alias: 'widget.pveLXCSummary',

    statics: {
	pathMatch: function(loc) {
	    return loc.match(/^nodes\/([^\s\/]+)\/lxc\/(\d+)$/);
	}
    },

    vmtype: 'lxc',

    config_keys: [
	'hostname','ostype', , 'memory', 'swap', 'cpulimit', 'cpuunits',
	/^net\d+/, 'rootfs', /^mp\d+/, 'nameserver', 'searchdomain','description'
    ],

    initialize: function() {
	var me = this;

	var match = me.self.pathMatch(me.getAppUrl());
	if (!match) {
	    throw "pathMatch failed";
	}

	me.nodename = match[1];
	me.vmid = match[2];

	me.down('titlebar').setTitle('CT: ' + me.vmid);

	this.callParent();
    }
});
Ext.application({

    launch: function() {
	var me = this;

	PVE.Workspace.setHistory(me.getHistory());

	Ext.Ajax.on('requestexception', function(conn, response) {
	    if (response.status === 401) { 
		PVE.Workspace.showLogin();
	    }
	});
    }
});
