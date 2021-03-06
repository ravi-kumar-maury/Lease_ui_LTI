sap.ui.define([
		'LeaseLiabilitySchedule/webapp/model/Formatter',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel'
	], function(Formatter, Controller, JSONModel) {
	"use strict";

	var TableController = Controller.extend("com.lti.LeaseManagement.LeaseSchedule.controller.filter1", {

		onInit: function () {
			// set explored app's demo model on this sample
			var oModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock") + "/products.json");
			this.getView().setModel(oModel);
		},

		onPopinLayoutChanged: function() {
			var oTable = this.byId("idProductsTable");
			var oComboBox = this.byId("idPopinLayout");
			var sPopinLayout = oComboBox.getSelectedKey();
			switch (sPopinLayout) {
				case "Block":
					oTable.setPopinLayout(sap.m.PopinLayout.Block);
					break;
				case "GridLarge":
					oTable.setPopinLayout(sap.m.PopinLayout.GridLarge);
					break;
				case "GridSmall":
					oTable.setPopinLayout(sap.m.PopinLayout.GridSmall);
					break;
				default:
					oTable.setPopinLayout(sap.m.PopinLayout.Block);
					break;
			}
		},

		onSelect: function(oEvent) {
			var bSelected = oEvent.getParameter("selected"),
				sText = oEvent.getSource().getText(),
				oTable = this.byId("idProductsTable"),
				aSticky = oTable.getSticky() || [];

			if (bSelected) {
				aSticky.push(sText);
			} else if (aSticky.length) {
				var iElementIndex = aSticky.indexOf(sText);
				aSticky.splice(iElementIndex, 1);
			}

			oTable.setSticky(aSticky);
		},

		onToggleInfoToolbar: function(oEvent) {
			var oTable = this.byId("idProductsTable");
			oTable.getInfoToolbar().setVisible(!oEvent.getParameter("pressed"));
		}
	});


	return TableController;

});