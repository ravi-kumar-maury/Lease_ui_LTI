/*global QUnit*/

sap.ui.define([
	"com/lti/LeaseManagement/leaseposting/controller/InitialView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("InitialView Controller");

	QUnit.test("I should test the InitialView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});