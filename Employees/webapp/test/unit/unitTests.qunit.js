/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"hr/Employees/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
