sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.lti.LeaseManagement.LowValueLease.controller.View1", {
	// onInit: function () {
	// 		var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
	// 		oVizFrame.setVizProperties({
	// 			plotArea: {	
	// 				dataLabel:{
 //                     showTotal: true
 //                },
	// 				colorPalette: d3.scale.category20().range()
				
	// 			}
			
	// 		});

	// 	},
		
			onClick: function () {
				var IoRouter= sap.ui.core.UIComponent.getRouterFor(this);
				IoRouter.navTo("View2");
			}
	});
});