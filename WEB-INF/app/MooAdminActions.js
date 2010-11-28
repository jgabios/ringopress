
var mooExports = require('lib/MooExports').mooexports;
var mooAdminExports = new mooExports('actions/admin');
exports.mooexports = mooAdminExports.getExports.bind(mooAdminExports);