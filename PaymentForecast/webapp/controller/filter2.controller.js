sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.lti.LeaseManagement.PaymentForecast.controller.filter2", {
		onInit: function () {
			var oVizFrame = this.oVizFrame = this.getView().byId("idcolumn2");
			oVizFrame.setVizProperties({
				plotArea: {	
					dataLabel:{
                      showTotal: true
                 },
					colorPalette: d3.scale.category20().range()
			
				}
			
			});

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
				var IoRouter= sap.ui.core.UIComponent.getRouterFor(this);
				IoRouter.navTo("table");
			}
	});
});