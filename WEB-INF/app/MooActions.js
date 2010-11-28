
var mooExports = require('lib/MooExports').mooexports;
var mooAdminExports = new mooExports('actions');
exports.mooexports = mooAdminExports.getExports.bind(mooAdminExports);