sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"
], function (Controller, Filter, FilterOperator, FilterType, Fragment, MessageBox) {
	"use strict";

	return Controller.extend("com.lti.LeaseManagement.individualagreement.controller.InitialView", {
		onInit: function () {
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		navToCreateLeasePage: function (oEvent) {
			var indContractTableBinding = this.getView().byId("idILListTable").getBinding("items");
			var oContext = indContractTableBinding.create();
			//this.getOwnerComponent().getModel("uiModel").getData().showIndItems = false;
			this.getOwnerComponent().getModel("uiModel").getData().fieldsEditable = true;
			this.getOwnerComponent().getModel("uiModel").getData().tabsVisible = false;
			//this.getOwnerComponent().getModel("uiModel").getData().operation = "create";
			this.getOwnerComponent().getModel("uiModel").getData().indContractContext = oContext;
			this.getOwnerComponent().getRouter().navTo("CreateLease");
		},
		onSearch: function (oEvent) {
			//debugger;
			var oView = this.getView();
			if (oView.byId("leaseAgr").getValue().length === 0 && oView.byId("compCode").getValue() === "" && oView.byId("vendor").getValue() ===
				"" && oView.byId("leaseType").getValue() === "" && oView.byId("startDate").getValue() === "" && oView.byId("endDate").getValue() ===
				"") {
				sap.m.MessageBox.warning("Please enter any one value", {
					title: "Warning", // default
					onClose: null // default
				});
				return;
			}
			//var that = this;
			var orFilter = [];
			var leaseAgr = oView.byId("leaseAgr").getValue();
			var compCode = oView.byId("compCode").getValue();
			var vendor = oView.byId("vendor").getValue();
			var leaseType = oView.byId("leaseType").getValue();
			var startDate = oView.byId("startDate").getDateValue();
			var endDate = oView.byId("endDate").getDateValue();
			var f1 = new Filter("agNUM", FilterOperator.EQ, leaseAgr);
			var f2 = new Filter("coCDE_coCDE", FilterOperator.EQ, compCode);
			var f3 = new Filter("vEND_vEND", FilterOperator.EQ, vendor);
			var f4 = new Filter("lesTYPE_lesTYPE", FilterOperator.EQ, leaseType);
			var f5 = new Filter("validFROM", FilterOperator.EQ, startDate);
			var f6 = new Filter("validTO", FilterOperator.EQ, endDate);
			var oTable = this.getView().byId("idILListTable");
			orFilter = new Filter({
				filters: [f1, f2, f3, f4, f5, f6],
				and: false
			});
			if (oTable.getBinding("items") !== undefined)
				oTable.getBinding("items").filter(orFilter);
		},
		onPressReset: function () {
			this.getView().byId("leaseAgr").setValue("");
			this.getView().byId("compCode").setValue("");
			this.getView().byId("vendor").setValue("");
			this.getView().byId("leaseType").setValue("");
			this.getView().byId("startDate").setDateValue(null);
			this.getView().byId("endDate").setDateValue(null);

		},
		onValueChangeInd: function (event) {
			var oView = this.getView();
			this.oDialog = oView.byId("idDialogInd");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.IndividualAgreement", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		onSearchIA: function (oEvent) { // build filter array
			var aFilter = [];
			var sQuery = this.oDialog._sSearchFieldValue;
			if (sQuery) {
				aFilter.push(new Filter("agNUM", FilterOperator.Contains, sQuery));
			}
			var oBinding = this.oDialog._oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		handleConfirmIA: function (event) {
			var desc1 = event.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("leaseAgr").setValue(desc1);
		},
		handleCloseIA: function (oEvent) {
			this.getView().byId("idDialogInd").destroy();
		},
		// DateFormat: function (oValue) {
		// 	if (oValue !== undefined && oValue !== null) {
		// 		oValue = new Date(oValue);
		// 		var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
		// 			pattern: "MM-dd-yyyy"
		// 		});
		// 		return oDateFormat.format(oValue);
		// 	} else {
		// 		return oValue;
		// 	}
		// },
		onValueChangeCC: function (event) {
			var oView = this.getView();
			this.oDialog = oView.byId("idContractDialogCC");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.CompanyCodes", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		onSearchCC: function (oEvent) { // build filter array
			var aFilter = [];
			var sQuery = this.oDialog._sSearchFieldValue;
			if (sQuery) {
				aFilter.push(new Filter("coCDE", FilterOperator.Contains, sQuery));
			}
			var oBinding = this.oDialog._oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		handleCancelCC: function (event) {
			this.getView().byId("idContractDialogCC").destroy();
		},
		handleConfirmCC: function (event) {
			var desc1 = event.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("compCode").setValue(desc1);
		},

		onValueChangeVen: function (event) {
			var oView = this.getView();
			this.oDialog = oView.byId("idVendorDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.Vendor", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		onSearchVendor: function () {
			var aFilter = [];
			var sQuery = this.oDialog._sSearchFieldValue;
			if (sQuery) {
				aFilter.push(new Filter("vEND", FilterOperator.Contains, sQuery));
			}
			var oBinding = this.oDialog._oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		handleConfirmVendor: function (oEvent) {
			var desc1 = oEvent.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("vendor").setValue(desc1);
		},
		handleCloseVendor: function () {
			this.getView().byId("idVendorDialog").destroy();
		},
		onValueChangeLT: function (event) {
			var oView = this.getView();
			this.oDialog = oView.byId("idDialogLT");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.LeaseTypes", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleConfirmLT: function (oEvent) {
			//var desc1 = oEvent.getSource()._aSelectedItems[0].getDescription();
			var desc1 = oEvent.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("leaseType").setValue(desc1);
		},
		handleCloseLT: function () {
			this.getView().byId("idDialogLT").destroy();
		},
		onSelectChange: function (oEvent) {
			var uiData = this.getOwnerComponent().getModel("uiModel").getData();
			uiData.headrEditable = false;
			uiData.fieldsEditable = false;
			//uiData.operation = false;
			uiData.indContractContext = oEvent.getSource().getBindingContext();
			this.getOwnerComponent().getModel("uiModel").refresh();
			this.getOwnerComponent().getRouter().navTo("DisplayLease");

		},
		sortPress: function (oEvent) {
			if (!this.SortFragment) {
				this.SortFragment = sap.ui.xmlfragment(
					"com.lti.LeaseManagement.individualagreement.fragments.SortFrag", this);
				this.getView().addDependent(this.SortFragment);
			}
			this.SortFragment.open();
		},
		onApplyFilter: function (oEvent) {
			if (!this.filterDialog) {
				this.filterDialog = sap.ui.xmlfragment("com.lti.LeaseManagement.individualagreement.fragments.Filter", this);
				this.getView().addDependent(this.filterDialog);
			}
			this.filterDialog.open();
			this.multiFlag = true;

		},
		handleValueHelp: function (oEvent) {
			var oView = this.getView();
			this.oDialog = oView.byId("idDialogInd");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.IndividualAgreement", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		onCancel: function (oEvent) {
			this.filterDialog.destroy();
			this.multiFlag = false;
		},
		deleteLease: function () {
			var sMessage,
				item,
				oTable = this.byId("idILListTable"),
				length = oTable.getBinding("items").getLength(),
				selectedItems = oTable.getSelectedContexts(),
				oItemContext;

			function onConfirm(sCode) {
				if (sCode !== 'OK') {
					return;
				}
				for (var i = selectedItems.length - 1; i >= 0; i--) {
					oItemContext = selectedItems[i];
					item = oItemContext.getProperty("iTEMs", true);
					oItemContext.delete(oItemContext.getModel().getGroupId())
						.then(function () {
							//	MessageBox.success("Item Deleted.");
						});
				}
				MessageBox.success("Item Deleted.");
			}
			sMessage = "Do you really want to delete this Item" + "?";
			MessageBox.confirm(sMessage, onConfirm, "Item Deletion");
		}
	});
});