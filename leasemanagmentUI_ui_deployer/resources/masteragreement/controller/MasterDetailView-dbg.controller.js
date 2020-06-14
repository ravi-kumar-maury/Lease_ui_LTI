sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/m/MessageToast"

], function (Controller, MessageBox, Filter, FilterOperator, FilterType, MessageToast) {
	"use strict";

	return Controller.extend("com.lti.LeaseManagement.masteragreement.controller.MasterDetailView", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("MasterDetailView").attachPatternMatched(this._onRouteMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},

		onNavBack: function () {
			var that = this;
			var oRefreshable = this.getView().getModel();
			var aUpdateGroupIds = [this.getView().getModel().getUpdateGroupId(), "MasterAgreementGroup"];

			if (oRefreshable.hasPendingChanges()) {
				MessageBox.confirm(
					"There are pending changes. Do you really want to cancel ?",
					function onConfirm(sCode) {
						if (sCode === "OK") {
							if (aUpdateGroupIds) {
								aUpdateGroupIds.forEach(function (sUpdateGroupId) {
									oRefreshable.resetChanges(sUpdateGroupId);
									that.getOwnerComponent().getRouter().navTo("InitialView", {}, true);
									that.getOwnerComponent().getModel("uiModel").refresh();
									that.getOwnerComponent().getModel("uiModel").getData().showMasterItems = false;
									that.getOwnerComponent().getModel("uiModel").getData().fieldsEditable = true;
								});
							} else {
								oRefreshable.resetChanges();
							}
							oRefreshable.refresh();
						}
					},
					"Refresh");
			} else {
				// oRefreshable.refresh();
				this.getOwnerComponent().getRouter().navTo("InitialView", {}, true);
				this.getOwnerComponent().getModel("uiModel").refresh();
				this.getOwnerComponent().getModel("uiModel").getData().showMasterItems = true;
				this.getOwnerComponent().getModel("uiModel").getData().fieldsEditable = false;
			}
		},

		onPressSubmit: function () {
			var that = this;
			var oView = this.getView();
			var oRefreshable = this.getView().getModel();
			var aUpdateGroupIds = [this.getView().getModel().getUpdateGroupId(), "MasterAgreementGroup"];

			if (oView.byId("idCC").getValue() === "" || oView.byId("idLT").getValue() === "" || oView.byId("idVend").getValue() === "" ||
				oView
				.byId("idStrtDt").getValue() === "" || oView.byId("idTargVal").getValue() === "" || oView.byId("idCurr").getValue() === "" ||
				oView.byId("idEndDt").getValue() === "") {
				sap.m.MessageBox.warning("Please Fill all Required Fields", {
					title: "Warning", // default
					onClose: null // default
				});
				return;
			}
			MessageBox.confirm(
				"Do you really want to submit ?",
				function onConfirm(sCode) {
					if (sCode === "OK") {
							if (aUpdateGroupIds) {
								aUpdateGroupIds.forEach(function (sUpdateGroupId) {
									oRefreshable.resetChanges(sUpdateGroupId);
									that.getOwnerComponent().getRouter().navTo("InitialView", {}, true);
									that.getOwnerComponent().getModel("uiModel").refresh();
									that.getOwnerComponent().getModel("uiModel").getData().showMasterItems = false;
									that.getOwnerComponent().getModel("uiModel").getData().fieldsEditable = true;
								});
							} else {
								oRefreshable.resetChanges();
							}
							oRefreshable.refresh();
						}

					});

		},

		onEdit: function () {
			if (this.getOwnerComponent().getModel("uiModel").getData().fieldsEditable) {
				this.getOwnerComponent().getModel("uiModel").getData().fieldsEditable = false;
			} else {
				this.getOwnerComponent().getModel("uiModel").getData().fieldsEditable = true;
				this.getOwnerComponent().getModel("uiModel").getData().fieldsEditable1 = false;
			}
			this.getOwnerComponent().getModel("uiModel").refresh();

		},

		onPressSave: function (evt) {
			var oView = this.getView();
			if (oView.byId("idCC").getValue() === "" || oView.byId("idLT").getValue() === "" || oView.byId("idVend").getValue() === "" ||
				oView
				.byId("idStrtDt").getValue() === "" || oView.byId("idTargVal").getValue() === "" || oView.byId("idCurr").getValue() === "" ||
				oView.byId("idEndDt").getValue() === "") {
				sap.m.MessageBox.warning("Please Fill all Required Fields", {
					title: "Warning", // default
					onClose: null // default
				});
				return;
			}
			var uiModelData = this.getOwnerComponent().getModel("uiModel").getData();

			if (uiModelData.operation === "create") {
				var companyCode = oView.byId("idCC").getValue();
				var vendor = oView.byId("idVend").getValue();
				var timeStamp = new Date().getTime();
				var mstagrmnt = companyCode + "-" + vendor + "-" + timeStamp;
				uiModelData.masterContractContext.setProperty("mastAGGR", mstagrmnt);
			}
			var fnSuccess = function () {
				sap.m.MessageToast.show("Items saved Successfully");
				if (uiModelData.operation === "create") {
					var oMasterItems = sap.ui.xmlfragment(this.getView().getId(), "com.lti.LeaseManagement.masteragreement.fragments.MasterItems",
						this);
					this.byId("idCrtDisp").addContent(oMasterItems);
				}
				this.getOwnerComponent().getModel("uiModel").refresh();
			}.bind(this);
			var fnError = function (oError) {
				sap.m.MessageToast.show(oError.message);
			}.bind(this);
			this.getView().getModel().submitBatch("MasterAgreementGroup").then(fnSuccess, fnError);

		},

		_onRouteMatched: function (evt) {
			var oView = this.getView();
			var uiModelData = this.getOwnerComponent().getModel("uiModel").getData();
			var oMasterItems = oView.byId("masterItems");
			if (oMasterItems && uiModelData.operation === "create") {
				oMasterItems.destroy();
			} else if (!oMasterItems && uiModelData.operation === "update") {
				oMasterItems = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.masteragreement.fragments.MasterItems", this);
				this.byId("idCrtDisp").addContent(oMasterItems);
			}

			this.byId("idCrtDisp").setBindingContext(uiModelData.masterContractContext);
		},

		onAddItem: function (oEvent) {
			debugger;
			var oView = this.getView();
			if (oView.byId("idCC").getValue() === "" || oView.byId("idLT").getValue() === "" || oView.byId("idVend").getValue() === "" ||
				oView
				.byId("idStrtDt").getValue() === "" || oView.byId("idTargVal").getValue() === "" || oView.byId("idCurr").getValue() === "" ||
				oView.byId("idEndDt").getValue() === "") {
				sap.m.MessageBox.warning("Please Fill all Required Fields", {
					title: "Warning", // default
					onClose: null // default
				});
				return;
			}

			var itemTableBinding = this.getView().byId("idTable").getBinding("items");
			var itemno = itemTableBinding.getLength() * 10 + 10;

			var context = itemTableBinding.create();
			context.setProperty("mastAGGR", this.getOwnerComponent().getModel("uiModel").getData().masterContractContext.getProperty(
				"mastAGGR"));
			context.setProperty("iTEM", itemno);
		},
		onItemDelete: function () {

			var sMessage,
				item,
				oTable = this.byId("idTable"),
				length = oTable.getBinding("items").getLength(),
				selectedItems = oTable.getSelectedContexts(),
				oItemContext;

			function onConfirm(sCode) {
				if (sCode !== 'OK') {
					return;
				}
				for (var i = selectedItems.length - 1; i >= 0; i--) {
					oItemContext = selectedItems[i];
					item = oItemContext.getProperty("iTEM", true);
					oItemContext.delete(oItemContext.getModel().getGroupId())
						.then(function () {

						});
				}
				MessageBox.success("Item Deleted.");
			}
			sMessage = "Do you really want to delete this Item" + "?";
			MessageBox.confirm(sMessage, onConfirm, "Item Deletion");
		},

		onValueChangeLT: function (event) {
			var oView = this.getView();
			this.oDialog = oView.byId("idDialogLT");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.masteragreement.fragments.LeaseTypes", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCloseLT: function (oEvent) {
			var leaseType = oEvent.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idLT").setValue(leaseType);
		},
		onValueChangeCC: function (event) {
			var oView = this.getView();
			this.oDialog = oView.byId("idContractDialogCC");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.masteragreement.fragments.CompanyCodes", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCloseCC: function (oEvent) {
			var desc1 = oEvent.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idCC").setValue(desc1);
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
		onValueChangeCurr: function () {
			var oView = this.getView();
			this.oDialog = oView.byId("idCurrencyDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.masteragreement.fragments.Currency", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCloseCurrency: function (oEvent) {
			var desc1 = oEvent.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idCC").setValue(desc1);
		},
		handleConfirmCurrency: function (oEvent) {
			var desc1 = oEvent.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idCurr").setValue(desc1);
		},

		//onSearchCurrency
		//handleSearchCurrency

		onValueChangeVen: function (event) {
			var oView = this.getView();
			this.oDialog = oView.byId("idVendorDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.masteragreement.fragments.Vendor", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleConfirmVendor: function (oEvent) {
			var desc1 = oEvent.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idVend").setValue(desc1);
		},
		handleCloseVendor: function () {
			this.getView().byId("idVendorDialog").destroy();
		},
		onValueChangeAT: function (event) {
			var oView = this.getView();
			this.F4_event = event.getSource();
			this.shortTextEvent = event.getSource().getParent().getCells()[2];
			this.oDialog = oView.byId("idDialogAT");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.masteragreement.fragments.AssetType", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCloseAT: function (oEvent) {
			var title = oEvent.getSource()._aSelectedItems[0].getTitle();
			this.F4_event.setValue(title);
			var desc = oEvent.getSource()._aSelectedItems[0].getDescription();
			this.shortTextEvent.setValue(desc);
		},
		assetChange: function (oEvent) {

		},
		onSearchATS: function (oEvent) { // build filter array
			var aFilter = [];
			var sQuery = this.oDialog._sSearchFieldValue;
			if (sQuery) {
				aFilter.push(new Filter("assetTYPE", FilterOperator.Contains, sQuery));
			}
			var oBinding = this.oDialog._oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		// F4 UOM
		onChangeValueUOM: function (oEvent) {
			var oView = this.getView();
			this.F4_event = oEvent.getSource();
			this.oDialog = oView.byId("idUOMDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.masteragreement.fragments.UOM", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCloseUOM: function (oEvent) {
			var title = oEvent.getSource()._aSelectedItems[0].getTitle();
			this.F4_event.setValue(title);
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.lti.LeaseManagement.masteragreement.view.MasterDetailView
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.lti.LeaseManagement.masteragreement.view.MasterDetailView
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.lti.LeaseManagement.masteragreement.view.MasterDetailView
		 */
		//	onExit: function() {
		//
		//	}

	});

});