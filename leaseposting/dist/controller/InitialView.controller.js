sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.lti.LeaseManagement.leaseposting.controller.InitialView", {
		onInit: function () {
				this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		
		onPressAdd : function () {
			this.getOwnerComponent().getRouter().navTo("PostView");
		}
	});
});