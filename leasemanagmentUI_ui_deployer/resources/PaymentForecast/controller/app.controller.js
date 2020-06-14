sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.lti.LeaseManagement.PaymentForecast.controller.app", {
		onInit: function () {
			var oVizFrame = this.oVizFrame = this.getView().byId("idcolumn");
	

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
				var IoRouter= sap.ui.core.UIComponent.getRouterFor(this);
				IoRouter.navTo("filter1");
			},
				onClick2: function () {
				var IoRouter= sap.ui.core.UIComponent.getRouterFor(this);
				IoRouter.navTo("filter2");
			},
				onClick3: function () {
				var IoRouter= sap.ui.core.UIComponent.getRouterFor(this);
				IoRouter.navTo("table");
			}
	});
});