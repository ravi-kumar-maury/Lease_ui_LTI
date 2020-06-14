sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/ui/core/Fragment",
	"sap/m/Token"
], function (Controller, Filter, FilterOperator, FilterType, Fragment, Token) {
	"use strict";

	return Controller.extend("com.lti.LeaseManagement.masteragreement.controller.InitialView", {
		onInit: function () {
			//debugger;
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this._oTable = this.byId("idTable");
			//this.getView().getModel("uiModel").setSizeLimit(1000);
			// var that = this;
			// this.getView().addEventDelegate({
			// 	onBeforeShow: function () {
			// 		that.onPressReset();
			// 		that.getView().byId("idTable").removeSelections();
			// 		that.getOwnerComponent().getModel("uiModel").refresh();
			// 		/*	that.getOwnerComponent().getModel("uiModel").getData().showMasterItems = false;
			// 			that.getOwnerComponent().getModel("uiModel").getData().fieldsEditable = true;*/
			// 	}
			// });
		},

		onValueChangeCC: function (oEvent) {
			var oView = this.getView();
			//	this.CompanyCode = oView.byId("idContractDialogCC");
			if (!this.CompanyCode) {
				this.CompanyCode = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.masteragreement.fragments.CompanyCodes", this);
				oView.addDependent(this.CompanyCode);
			}
			if (this.multiFlag)
				this.CompanyCode.setMultiSelect(true);
			else
				this.CompanyCode.setMultiSelect(false);
			this.CompanyCode.open();
			//	this.getView().byId("idContractDialogCC").setMultiSelect(true)
		},

		handleCloseCC: function (oEvent) {
			if (this.multiFlag) {
				var aSelectedItems = oEvent.getParameter("selectedItems"),
					oMultiInput = this.byId("companycode");
				if (aSelectedItems && aSelectedItems.length > 0) {
					aSelectedItems.forEach(function (oItem) {
						oMultiInput.addToken(new Token({
							text: oItem.getTitle()
						}));
					});
				}
			} else {
				var companyCode = oEvent.getSource()._aSelectedItems[0].getTitle();
				this.getView().byId("idCC").setValue(companyCode);
			}
			//	this.CompanyCode.close();
			this.CompanyCode.destroy();
			this.CompanyCode = undefined;
		},

		onValueChangeVen: function (event) {
			var oView = this.getView();
			if (!this.vendordialog) {
				this.vendordialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.masteragreement.fragments.Vendor", this);
				oView.addDependent(this.vendordialog);
			}
			if (this.multiFlag)
				this.vendordialog.setMultiSelect(true);
			else
				this.vendordialog.setMultiSelect(false);
			this.vendordialog.open();

		},
		onValueChangeMst: function (event) {
			var oView = this.getView();
			//this.MasterAgreementDialog = oView.byId("idDialogMst");
			if (!this.MasterAgreementDialog) {
				this.MasterAgreementDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.masteragreement.fragments.MasterAgreement",
					this);
				oView.addDependent(this.MasterAgreementDialog);
			}
			this.MasterAgreementDialog.open();
		},

		onValueChangeLT: function (event) {
			var oView = this.getView();
			if (!this.leasetypeDialog) {
				this.leasetypeDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.masteragreement.fragments.LeaseTypes", this);
				oView.addDependent(this.leasetypeDialog);
			}
			if (this.multiFlag)
				this.leasetypeDialog.setMultiSelect(true);
			else
				this.leasetypeDialog.setMultiSelect(false);
			this.leasetypeDialog.open();
		},

		handleCloseMA: function (oEvent) {
			var desc1 = oEvent.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idMLA").setValue(desc1);
		},
		handleCloseLT: function (oEvent) {
			var desc1 = oEvent.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idTOL").setValue(desc1);
		},
		onSearchCC: function (oEvent) { // build filter array
			var aFilter = [];
			var sQuery = this.CompanyCode._sSearchFieldValue;
			if (sQuery) {
				aFilter.push(new Filter("coCDE", FilterOperator.Contains, sQuery));
			}
			var oBinding = this.CompanyCode._oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		onSearchMA: function (oEvent) { // build filter array
			var aFilter = [];
			var sQuery = this.MasterAgreementDialog._sSearchFieldValue;
			if (sQuery) {
				aFilter.push(new Filter("mastAGGR", FilterOperator.Contains, sQuery));
			}
			var oBinding = this.MasterAgreementDialog._oList.getBinding("items");
			oBinding.filter(aFilter);
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
			this.getView().byId("idVen").setValue(desc1);
		},

		handleCloseSearchType: function (oEvent) {
			this.CompanyCode.destroy();
			this.CompanyCode = undefined;
		},

		handleCloseVendor: function () {
			this.getView().byId("idVendorDialog").destroy();
		},

		onActionAdd: function (oEvent) {
			var masterContractTableBinding = this.getView().byId("idTable").getBinding("items");
			var oInitialData ={"iTEMs":[]};
			var oContext = masterContractTableBinding.create(oInitialData);
			this.getOwnerComponent().getModel("uiModel").getData().showMasterItems = false;
			this.getOwnerComponent().getModel("uiModel").getData().fieldsEditable = true;
			this.getOwnerComponent().getModel("uiModel").getData().fieldsEditable1 = true;
			this.getOwnerComponent().getModel("uiModel").getData().operation = "create";
			this.getOwnerComponent().getModel("uiModel").getData().masterContractContext = oContext;
			this.getOwnerComponent().getRouter().navTo("MasterDetailView");
		},
		/*sonali*/
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
						//	MessageBox.success("Item Deleted.");
						});
				}
				sap.m.MessageBox.success("Item Deleted.");
			}
			sMessage = "Do you really want to delete this Item" + "?";
			sap.m.MessageBox.confirm(sMessage, onConfirm, "Item Deletion");
		},

		// var oTable = this.getView().byId("idTable");
		// var aSelectedItems = oTable.getSelectedItems();

		// for (var i = aSelectedItems.length - 1; i >= 0; i--) { //start with highest index first 
		// 	var oItemContextPath = aSelectedItems[i].getBindingContext().getPath()
		// 	var aPathParts = oItemContextPath.split("/");
		// 	var iIndex = aPathParts[aPathParts.length - 1]; //Index to delete into our array of objects

		// 	var oJSONData = this.getView().getModel("uiModel").getData();
		// 	oJSONData.Product.splice(iIndex, 1); //Use splice to remove your object in the array
		// 	this.getView().getModel().setData(oJSONData); //And set the new data to the model
		// }

		onSearch: function (oEvent) {
			//debugger;
			var oView = this.getView();
			if (oView.byId("idMLA").getValue().length === 0 && oView.byId("idCC").getValue() === "" && oView.byId("idTOL").getValue() ===
				"" &&
				oView
				.byId("idStrt").getValue() === "" && oView.byId("idVen").getValue() === "" && oView.byId("idEnd").getValue() === "") {
				sap.m.MessageBox.warning("Please enter any one value", {
					title: "Warning", // default
					onClose: null // default
				});
				return;
			}
			var that = this;
			var orFilter = [];
			var companycode = oView.byId("idCC").getValue();
			var mstragrmnt = oView.byId("idMLA").getValue();
			var vendor = oView.byId("idVen").getValue();
			var startDate = oView.byId("idStrt").getDateValue();
			var endDate = oView.byId("idEnd").getDateValue();
			var leasetype = oView.byId("idTOL").getValue();
			var f1 = new Filter("coCDE_coCDE", FilterOperator.EQ, companycode);
			var f2 = new Filter("mastAGGR", FilterOperator.EQ, mstragrmnt);
			var f3 = new Filter("vEND_vEND", FilterOperator.EQ, vendor);
			var f4 = new Filter("validFROM", FilterOperator.EQ, startDate);
			var f5 = new Filter("lesTYPE_lesTYPE", FilterOperator.EQ, leasetype);
			var f6 = new Filter("validTO", FilterOperator.EQ, endDate);
			var oTable = this.getView().byId("idTable");
			orFilter = new Filter({
				filters: [f1, f2, f3, f4, f5, f6],
				and: false
			});
			if (oTable.getBinding("items") !== undefined)
				oTable.getBinding("items").filter(orFilter);
		},
		onSearchAgreement: function (oEvent) {
			debugger;
			var oView = this.getView();
			var oTable = oView.byId("idTable");
			if (oView.byId("masterAgreement").getTokens().length === 0 && oView.byId("companycode").getValue() === "" && oView.byId(
					"leasetype")
				.getValue() === "" &&
				oView.byId("vendor").getValue() === "") {
				sap.m.MessageBox.warning("Please enter any one value", {
					title: "Warning",
					onClose: null
				});
				return;
			}
			var orFilter = [];
			var tokens = oView.byId("masterAgreement").getTokens();
			var companycode = oView.byId("companycode").getTokens();
			var mstragrmnt = oView.byId("idMLA").getTokens();
			var leasetype = oView.byId("leasetype").getTokens();
			var vendor = oView.byId("vendor").getTokens();
			var afilters = [];

			$.each(tokens, function (j, token) {
				afilters.push(
					new sap.ui.model.Filter({
						path: "mastAGGR",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: token.getText()
					}));

			});
			$.each(companycode, function (j, token) {
				afilters.push(
					new sap.ui.model.Filter({
						path: "coCDE_coCDE",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: token.getText()
					}));

			});
			$.each(vendor, function (j, token) {
				afilters.push(
					new sap.ui.model.Filter({
						path: "vEND_vEND",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: token.getText()
					}));

			});
			$.each(leasetype, function (j, token) {
				afilters.push(
					new sap.ui.model.Filter({
						path: "lesTYPE_lesTYPE",
						operator: sap.ui.model.FilterOperator.EQ,
						value1: token.getText()
					}));

			});

			var binding = oTable.getBinding("items");
			binding.filter(afilters);

		},

		onPressReset: function () {
			this.getView().byId("idCC").setValue("");
			this.getView().byId("idVen").setValue("");
			this.getView().byId("idCC").setValue("");
			this.getView().byId("idMLA").setValue("");
			this.getView().byId("idTOL").setValue("");
			this.getView().byId("idStrt").setDateValue(null);
			this.getView().byId("idEnd").setDateValue(null);
			var oTable = this.getView().byId("idTable");
			var date = new Date;
			var oDateFormat = sap.ui.core.format.DateFormat.getInstance({
				pattern: "yyyy-MM-dd"
			});
			var oDate = oDateFormat.format(date);
			oTable.getBinding("items").filter(
				new sap.ui.model.Filter("validTO", sap.ui.model.FilterOperator.GT, oDate));
		},

		onSelectChange: function (oEvent) {
			var uiData = this.getOwnerComponent().getModel("uiModel").getData();
			uiData.showMasterItems = true;
			uiData.fieldsEditable = false;
			uiData.fieldsEditable1 = false;
			uiData.operation = "update";
			uiData.masterContractContext = oEvent.getSource().getBindingContext();
			this.getOwnerComponent().getModel("uiModel").refresh();
			this.getOwnerComponent().getRouter().navTo("MasterDetailView");
		},
		SortPress: function (oEvent) {
			if (!this.SortFragment) {
				this.SortFragment = sap.ui.xmlfragment(
					"com.lti.LeaseManagement.masteragreement.fragments.SortFrag", this);
				this.getView().addDependent(this.SortFragment);
			}
			this.SortFragment.open();
		},

		SortFragConfirm: function (oEvent) {
			var AgreementSorter = [];
			var oBinding = this.getView().byId("idTable").getBinding("items");
			var mParams = oEvent.getParameters();
			if (mParams.sortItem !== undefined) {
				var sPath = mParams.sortItem.getKey();
				var bDescending = mParams.sortDescending;
				AgreementSorter.push(new sap.ui.model.Sorter(sPath,
					bDescending));
			}
			if (AgreementSorter.length > 0) {
				oBinding.sort(AgreementSorter);
			}

		},
		handleValueHelp: function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();
			// create value help dialog
			if (!this._valueHelpDialog) {
				Fragment.load({
					id: "idDialogMst",
					name: "com.lti.LeaseManagement.masteragreement.fragments.MasterAgreement",
					controller: this
				}).then(function (oValueHelpDialog) {
					this._valueHelpDialog = oValueHelpDialog;
					this.getView().addDependent(this._valueHelpDialog);
					this._openValueHelpDialog(sInputValue);
				}.bind(this));
			} else {
				this._openValueHelpDialog(sInputValue);
			}
		},

		_openValueHelpDialog: function (sInputValue) {
			// create a filter for the binding
			this._valueHelpDialog.getBinding("items").filter([new Filter(
				"mastAGGR",
				FilterOperator.Contains,
				sInputValue
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		_handleValueHelpSearch: function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"mastAGGR",
				FilterOperator.Contains,
				sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpClose: function (evt) {
			if (this.multiFlag) {
				var aSelectedItems = evt.getParameter("selectedItems"),
					oMultiInput = this.byId("masterAgreement");
				if (aSelectedItems && aSelectedItems.length > 0) {
					aSelectedItems.forEach(function (oItem) {
						oMultiInput.addToken(new Token({
							text: oItem.getTitle()
						}));
					});
				}
			} else if (!this.multiFlag) {
				var desc1 = evt.getSource()._aSelectedItems[0].getTitle();
				this.getView().byId("idMLA").setValue(desc1);
			}
		},
		onCancel: function (oEvent) {
			this.filterDialog.destroy();
			this.multiFlag = false;
		},
		onApplyFilter: function (oEvent) {
			//	var oView = this.getView();
			//	this.oDialog = oView.byId("filterdialog");
			if (!this.filterDialog) {
				this.filterDialog = sap.ui.xmlfragment("com.lti.LeaseManagement.masteragreement.fragments.Filter", this);
				this.getView().addDependent(this.filterDialog);
			}
			this.filterDialog.open();
			this.multiFlag = true;
		}

	});
});