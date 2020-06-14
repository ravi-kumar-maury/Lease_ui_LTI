sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/m/MessageBox",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	"sap/m/MessageToast"
], function (Controller, Filter, MessageBox, FilterOperator, FilterType, MessageToast) {
	"use strict";

	return Controller.extend("IndividualLease.IndividualLease.controller.CreateLease", {
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("CreateLease").attachPatternMatched(this._onRouteMatched, this);

			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		_onRouteMatched: function (oEvent) {
			this.byId("idPageCreate").setBindingContext(this.getOwnerComponent().getModel("uiModel").getData().indContractContext);
			var oView = this.getView();
			var oTnCItems = oView.byId("idTnCItems");
			var valItems = oView.byId("validityItems");
			if (oTnCItems || valItems) {
				oTnCItems.destroy();
				valItems.destroy();
			}
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
		//Create functions
		onAddItem: function (oEvent) {
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
		onDeleteItem: function (oEvent) {
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
			debugger;
			var desc = oEvent.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idVend").setValue(desc);
			this.F4_event.setValue(desc);
		},
		handleCloseVendor: function () {
			this.getView().byId("idVendorDialog").destroy();
		},
		onValueMaster: function (event) {
			var oView = this.getView();
			this.oDialog = oView.byId("idDialogMst");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.MasterAgreement", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCloseSearchType: function () {
			this.getView().byId("idDialogMst").destroy();
		},
		handleConfirmMA: function (oEvent) {
			var desc1 = oEvent.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idMstAggr").setValue(desc1);
			/* to fetch line items with respect to the master Agreement selected */
			this.getView().byId("mstAgrLineNum").getBinding("items").filter([new Filter("mastAGGR_mastAGGR", sap.ui.model.FilterOperator.EQ,
				desc1)]);

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
		onValueChangeMat: function (event) {

			var oView = this.getView();
			this.oDialog = oView.byId("idMatDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.Material", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handlecloseMat: function (event) {
			this.getView().byId("idMatDialog").destroy();
		},
		handleConfirmMat: function (event) {
			var desc1 = event.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idMat").setValue(desc1);
		},
		onValueAssetDesc: function (event) {

			var oView = this.getView();
			this.oDialog = oView.byId("idAsstDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.AssetDescriptn", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCancelAsst: function (event) {
			this.getView().byId("idAsstDialog").destroy();
		},
		handleConfirmAsst: function (event) {
			var desc1 = event.getSource()._aSelectedItems[0].getDescription();
			this.getView().byId("asstDesrcp").setValue(desc1);
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
		onChangeUOM: function (event) {
			var oView = this.getView();
			this.oDialog = oView.byId("idUOMDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.UOM", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCloseUOM: function (event) {
			this.getView().byId("idUOMDialog").destroy();
		},
		handleConfirmUOM: function (event) {
			var desc1 = event.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idUom").setValue(desc1);
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
		onValueCostCenter: function (event) {

			var oView = this.getView();
			this.oDialog = oView.byId("idCostCenterDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.CostCentre", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCancelCostCenter: function (event) {
			this.getView().byId("idCostCenterDialog").destroy();
		},
		handleConfirmCostCenter: function (event) {
			var desc1 = event.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idCostCnt").setValue(desc1);
		},
		onValueOrder: function (event) {
			var oView = this.getView();
			this.oDialog = oView.byId("idOrderDialog");
			if (!this.oDialog) {
				this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.Order", this);
				oView.addDependent(this.oDialog);
			}
			this.oDialog.open();
		},
		handleCancelOrder: function (event) {
			this.getView().byId("idOrderDialog").destroy();
		},
		handleConfirmOrder: function (event) {
			var desc1 = event.getSource()._aSelectedItems[0].getTitle();
			this.getView().byId("idOrder").setValue(desc1);
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
			//this.shortTextEvent = event.getSource().getParent().getCells()[2];
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
		// onChangeVen: function (event) {
		// 	var oView = this.getView();
		// 	this.F4_event = event.getSource();
		// 	//this.shortTextEvent = event.getSource().getParent().getCells()[14];
		// 	this.oDialog = oView.byId("idVendorDialog");
		// 	if (!this.oDialog) {
		// 		this.oDialog = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.Vendor", this);
		// 		oView.addDependent(this.oDialog);
		// 	}
		// 	this.oDialog.open();
		// },

		// handleCloseVendor: function (oEvent) {
		// 	this.getView().byId("idVendorDialog").destroy();
		// },
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
		handleCancelTaxCde: function (event) {
			this.getView().byId("idTaxCdeDialog").destroy();
		},
		handleConfirm: function (oEvent) {
			var temp = oEvent.getSource()._aSelectedItems[0].getTitle();
			this.F4_event.setValue(temp);
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
		onPressSubmit: function (evt) {
			var oView = this.getView();
			if (oView.byId("agrType").getValue() === "" || oView.byId("idVend").getValue() === "" || oView.byId("agrDate").getValue() === "" ||
				oView.byId("idCompCode").getValue() === "" || oView.byId("idQty").getValue() === "" || oView.byId("idAsset").getValue() === "" ||
				oView.byId("asstDesrcp").getValue() === "" || oView.byId("idProfCnt").getValue() === "" || oView.byId("idCurr").getValue() === "" ||
				oView.byId("idExhRate").getValue() === "") {
				sap.m.MessageBox.warning("Please Fill all Required Fields", {
					title: "Warning", // default
					onClose: null // default
				});
				return;
			}
			var uiModelData = this.getOwnerComponent().getModel("uiModel").getData(),
				companyCode = oView.byId("idCompCode").getValue(),
				vend = oView.byId("idVend").getValue(),
				timeStamp = new Date().getTime();
			var indAgrmnt = companyCode + "-" + vend + "-" + timeStamp;
			var agrType = oView.byId("agrType").getSelectedKey();
			uiModelData.indContractContext.setProperty("agNUM", indAgrmnt);
			uiModelData.indContractContext.setProperty("agTYP_docTYP", agrType); //to set the key instead of shown text
			
			debugger;
			var fnSuccess = function () {
				sap.m.MessageToast.show("Items saved Successfully");
				uiModelData.tabsVisible = true;
				//adding fragment to make render the table for terms and condtn items
				var oTnCItems = sap.ui.xmlfragment(oView.getId(), "com.lti.LeaseManagement.individualagreement.fragments.TnCItems", this);
				this.byId("vBoxtnCsubSection").addItem(oTnCItems);
				//fragment for validity table
				var valItems = sap.ui.xmlfragment(this.getView().getId(), "com.lti.LeaseManagement.individualagreement.fragments.ValidityTable",
					this);
				this.byId("vBoxValsubSection").addItem(valItems);
				this.getOwnerComponent().getModel("uiModel").refresh();
			}.bind(this);
			var fnError = function (oError) {
				sap.m.MessageToast.show(oError.message);
			}.bind(this);
			this.getView().getModel().submitBatch("IndividualAgreementGroup").then(fnSuccess, fnError);

		},
		fetchMasterAgr: function (oEvent) {
			var oView = this.getView();
			if (oView.byId("idMstAggr").getValue() === "" || oView.byId("mstAgrLineNum").getValue() === "") {
				sap.m.MessageBox.warning("Please select Master Agreement with line item", {
					title: "Warning",
					onClose: null
				});
				return;
			}
			var mastAgr = oView.byId("idMstAggr").getValue(),
				itemNo = this.getView().byId("mstAgrLineNum").getSelectedItemId(),
				index = itemNo.charAt(itemNo.length - 1),
				f1 = new Filter("mastAGGR", FilterOperator.EQ, mastAgr),
				oModel = this.getOwnerComponent().getModel(),
				oListBinding = oModel.bindList("/ZLTI_LA_MASTRLA", undefined, undefined, f1, {
					$expand: 'iTEMs'
				});
			oListBinding.getContexts(0, Infinity);
			oListBinding.attachChange(function (oEvt) {
				var aContexts = oListBinding.getContexts(0, Infinity);
				var data = aContexts.map(indContractContext => indContractContext.getObject());
				if (data.length > 0) {
					var masterAgreement = data[0],
						item = masterAgreement.iTEMs[index],
						indAgreementContext = this.byId("idPageCreate").getBindingContext();
					indAgreementContext.setProperty("mastCONTNUM", masterAgreement.mastAGGR);
					indAgreementContext.setProperty("vEND_vEND", masterAgreement.vEND_vEND);
					indAgreementContext.setProperty("aggDt", masterAgreement.aggDt);
					indAgreementContext.setProperty("coCDE_coCDE", masterAgreement.coCDE_coCDE);
					indAgreementContext.setProperty("cURR_cURR", masterAgreement.cURR_cURR);
					indAgreementContext.setProperty("lesTYPE_lesTYPE", masterAgreement.lesTYPE_lesTYPE);
					indAgreementContext.setProperty("pLNT_pLNT", masterAgreement.pLNT_pLNT);
					indAgreementContext.setProperty("qTY", masterAgreement.targVAL);
					indAgreementContext.setProperty("uOM_uOM", item.uOM_uOM);
					indAgreementContext.setProperty("qTY", item.targQTY);
					indAgreementContext.setProperty("buyBACK", item.buyBACK);
					indAgreementContext.setProperty("assDesc", item.shrtTEXT);
				}
			}.bind(this));
		}

	});
});