sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Core",
	"sap/ui/core/library",
	"sap/ui/unified/library",
	"sap/ui/unified/DateTypeRange"
], function (Controller, JSONModel, Core, CoreLibrary, UnifiedLibrary, DateTypeRange) {
	"use strict";

	return Controller.extend("com.lti.LeaseManagement.LeaseSchedule.controller.app", {
		onInit: function () {
				var oVizFrame = this.getView().byId("idcolumn");

			//                2.Create a JSON Model and set the data
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				dateValue: new Date()
			});
			this.getView().setModel(oModel);
			var data = {
				'Leases': [{
					"Model": "FN",
					"Value": "1200000.00",
					"Value2":"298277.50",
					"Value3":"1789665.00"
				}, {
					"Mode2": "OP",
					"Value": "900000.00",
					"Value2":"115051.83",
					"Value3":"690311.00"
			
				}]
			};
			oModel.setData(data);

			//                3. Create Viz dataset to feed to the data to the graph
			var oDataset = new sap.viz.ui5.data.FlattenedDataset({
				dimensions: [{
					name: 'Lease Type',
					value: "{Model}"
				}],

				measures: [{
					name: 'Sum of Payments',
					value: '{Value}'
				},{
					group : 2,
					name: 'Sum of Interest of the Month',
					value: '{Value2}'
				},
				{
					group : 3,
					name: 'Sum of CI Lease Liability',
					value: '{Value3}'
				}],

				data: {
					path: "/Leases"
				}
			});
			oVizFrame.setDataset(oDataset);
			oVizFrame.setModel(oModel);
			oVizFrame.setVizType('column');

			//                4.Set Viz properties
			oVizFrame.setVizProperties({
				plotArea: {
					dataLabel:{
                      showTotal: true
                 },
					colorPalette: d3.scale.category20().range()
				},
				title:{
					visible : "true",
					text : "Total"
				}
			});

			var feedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "valueAxis",
					'type': "Measure",
					'values': ["Sum of Payments","Sum of Interest of the Month","Sum of CI Lease Liability"]
				}),
				feedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
					'uid': "categoryAxis",
					'type': "Dimension",
					'values': ["Lease Type"]
				});
			oVizFrame.addFeed(feedValueAxis);
			oVizFrame.addFeed(feedCategoryAxis);
		},
		onClick: function () {
				this.getOwnerComponent().getRouter().navTo("filter1", {}, true);
			}
	});
});