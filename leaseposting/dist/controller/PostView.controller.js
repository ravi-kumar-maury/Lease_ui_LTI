//var VM, InPstModel;
var that;
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/m/ColumnListItem",
	"sap/m/MessageToast",
	// "com/lti/LeaseManagement/LeaseAccountingJobs/Utils/UIHelper",
	'sap/m/Token'
], function (Controller, JSONModel, Fragment, ColumnListItem, MessageToast, Token) {
	"use strict";

	return Controller.extend("com.lti.LeaseManagement.leaseposting.controller.PostView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.lti.LeaseManagement.leaseposting.view.PostView
		 */
		onInit: function () {
			debugger;

			that = this;
			var oModel = new JSONModel();
			oModel.setData({
				dateValue: new Date()
			});
			this.getView().setModel(oModel, "dateModel");
			this.GLModel = this.getView().getModel("GLModel");

			if (sap.ushell && sap.ushell.Container && sap.ushell.Container.getService) {
				var oComponentFT = sap.ui.core.Component.getOwnerComponentFor(this.getView());
				this.oPersonalizationServiceFT = sap.ushell.Container.getService("Personalization");
				var oPersIdFT = {
					container: "PersonalisationBFOContainerFT", //any
					item: "DemoFilterUIFT" //any- I have used the table name 
				};
				// define scope 
				var oScopeFT = {
					keyCategory: this.oPersonalizationServiceFT.constants.keyCategory.FIXED_KEY,
					writeFrequency: this.oPersonalizationServiceFT.constants.writeFrequency.LOW,
					clientStorageAllowed: false,
					Validity: Infinity
				};

				var oPersonalizerFT = this.oPersonalizationServiceFT.getPersonalizer(oPersIdFT, oScopeFT, oComponentFT);
				this.oPersonalizationServiceFT.getContainer("PersonalisationBFOContainerFT", oScopeFT, oComponentFT)
					.fail(function () {
						MessageToast.show("personalisation container not working");
					})
					.done(function (oContainerFT) {
						debugger;
						this.oContainerFT = oContainerFT;
						this.oVariantSetAdapterFT = new sap.ushell.services.Personalization.VariantSetAdapter(this.oContainerFT);
						// get variant set which is stored in backend
						this.oVariantSetFT = this.oVariantSetAdapterFT.getVariantSet("DemoFilterUIFT");
						if (!this.oVariantSetFT) { //if not in backend, then create one
							this.oVariantSetFT = this.oVariantSetAdapterFT.addVariantSet("DemoFilterUIFT");
						}

						// array to store the existing variants
						var VariantFT = [];
						// now get the existing variants from the backend to show as list
						for (var key in this.oVariantSetFT.getVariantNamesAndKeys()) {
							if (this.oVariantSetFT.getVariantNamesAndKeys().hasOwnProperty(key)) {
								var oVariantItemObjectFT = {};
								oVariantItemObjectFT.Key = this.oVariantSetFT.getVariantNamesAndKeys()[key];
								oVariantItemObjectFT.Name = key;
								VariantFT.push(oVariantItemObjectFT);
							}
						}
						if (this.oVariantSetFT.getCurrentVariantKey() !== null) {
							var defVariantKeyFT = this.oVariantSetFT.getCurrentVariantKey();
							// this.oVariantModelFT.oData.defVariant = this.oVariantModelFT.oData.VariantFT[defVariantKeyFT].Name;
						}
						// create JSON model and attach to the variant management UI control
						this.oVariantModelFT = new sap.ui.model.json.JSONModel();
						this.oVariantModelFT.oData.VariantFT = VariantFT;
						this.oVariantModelFT.oData.defVariantKeyFT = defVariantKeyFT;
						this.getView().byId("VariantFT").setModel(this.oVariantModelFT);
						this.oVariantModelFT.updateBindings(true);

						//	var variantNameFT = this.oVariantSetFT.getVariant(this.oVariantModelFT.oData.defVariantKeyFT);
						//	this._setSelectedVariantToTable(variantNameFT);
					}.bind(this));
			}
		},

		onNavPress: function () {
			this.getOwnerComponent().getRouter().navTo("RouteInitialView");
		},

		onSelectChkBox: function () {
			var value = this.getView().byId("idChkBox").getSelected();
			if (!value)
				this.getView().byId("idDTP").setEditable(true);
			else if (value) {
				this.getView().byId("idDTP").setEditable(false);
				var oDateTime = this.getView().getModel("dateModel");
				oDateTime.setProperty("/dateValue", new Date());
			}
		},

		handleValueHelp: function (oEvent) {
			debugger;
			// if (!this._oDialog) {
			Fragment.load({
				name: "com.lti.LeaseManagement.leaseposting.fragments.ValueHelpDialog",
				controller: this
			}).then(function (oDialog) {
				this._oDialog = oDialog;
				this.getView().addDependent(this._oDialog);
				this._oDialog.setModel(this.getView().getModel("JTModel"));
				this._oDialog.open();
			}.bind(this));
			// } else {
			// 	this._oDialog.open();
			// }
		},

		handleValueHelpClose: function (evt) {
			debugger;
			var value = evt.getParameter("selectedItem").getTitle();
			this.getView().byId("idJTInput").setValue(value);
			this.getView().byId("idJNInput").setValue(value);
			var path = evt.getParameter("selectedItem").getBindingContextPath();
			this.key = this.getView().getModel("JTModel").getObject(path).Key;
			this.handleFormVisible();
			this._oDialog.destroy();
		},

		handleFormVisible: function () {
			debugger;
			if (this.key == "1") {
				this.getView().getModel("VisModel").setProperty("/leaserouform", true);
				this.getView().getModel("VisModel").setProperty("/amortdocform", false);
			} else {
				this.getView().getModel("VisModel").setProperty("/leaserouform", false);
				this.getView().getModel("VisModel").setProperty("/amortdocform", true);
			}
			if (this.key == "8") {
				this.getView().getModel("VisModel").setProperty("/GenDet", false);
				this.getView().getModel("VisModel").setProperty("/ImpOpt", true);
				this.getView().getModel("VisModel").setProperty("/ImpDet", true);
			} else {
				this.getView().getModel("VisModel").setProperty("/GenDet", true);
				this.getView().getModel("VisModel").setProperty("/ImpOpt", false);
				this.getView().getModel("VisModel").setProperty("/ImpDet", false);
			}
			if (this.key == "9") {
				this.getView().getModel("VisModel").setProperty("/InvPost", true);
				// this.getView().byId("idInvPostTbl").setVisible(true);
			} else {
				this.getView().getModel("VisModel").setProperty("/InvPost", false);
				// this.getView().byId("idInvPostTbl").setVisible(false);
			}
			if (this.key == "10") {
				this.getView().byId("idPDFE").setVisible(false);
				this.getView().byId("idLANFE").setVisible(true);
				this.getView().byId("idSLANFE").setVisible(true);
				this.getView().byId("idNIAFE").setVisible(true);
				this.getView().byId("idPDTSubLeased").setVisible(true);
				this.getView().byId("idPPSubLeased").setVisible(true);
				this.getView().byId("idPDT").setVisible(false);
				this.getView().byId("idPP").setVisible(false);
			} else {
				this.getView().byId("idPDFE").setVisible(true);
				this.getView().byId("idLANFE").setVisible(false);
				this.getView().byId("idSLANFE").setVisible(false);
				this.getView().byId("idNIAFE").setVisible(false);
				this.getView().byId("idPDTSubLeased").setVisible(false);
				this.getView().byId("idPPSubLeased").setVisible(false);
				this.getView().byId("idPDT").setVisible(true);
				this.getView().byId("idPP").setVisible(true);
			}
			switch (this.key) {
				// case "1":

				// 	break;
			case "2":
			case "3":
				this.getView().getModel("VisModel").setProperty("/revpost", false);
				this.getView().getModel("VisModel").setProperty("/revspecif", false);
				this.getView().getModel("VisModel").setProperty("/MarkVal", false);
				this.getView().getModel("VisModel").setProperty("/DiffBB", false);
				this.getView().getModel("VisModel").setProperty("/Pen", false);
				this.getView().getModel("VisModel").setProperty("/ImpOpt", false);
				this.getView().getModel("VisModel").setProperty("/ImpDet", false);
				if (this.key == "3") {
					this.getView().byId("idCCLabel").setRequired(true);
					this.getView().byId("idFYLabel").setRequired(true);
					this.getView().byId("idPODOCLabel").setRequired(true);
					this.getView().byId("idPPLabel").setRequired(true);
				} else if (this.key == "2") {
					this.getView().byId("idCCLabel").setRequired(false);
					this.getView().byId("idFYLabel").setRequired(false);
					this.getView().byId("idPODOCLabel").setRequired(false);
					this.getView().byId("idPPLabel").setRequired(false);
				}
				break;
			case "4":
				this.getView().getModel("VisModel").setProperty("/revpost", true);
				this.getView().getModel("VisModel").setProperty("/revspecif", false);
				this.getView().getModel("VisModel").setProperty("/MarkVal", false);
				this.getView().getModel("VisModel").setProperty("/DiffBB", false);
				this.getView().getModel("VisModel").setProperty("/Pen", false);
				this.getView().getModel("VisModel").setProperty("/ImpOpt", false);
				this.getView().getModel("VisModel").setProperty("/ImpDet", false);
				this.onChangeRevPost();
				break;
			case "5":
				this.getView().getModel("VisModel").setProperty("/revpost", false);
				this.getView().getModel("VisModel").setProperty("/revspecif", false);
				this.getView().getModel("VisModel").setProperty("/MarkVal", true);
				this.getView().getModel("VisModel").setProperty("/DiffBB", false);
				this.getView().getModel("VisModel").setProperty("/Pen", false);
				this.getView().getModel("VisModel").setProperty("/ImpOpt", false);
				this.getView().getModel("VisModel").setProperty("/ImpDet", false);
				break;
			case "6":
				this.getView().getModel("VisModel").setProperty("/revpost", false);
				this.getView().getModel("VisModel").setProperty("/revspecif", false);
				this.getView().getModel("VisModel").setProperty("/MarkVal", false);
				this.getView().getModel("VisModel").setProperty("/DiffBB", true);
				this.getView().getModel("VisModel").setProperty("/Pen", false);
				this.getView().getModel("VisModel").setProperty("/ImpOpt", false);
				this.getView().getModel("VisModel").setProperty("/ImpDet", false);
				break;
			case "7":
				this.getView().getModel("VisModel").setProperty("/revpost", false);
				this.getView().getModel("VisModel").setProperty("/revspecif", false);
				this.getView().getModel("VisModel").setProperty("/MarkVal", false);
				this.getView().getModel("VisModel").setProperty("/DiffBB", false);
				this.getView().getModel("VisModel").setProperty("/Pen", true);
				this.getView().getModel("VisModel").setProperty("/ImpOpt", false);
				this.getView().getModel("VisModel").setProperty("/ImpDet", false);
				break;
			case "8":
				this.getView().getModel("VisModel").setProperty("/revpost", false);
				this.getView().getModel("VisModel").setProperty("/revspecif", false);
				this.getView().getModel("VisModel").setProperty("/MarkVal", false);
				this.getView().getModel("VisModel").setProperty("/DiffBB", false);
				this.getView().getModel("VisModel").setProperty("/Pen", false);
				// this.getView().getModel("VisModel").setProperty("/ImpOpt", true);
				// this.getView().getModel("VisModel").setProperty("/ImpDet", true);
				this.handleRadioButtonSelect();
				break;
			case "9":
				this.getView().getModel("VisModel").setProperty("/revpost", false);
				this.getView().getModel("VisModel").setProperty("/revspecif", false);
				this.getView().getModel("VisModel").setProperty("/MarkVal", false);
				this.getView().getModel("VisModel").setProperty("/DiffBB", false);
				this.getView().getModel("VisModel").setProperty("/Pen", false);
				this.getView().getModel("VisModel").setProperty("/ImpOpt", false);
				this.getView().getModel("VisModel").setProperty("/ImpDet", false);
				break;
			}

			this.getView().getModel("VisModel").setData(this.getView().getModel("VisModel").getData());
			this.getView().getModel("VisModel").updateBindings(true);
			// this.getView().getModel("VisModel").refresh();
		},

		handleRadioButtonSelect: function () {
			debugger;
			if (this.getView().byId("idImpairment").getSelected()) {
				this.getView().byId("idRevDoc").setVisible(false);
				this.getView().byId("idRevDocYr").setVisible(false);
				this.getView().byId("idRevReason").setVisible(false);
				this.getView().byId("idRevDt").setVisible(false);
				this.getView().byId("idAccPrin").setVisible(true);
				this.getView().byId("idDepArea").setVisible(true);
				this.getView().byId("idIV").setVisible(true);
				this.getView().byId("idDT").setVisible(true);
			} else if (this.getView().byId("idImpairmentRev").getSelected()) {
				this.getView().byId("idRevDoc").setVisible(true);
				this.getView().byId("idRevDocYr").setVisible(true);
				this.getView().byId("idRevReason").setVisible(true);
				this.getView().byId("idRevDt").setVisible(true);
				this.getView().byId("idAccPrin").setVisible(false);
				this.getView().byId("idDepArea").setVisible(false);
				this.getView().byId("idIV").setVisible(false);
				this.getView().byId("idDT").setVisible(false);
			}
		},

		onChangeRevPost: function () {
			debugger;
			if (this.getView().byId("idAccRejRevPost").getState()) {
				this.getView().getModel("VisModel").setProperty("/revspecif", true);
			} else {
				this.getView().getModel("VisModel").setProperty("/revspecif", false);
			}
		},

		onActionAddLine: function () {
			debugger;
			var oItem = this.getView().byId("idInvPostTbl").getModel("InPstModel"),
				oData = oItem.getProperty("/newItem");

			oData.push({
				"glAcc": "",
				"shrtText": "",
				"dc": "",
				"amtDocCur": "",
				"locCurAmt": "",
				"taxCD": "",
				"taxJC": "",
				"assig": "",
				"busArea": "",
				"cc": "",
				"pc": "",
				"order": "",
				"pdoc": "",
				"lineItem": "",
				"wbs": ""
			});
			oItem.refresh();
		},

		onActionDelete: function () {
			debugger;
			var oTable = this.getView().byId("idInvPostTbl"),
				model = oTable.getModel("InPstModel"),
				data = oTable.getModel("InPstModel").getData().newItem;

			var ocontexts = oTable.getSelectedContexts();
			if (ocontexts.length == 0)
				MessageToast.show("Please select at least one row to delete");

			for (var i = ocontexts.length - 1; i >= 0; i--) {
				var index = ocontexts[i].getPath().substr("-1");
				data.splice(index, 1);
				model.refresh();
			}
			oTable.removeSelections(true);
		},

		onValueChangeCC: function (oEvent) {
			debugger;
			Fragment.load({
				name: "com.lti.LeaseManagement.leaseposting.fragments.ComCodeDialog",
				controller: this
			}).then(function (oDialog) {
				this._oDialog = oDialog;
				this.getView().addDependent(this._oDialog);
				// this._oDialog.setModel(this.getView().getModel("JTModel"));
				this._oDialog.open();
			}.bind(this));

			this.oSourceId = oEvent.getSource();
		},
		onValueChangePDT1: function (oEvent) {
			debugger;
			// if (!this._oDialog) {
			Fragment.load({
				name: "com.lti.LeaseManagement.leaseposting.fragments.PDT1",
				controller: this
			}).then(function (oDialog) {
				this._oDialog = oDialog;
				this.getView().addDependent(this._oDialog);
				// this._oDialog.setModel(this.getView().getModel("JTModel"));
				this._oDialog.open();
			}.bind(this));
			// } else {
			// 	this._oDialog.open();
			// }
			this.oSourceId = oEvent.getSource();
		},
		onValueChangePDT2: function (oEvent) {
			debugger;
			// if (!this._oDialog) {
			Fragment.load({
				name: "com.lti.LeaseManagement.leaseposting.fragments.PDT2",
				controller: this
			}).then(function (oDialog) {
				this._oDialog = oDialog;
				this.getView().addDependent(this._oDialog);
				// this._oDialog.setModel(this.getView().getModel("JTModel"));
				this._oDialog.open();
			}.bind(this));
			// } else {
			// 	this._oDialog.open();
			// }
			this.oSourceId = oEvent.getSource();
		},
		onValueChangeLAN: function (oEvent) {
			debugger;
			// if (!this._oDialog) {
			Fragment.load({
				name: "com.lti.LeaseManagement.leaseposting.fragments.LAN",
				controller: this
			}).then(function (oDialog) {
				this._oDialog = oDialog;
				this.getView().addDependent(this._oDialog);
				// this._oDialog.setModel(this.getView().getModel("JTModel"));
				this._oDialog.open();
			}.bind(this));
			// } else {
			// 	this._oDialog.open();
			// }
			this.oSourceId = oEvent.getSource();
		},
		onValueChangePDSN: function (oEvent) {
			debugger;
			// if (!this._oDialog) {
			Fragment.load({
				name: "com.lti.LeaseManagement.leaseposting.fragments.PDSN",
				controller: this
			}).then(function (oDialog) {
				this._oDialog = oDialog;
				this.getView().addDependent(this._oDialog);
				// this._oDialog.setModel(this.getView().getModel("JTModel"));
				this._oDialog.open();
			}.bind(this));
			// } else {
			// 	this._oDialog.open();
			// }
			this.oSourceId = oEvent.getSource();
		},
		onValueChangePODT1: function (oEvent) {
			debugger;
			// if (!this._oDialog) {
			Fragment.load({
				name: "com.lti.LeaseManagement.leaseposting.fragments.PODT1",
				controller: this
			}).then(function (oDialog) {
				this._oDialog = oDialog;
				this.getView().addDependent(this._oDialog);
				// this._oDialog.setModel(this.getView().getModel("JTModel"));
				this._oDialog.open();
			}.bind(this));
			// } else {
			// 	this._oDialog.open();
			// }
			this.oSourceId = oEvent.getSource();
		},
		onValueChangePODT2: function (oEvent) {
			debugger;
			// if (!this._oDialog) {
			Fragment.load({
				name: "com.lti.LeaseManagement.leaseposting.fragments.PODT2",
				controller: this
			}).then(function (oDialog) {
				this._oDialog = oDialog;
				this.getView().addDependent(this._oDialog);
				// this._oDialog.setModel(this.getView().getModel("JTModel"));
				this._oDialog.open();
			}.bind(this));
			// } else {
			// 	this._oDialog.open();
			// }
			this.oSourceId = oEvent.getSource();
		},
		onValueChangeCostCen: function (oEvent) {
			debugger;
			// if (!this._oDialog) {
			Fragment.load({
				name: "com.lti.LeaseManagement.leaseposting.fragments.CostCen",
				controller: this
			}).then(function (oDialog) {
				this._oDialog = oDialog;
				this.getView().addDependent(this._oDialog);
				// this._oDialog.setModel(this.getView().getModel("JTModel"));
				this._oDialog.open();
			}.bind(this));
			// } else {
			// 	this._oDialog.open();
			// }
			this.oSourceId = oEvent.getSource();
		},
		onValueChangeRevReason: function (oEvent) {
			debugger;
			// if (!this._oDialog) {
			Fragment.load({
				name: "com.lti.LeaseManagement.leaseposting.fragments.RevReason",
				controller: this
			}).then(function (oDialog) {
				this._oDialog = oDialog;
				this.getView().addDependent(this._oDialog);
				// this._oDialog.setModel(this.getView().getModel("JTModel"));
				this._oDialog.open();
			}.bind(this));
			// } else {
			// 	this._oDialog.open();
			// }
			this.oSourceId = oEvent.getSource();
		},
		onValueChangeGLI: function (oEvent) {
			debugger;
			// if (!this._oDialog) {
			Fragment.load({
				name: "com.lti.LeaseManagement.leaseposting.fragments.GLInd",
				controller: this
			}).then(function (oDialog) {
				this._oDialog = oDialog;
				this.getView().addDependent(this._oDialog);
				// this._oDialog.setModel(this.getView().getModel("JTModel"));
				this._oDialog.open();
			}.bind(this));
			// } else {
			// 	this._oDialog.open();
			// }
			this.oSourceId = oEvent.getSource();
		},
		onValueChangeGLA: function (oEvent) {
			debugger;
			// if (!this._oDialog) {
			Fragment.load({
				name: "com.lti.LeaseManagement.leaseposting.fragments.GLA",
				controller: this
			}).then(function (oDialog) {
				this._oDialog = oDialog;
				this.getView().addDependent(this._oDialog);
				// this._oDialog.setModel(this.getView().getModel("JTModel"));
				this._oDialog.open();
			}.bind(this));
			// } else {
			// 	this._oDialog.open();
			// }
			this.oSourceId = oEvent.getSource();
		},
		onValueChangeWBS: function (oEvent) {
			debugger;
			// if (!this._oDialog) {
			Fragment.load({
				name: "com.lti.LeaseManagement.leaseposting.fragments.WBS",
				controller: this
			}).then(function (oDialog) {
				this._oDialog = oDialog;
				this.getView().addDependent(this._oDialog);
				// this._oDialog.setModel(this.getView().getModel("JTModel"));
				this._oDialog.open();
			}.bind(this));
			// } else {
			// 	this._oDialog.open();
			// }
			this.oSourceId = oEvent.getSource();
		},
		onValueChangeProfCen: function (oEvent) {
			debugger;
			// if (!this._oDialog) {
			Fragment.load({
				name: "com.lti.LeaseManagement.leaseposting.fragments.ProfCen",
				controller: this
			}).then(function (oDialog) {
				this._oDialog = oDialog;
				this.getView().addDependent(this._oDialog);
				// this._oDialog.setModel(this.getView().getModel("JTModel"));
				this._oDialog.open();
			}.bind(this));
			// } 
			// else {
			// 	this._oDialog.open();
			// }
			this.oSourceId = oEvent.getSource();
		},

		handleCancel: function (evt) {
			debugger;
			this._oDialog.destroy();
		},

		handleConfirm: function (evt) {
			debugger;
			// if (evt.getSource().getId() != "idPDN1Dialog") {
			var oItem = evt.getParameter("selectedItem").getTitle();
			this.oSourceId.setValue(oItem);
			// } 
			// else if (evt.getSource().getId() == "idPDN1Dialog") {
			// 	var oItems = evt.getParameter("selectedItems"),
			// 		oMultiInput = this.getView().byId("LAN1");
			// 	if (oItems && oItems.length > 0) {
			// 		oItems.forEach(function (oLAN) {
			// 			oMultiInput.addToken(new Token({
			// 				text: oLAN.getTitle()
			// 			}));
			// 		});
			// 	}
			// }
			this.oSourceId = "";
			this._oDialog.destroy();
		},

		handleGLConfirm: function (evt) {
			debugger;
			var oGLItem = evt.getParameter("selectedItem").getTitle(),
				oPath = evt.getParameter("selectedItem").getBindingContextPath(),
				oValue;

			oValue = this.GLModel.getProperty(oPath).value;
			this.oSourceId.setValue(oValue + ": " + oGLItem);

			this.oSourceId = "";
			this._oDialog.destroy();
		},

		onPressSave: function (oEvent) {
			debugger;

			var VariantParam = oEvent.getParameters(),
				flag = 0;
			for (var i = 0; i < Object.keys(this.oVariantSetFT._oVariantSetData.variants).length; i++) {
				if (this.oVariantSetFT._oVariantSetData.variants[Object.keys(this.oVariantSetFT._oVariantSetData.variants)[i]].name ===
					VariantParam.name) {
					flag = 1;
					break;
				}
			}
			if (flag === 0) {
				this.oVarianFT = this.oVariantSetFT.addVariant(VariantParam.name);
			} else {
				// this.oVarianFT = this.oVariantSetFT.getVariant(this.getView().byId("VariantFT").getSelectionKey());
				this.oVarianFT = this.oVariantSetFT.getVariant(this.oVariantSetFT.getVariantKeyByName(this.getView().byId("VariantFT")._getVariantText()));
			}
			// if (this.oVarianFT) {
			// 	this.oVarianFT.setItemValue("FormVal", this._filBarVariant());

			if (this.oVarianFT) {

				this.oVarianFT.setItemValue("FiltersVal", this.saveFormData());
				if (VariantParam.def === true) {
					debugger;
					this.oVariantSetFT.setCurrentVariantKey(this.oVarianFT.getVariantKey());
				}
				this.oContainerFT.save().fail(function () {
					console.log("Failed");
				}).done(function () {
					console.log("Saved");
				});
				this.oContainerFT.saveDeferred().fail(function () {
					console.log("Failed");
				}).done(function () {
					console.log("Saved");
				}).then(function () {
					console.log("Then");
				});

			}
		},

		onManageVariFT: function (oEvent) {
			debugger;
			var aParameters = oEvent.getParameters();
			// rename variants
			if (aParameters.renamed.length > 0) {
				aParameters.renamed.forEach(function (aRenamed) {
					var sVariant = this.oVariantSetFT.getVariant(aRenamed.key);
					// fItemValue = sVariant.getItemValue("FiltersVal");
					// delete the variant 
					this.oVariantSetFT.delVariant(aRenamed.key);
					// after delete, add a new variant
					// var oNewVariant = this.oVariantSetFT.addVariant(aRenamed.name);
					// oNewVariant.setItemValue("FiltersVal", fItemValue);
				}.bind(this));
			}
			// // default variant change
			// Delete variants
			if (aParameters.deleted.length > 0) {
				aParameters.deleted.forEach(function (aDelete) {
					this.oVariantSetFT.delVariant(aDelete);
				}.bind(this));
			}
			//  Save the Variant Container
			this.oContainerFT.save().done(function () {
				// Tell the user that the personalization data was saved
				console.log("Deleted");
			}).fail(function () {
				console.log("Failed");
			});
		},

		saveFormData: function () {
			debugger;
			// var oSelectedBtn = this.getView().byId("idLARadBtn").getSelectedButton().getText(),
			var formData = this.getView().byId("idLeaseROUForm");
			this.formArray = {};

			if (this.key == "1") {
				this.formArray.LRCC = this.getView().byId("idGenCC").getValue();
				this.formArray.LRPDT1 = this.getView().byId("idPDT1").getValue();
				this.formArray.LRPDT2 = this.getView().byId("idPDT2").getValue();
				this.formArray.LRLAN1 = this.getView().byId("LAN1").getValue();
				this.formArray.LRLAN2 = this.getView().byId("LAN2").getValue();
				this.formArray.LRSwitch = this.getView().byId("Switch").getState();
				this.formArray.LRPost = this.getView().byId("idLARadBtn").getSelectedIndex();
			} else if (this.key == "8") {
				this.formArray.ICC = this.getView().byId("idGCostCen").getValue();
				this.formArray.IPD = this.getView().byId("idGPDDt").getValue();
				this.formArray.ILAN = this.getView().byId("idGILAN").getValue();
				this.formArray.IImp = this.getView().byId("idRBG").getSelectedIndex();
				if (this.formArray.IImp == "0") {
					this.formArray.IAP = this.getView().byId("idGAP").getValue();
					this.formArray.IDA = this.getView().byId("idGDAr").getValue();
					this.formArray.IIV = this.getView().byId("idGIV").getValue();
					this.formArray.IDT1 = this.getView().byId("idGDTyp").getValue();
					this.formArray.IDT2 = this.getView().byId("idGDTyp1").getValue();
				} else if (this.formArray.IImp == "1") {
					this.formArray.IRDoc = this.getView().byId("idGRD").getValue();
					this.formArray.IRDY = this.getView().byId("idGYr").getValue();
					this.formArray.IRR = this.getView().byId("idGRReas").getValue();
					this.formArray.IRDt = this.getView().byId("idGRRDt").getValue();
				}
			} else if (null != this.key || "" != this.key) {
				this.formArray.OCC = this.getView().byId("idGCC").getValue();
				this.formArray.OFY = this.getView().byId("idGFY").getValue();
				this.formArray.OSwitch = this.getView().byId("idGSW").getState();
				if (this.key != "10") {
					this.formArray.OPDT1 = this.getView().byId("idGPO1").getValue();
					this.formArray.OPDT2 = this.getView().byId("idGPO2").getValue();
					this.formArray.OPP1 = this.getView().byId("idGPPer").getValue();
					this.formArray.OPP2 = this.getView().byId("idGPPTo").getValue();
					this.formArray.OLAN1 = this.getView().byId("idGLAN1").getValue();
					this.formArray.OLAN2 = this.getView().byId("idGLAN2").getValue();
				} else if (this.key == "10") {
					this.formArray.SLPDT = this.getView().byId("idGPDOC").getValue();
					this.formArray.SLPP = this.getView().byId("idGPostPer").getValue();
					this.formArray.SLLAN = this.getView().byId("idGLAN").getValue();
					this.formArray.SLSLAN = this.getView().byId("idGSLAN").getValue();
					this.formArray.SLNIA = this.getView().byId("idGNIA").getValue();
				}
				if (this.key == "4") {
					this.formArray.ORevSwitch = this.getView().byId("idAccRejRevPost").getState();
					if (this.formArray.ORevSwitch) {
						this.formArray.OReveReason = this.getView().byId("idGRR").getValue();
						this.formArray.ORevePosDt = this.getView().byId("idGRRDT").getValue();
					}
				} else if (this.key == "5") {
					this.formArray.OMarkValue = this.getView().byId("idGMV").getValue();
				} else if (this.key == "6") {
					this.formArray.ODBB = this.getView().byId("idGDBA").getValue();
					this.formArray.OANum = this.getView().byId("idGAN").getValue();
					this.formArray.OASNum = this.getView().byId("idGASN").getValue();
				} else if (this.key == "7") {
					this.formArray.OPen = this.getView().byId("idGPen").getValue();
				} else if (this.key == "9") {
					this.formArray.OPDT = this.getView().byId("idGPDT").getValue();
					this.formArray.OPDate = this.getView().byId("idGDP").getValue();
					this.formArray.ODDt = this.getView().byId("idGDT").getValue();
					this.formArray.OGLI = this.getView().byId("idGGI").getValue();
					this.formArray.ORef = this.getView().byId("idGRef").getValue();

					/*this.formArray.TABGLA = this.getView().byId("idTGLAcc").getValue();
					this.formArray.TABSTxt = this.getView().byId("idSTxt").getValue();
					this.formArray.TABST = this.getView().byId("idGPen").getValue();
					this.formArray.TABDC = this.getView().byId("idGPen").getValue();
					this.formArray.TABADC = this.getView().byId("idGPen").getValue();
					this.formArray.TABLCA = this.getView().byId("idGPen").getValue();
					this.formArray.TABTC = this.getView().byId("idGPen").getValue();
					this.formArray.TABTJC = this.getView().byId("idGPen").getValue();
					this.formArray.TAB = this.getView().byId("idGPen").getValue();
					this.formArray.TAB = this.getView().byId("idGPen").getValue();
					this.formArray.TAB = this.getView().byId("idGPen").getValue();*/

					/*var aColumnsData = [];
					this.getView().byId("idInvPostTbl").getColumns().forEach(function (oColumn, index) {
						var aColumn = {};
						debugger;
						// aColumn.fieldName = oColumn.getProperty("name");
						aColumn.TABGLA = oColumn.mAggregations.label.mProperties.text;
						aColumn.index = index;
						aColumn.Visible = oColumn.getVisible();
						aColumnsData.push(aColumn);
					});*/

					// this.getView().byId("idInvPostTbl").getItems().forEach(function (oItem, index) {
					// debugger;
					// var aColumn = {};
					// aColumn = oItem.getCells()[index].getProperty("value");
					/*aColumn.TABSTxt = this.getView().byId("idSTxt").getValue();
					aColumn.TABDC = this.getView().byId("idTCB").getValue();
					aColumn.TABADC = this.getView().byId("idGPen").getValue();
					aColumn.TABLCA = this.getView().byId("idGPen").getValue();
					aColumn.TABTC = this.getView().byId("idGPen").getValue();
					aColumn.TABTJC = this.getView().byId("idGPen").getValue();*/
					// this.formArray.push(aColumn);
					// });
				}
			}
			return this.formArray;
		},

		onSelVariFT: function (oEvent) {
			debugger;
			that.getView().byId("VariantFT").currentVariantSetModified(true);
			var selectedKey = oEvent.getParameters().key;
			if (oEvent.getSource().getVariantItems().length !== 0) {
				for (var i = 0; i < oEvent.getSource().getVariantItems().length; i++) {
					if (oEvent.getSource().getVariantItems()[i].getProperty("key") === selectedKey) {
						var selectedVariant = oEvent.getSource().getVariantItems()[i].getProperty("key");
						break;
					}
				}
			} else {
				for (i = 0; i < oEvent.getSource().getItems().length; i++) {
					if (oEvent.getSource().getItems()[i].getProperty("key") === selectedKey) {
						selectedVariant = oEvent.getSource().getItems()[i].getProperty("text");
						break;
					}
				}
			}
			this.setSelectedVariantToForm(selectedVariant);
			// this.getView().byId("idGenCC").setValue(this.formArray.LRCC);
		},

		setSelectedVariantToForm: function (selectedVariant) {
			debugger;
			if (this.key == "1") {
				this.getView().byId("idGenCC").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.LRCC);
				this.getView().byId("idPDT1").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.LRPDT1);
				this.getView().byId("idPDT2").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.LRPDT2);
				this.getView().byId("LAN1").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.LRLAN1);
				this.getView().byId("LAN2").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.LRLAN2);
				this.getView().byId("Switch").setState(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.LRSwitch);
				this.getView().byId("idLARadBtn").setSelectedIndex(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal
					.LRPost);
			} else if (this.key == "8") {
				this.getView().byId("idGCostCen").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal
					.ICC);
				this.getView().byId("idGPDDt").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.IPD);
				this.getView().byId("idGILAN").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.ILAN);
				this.getView().byId("idRBG").setSelectedIndex(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal
					.IImp);
				var oImp = this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.IImp;
				if (oImp == "0") {
					this.getView().byId("idGAP").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.IAP);
					this.getView().byId("idGDAr").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.IDA);
					this.getView().byId("idGIV").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.IIV);
					this.getView().byId("idGDTyp").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.IDT1);
					this.getView().byId("idGDTyp1").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.IDT2);
				} else if (oImp == "1") {
					this.getView().byId("idGRD").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.IRDoc);
					this.getView().byId("idGYr").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.IRDY);
					this.getView().byId("idGRReas").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.IRR);
					this.getView().byId("idGRRDt").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.IRDt);
				}
			} else if (null != this.key || "" != this.key) {
				this.getView().byId("idGCC").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.OCC);
				this.getView().byId("idGFY").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.OFY);
				this.getView().byId("idGSW").setState(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.OSwitch);
				if (this.key != "10") {
					this.getView().byId("idGPO1").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.OPDT1);
					this.getView().byId("idGPO2").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.OPDT2);
					this.getView().byId("idGPPer").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.OPP1);
					this.getView().byId("idGPPTo").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.OPP2);
					this.getView().byId("idGLAN1").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.OLAN1);
					this.getView().byId("idGLAN2").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.OLAN2);
				} else if (this.key == "10") {
					this.getView().byId("idGPDOC").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.SLPDT);
					this.getView().byId("idGPostPer").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal
						.SLPP);
					this.getView().byId("idGLAN").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.SLLAN);
					this.getView().byId("idGSLAN").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.SLSLAN);
					this.getView().byId("idGNIA").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.SLNIA);
				}
				if (this.key == "4") {
					this.getView().byId("idAccRejRevPost").setState(this.oVariantSetFT._getVariantSet().variants[
						selectedVariant].variantData.FiltersVal.ORevSwitch);
					if (this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData.FiltersVal.ORevSwitch) {
						this.getView().byId("idGRR").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant]
							.variantData.FiltersVal.OReveReason);
						this.getView().byId("idGRRDT").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant]
							.variantData.FiltersVal.ORevePosDt);
					}
				} else if (this.key == "5") {
					this.getView().byId("idGMV").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData
						.FiltersVal.OMarkValue);
				} else if (this.key == "6") {
					this.getView().byId("idGDBA").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData
						.FiltersVal.ODBB);
					this.getView().byId("idGAN").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData
						.FiltersVal.OANum);
					this.getView().byId("idGASN").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData
						.FiltersVal.OASNum);
				} else if (this.key == "7") {
					this.getView().byId("idGPen").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData
						.FiltersVal.OPen);
				} else if (this.key == "9") {
					this.getView().byId("idGPDT").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData
						.FiltersVal.OPDT);
					this.getView().byId("idGDP").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData
						.FiltersVal.OPDate);
					this.getView().byId("idGDT").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData
						.FiltersVal.ODDt);
					this.getView().byId("idGGI").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData
						.FiltersVal.OGLI);
					this.getView().byId("idGRef").setValue(this.oVariantSetFT._getVariantSet().variants[selectedVariant].variantData
						.FiltersVal.ORef);
				}
			}
			this.handleFormVisible();
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.lti.LeaseManagement.leaseposting.view.PostView
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.lti.LeaseManagement.leaseposting.view.PostView
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.lti.LeaseManagement.leaseposting.view.PostView
		 */
		//	onExit: function() {
		//
		//	}

	});

});