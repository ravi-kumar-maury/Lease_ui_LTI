sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.lti.LeaseManagement.PaymentForecast.controller.table", {
		onInit: function () {

			// var sBindingPath = "/leaseReportData";
			// this.byId("reportfetch").bindElement({
			// 	path: sBindingPath
			// });
		},

			onClick: function () {
			var IoRouter = sap.ui.core.UIComponent.getRouterFor(this);
			IoRouter.navTo("app");
		},
		onClick2: function () {
			var IoRouter = sap.ui.core.UIComponent.getRouterFor(this);
			IoRouter.navTo("filter1");
		},
		onClick3: function () {
			var IoRouter = sap.ui.core.UIComponent.getRouterFor(this);
			IoRouter.navTo("filter2");
		}

	});
});