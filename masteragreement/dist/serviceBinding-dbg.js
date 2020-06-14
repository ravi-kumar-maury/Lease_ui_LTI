function initModel() {
	var sUrl = "/LeaseManagement/catalog/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}