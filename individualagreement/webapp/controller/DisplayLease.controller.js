sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/m/MessageBox",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History"
], function (Controller, Filter, MessageBox, FilterOperator, Sorter, JSONModel, MessageToast, UIComponent, History) {
	"use strict";

	return Controller.extend("com.lti.LeaseManagement.individualagreement.controller.DisplayLease", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("DisplayLease").attachPatternMatched(this._onRouteMatched, this);
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

		},
		_onRouteMatched: function (oEvent) {
			this.byId("idPageDisplay").setBindingContext(this.getOwnerComponent().getModel("uiModel").getData().indContractContext);
			// var oView = this.getView();
			// var oTnCItems = oView.byId("idTnCItems");
			// var valItems = oView.byId("validityItems");
			// if (!oTnCItems || !valItems) {
			// 	//adding fragment to make render the table for terms and condtn items
			// 	oTnCItems = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.TnCItems", this);
			// 	this.byId("vBoxtnCsubSection").addItem(oTnCItems);
			// 	//fragment for validity table
			// 	valItems = sap.ui.xmlfragment(this.getView().getId(), "com.lti.LeaseManagement.individualagreement.fragments.ValidityTable",
			// 		this);
			// 	this.byId("vBoxValsubSection").addItem(valItems);
			// }
		},
		onPressCancel: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("InitialView");
			this.getOwnerComponent().getModel("uiModel").refresh();
		},

		//Create functions
		onAddItem: function (oEvent) {
			//debugger;
			var oView = this.getView();
			if (oView.byId("idLesType").getValue() === "" || oView.byId("refIntRate").getValue() === "" || oView.byId("usefulLifeYr").getValue() ===
				"" || oView.byId("usefulLifeMnth").getValue() === "") {
				MessageBox.warning("Please Fill all Required Fields", {
					title: "Warning", // default
					onClose: null // default
				});
				return;
			}
			var itemTableBinding = this.getView().byId("idTnCTable").getBinding("items");
			var itemno = itemTableBinding.getLength() * 10 + 10;
			var context = itemTableBinding.create();
			context.setProperty("agNUM", this.getOwnerComponent().getModel("uiModel").getData().indContractContext.getProperty("agNUM"));
			context.setProperty("iTEMs", itemno);
		},

		onItemDelete: function () {
			var sMessage,
				item,
				oTable = this.byId("idTnCTable"),
				oItemContext = oTable.getSelectedItem().getBindingContext();

			function onConfirm(sCode) {
				if (sCode !== 'OK') {
					return;
				}

				oItemContext.delete(oItemContext.getModel().getGroupId())
					.then(function () {
						MessageBox.success("Item Deleted.");
					});
			}
			item = oItemContext.getProperty("iTEMs", true);
			sMessage = "Do you really want to delete this Item" + "?";
			MessageBox.confirm(sMessage, onConfirm, "Item Deletion");
		},
		onAddItem2: function (oEvent) {
			var oView = this.getView();
			if (oView.byId("valValidFrom").getValue() === "" || oView.byId("valValidTo").getValue() === "") {
				MessageBox.warning("Please fill the Required Dates", {
					title: "Warning", // default
					onClose: null // default
				});
				return;
			}
			// var oContext = this.getView().byId("validityTble").getBinding("items").create();
			// oContext.setProperty("agNUM", this.getOwnerComponent().getModel("uiModel").getData().indContractContext.getProperty("agNUM"));
			var itemTableBinding = this.getView().byId("validityTble").getBinding("items");
			var itemno = itemTableBinding.getLength() * 10 + 10;
			var context = itemTableBinding.create();
			context.setProperty("agNUM", this.getOwnerComponent().getModel("uiModel").getData().indContractContext.getProperty("agNUM"));
			context.setProperty("iTEM", itemno);
		},
		onDeleteItem2: function (oEvent) {
			var sMessage,
				item,
				oTable = this.byId("validityTble"),
				oItemContext = oTable.getSelectedItem().getBindingContext();

			function onConfirm(sCode) {
				if (sCode !== 'OK') {
					return;
				}

				oItemContext.delete(oItemContext.getModel().getGroupId())
					.then(function () {
						MessageBox.success("Item Deleted.");
					});
			}
			item = oItemContext.getProperty("iTEM", true);
			sMessage = "Do you really want to delete this Item" + "?";
			MessageBox.confirm(sMessage, onConfirm, "Item Deletion");
		},
		onNavBack: function () {
			var that = this,
				oRefreshable = this.getView().getModel(),
				aUpdateGroupIds = [this.getView().getModel().getUpdateGroupId(), "IndividualAgreementGroup"];

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
				oRefreshable.refresh();
				this.getOwnerComponent().getRouter().navTo("InitialView", {}, true);
				this.getOwnerComponent().getModel("uiModel").refresh();
				this.getOwnerComponent().getModel("uiModel").getData().fieldsEditable = true;
			}

		},
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
			this.getView().byId("idCompCode").setValue(desc1);
		},
		onValueChangeCurrency: function (event) {

			var oView = this.getView();
			this.oDialog = oView.byId("idCurrencyDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.Currency", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCancelCurrency: function (event) {
			this.getView().byId("idCurrencyDialog").destroy();
		},
		handleConfirmCurrency: function (event) {
			var desc1 = event.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idCurr").setValue(desc1);
		},
		onValueChangePlant: function (event) {
			var oView = this.getView();
			this.oDialog = oView.byId("idPlantDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.Plant", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();

		},
		handleCancelPlant: function (event) {
			this.getView().byId("idPlantDialog").destroy();
		},
		handleConfirmPlant: function (event) {
			var desc1 = event.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idPlant").setValue(desc1);
		},
		onValueChangeAsset: function (event) {
			var oView = this.getView();
			this.oDialog = oView.byId("idAssetDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.Asset", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();

		},
		handleCancelAsset: function (event) {
			this.getView().byId("idAssetDialog").destroy();
		},
		handleConfirmAsset: function (event) {
			var desc1 = event.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idAsset").setValue(desc1);
		},
		onValueChangeProfit: function (event) {

			var oView = this.getView();
			this.oDialog = oView.byId("idProfitDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.ProfitCnt", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCancelProfit: function (event) {
			this.getView().byId("idProfitDialog").destroy();
		},
		handleConfirmProfit: function (event) {
			var desc1 = event.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idProfCnt").setValue(desc1);
		},

		onValueChangeWbs: function (event) {

			var oView = this.getView();
			this.oDialog = oView.byId("idWbsDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.WBS", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCancelWbs: function (event) {
			this.getView().byId("idWbsDialog").destroy();
		},
		handleConfirmWbs: function (event) {
			var desc1 = event.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idWbs").setValue(desc1);
		},
		onChangeRentIndexKey: function (event) {
			var oView = this.getView();
			this.oDialog = oView.byId("idRentIndexKey");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.RentIndexKey", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCloserRentIndexKey: function (event) {
			this.getView().byId("idRentIndexKey").destroy();
		},
		handleConfirmRentIndexKey: function (event) {
			var desc1 = event.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("renIndKey").setValue(desc1);
		},
		onChangeRefIntRate: function (event) {
			var oView = this.getView();
			this.oDialog = oView.byId("idRefIntRateDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.RefIntRate", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCloserRefIntRate: function (event) {
			this.getView().byId("idRefIntRateDialog").destroy();
		},
		handleConfirmRefIntRate: function (event) {
			var desc1 = event.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("refIntRate").setValue(desc1);
		},
		onChangeLT: function (event) {
			var oView = this.getView();
			this.oDialog = oView.byId("idDialogLT");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.LeaseTypes", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCloseLT: function (event) {
			this.getView().byId("idDialogLT").destroy();
		},
		handleConfirmLT: function (event) {
			var desc = event.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idLesType").setValue(desc);
		},
		onChangeExpType: function (event) {
			var oView = this.getView();
			this.F4_event = event.getSource();
			this.oDialog = oView.byId("idExpTypDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.ExpenseType", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCancelExpTyp: function (event) {
			this.getView().byId("idExpTypDialog").destroy();
		},
		handleConfirmExpTyp: function (oEvent) {
			var desc = oEvent.getSource()._aSelectedItems[0].getDescription();
			this.F4_event.setValue(desc);
		},
		onValueChangeVen: function (event) {
			var oView = this.getView();
			this.F4_event = event.getSource();
			this.oDialog = oView.byId("idVendorDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.Vendor", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleConfirmVendor: function (oEvent) {
			var temp = oEvent.getSource()._aSelectedItems[0].getTitle();
			this.F4_event.setValue(temp);
		},
		handleCloseVendor: function (oEvent) {
			this.getView().byId("idVendorDialog").destroy();
		},
		onChangeTaxCode: function (event) {
			var oView = this.getView();
			this.F4_event = event.getSource();
			this.oDialog = oView.byId("idTaxCdeDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.TaxCode", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleConfirm: function (oEvent) {
			var temp = oEvent.getSource()._aSelectedItems[0].getTitle();
			this.F4_event.setValue(temp);
		},
		handleCancelTaxCde: function (event) {
			this.getView().byId("idTaxCdeDialog").destroy();
		},
		onChangeGLAcc: function (event) {
			var oView = this.getView();
			this.F4_event = event.getSource();
			this.oDialog = oView.byId("idGLAccDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.GLAcc", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCancelGLAcc: function () {
			this.getView().byId("idGLAccDialog").destroy();
		},
		onChangeLedger: function (event) {
			var oView = this.getView();
			this.F4_event = event.getSource();
			this.oDialog = oView.byId("idLedgerDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.Ledger", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCancelLedger: function () {
			this.getView().byId("idLedgerDialog").destroy();
		},
		onEdit: function (oEvent) {
			if (this.getOwnerComponent().getModel("uiModel").getData().fieldsEditable) {
				this.getOwnerComponent().getModel("uiModel").getData().fieldsEditable = false;
			} else {
				this.getOwnerComponent().getModel("uiModel").getData().fieldsEditable = true;
			}
			this.getOwnerComponent().getModel("uiModel").refresh();
		},
		onPressSubmit: function (evt) {

			var fnSuccess = function () {
				sap.m.MessageToast.show("Items updated Successfully");
				this.getOwnerComponent().getModel("uiModel").refresh();
			}.bind(this);
			var fnError = function (oError) {
				sap.m.MessageToast.show(oError.message);
			};
			this.getView().getModel().submitBatch("IndividualAgreementGroup").then(fnSuccess, fnError);

		}

	});

});