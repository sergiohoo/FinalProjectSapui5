sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
	],
	/**
     * Controlador de la
     * vista para ver los empleados
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter 
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
     */
	function (Controller, Filter, FilterOperator) {
		"use strict";

		return Controller.extend("hr.Employees.controller.Employees", {
			onInit: function () {

                // Workaround para agregar el filtro SapId a la lista de empleados
                // Referencia:
                // https://stackoverflow.com/questions/26361334/sapui5-no-options-to-create-dynamic-filters-in-xml-views
                var SapId = this.getOwnerComponent().SapId;
                this.getView().attachAfterRendering(function() {
                    var sValue1 = SapId;
                    var sPath = "SapId";
                    var sOperator = "EQ";

                    var oBinding = this.byId("listEmployees").getBinding("items");
                    oBinding.filter([new sap.ui.model.Filter(sPath, sOperator, sValue1)]);
                });
            },
            
            onSelectEmployee: function (oEvent) {
                
                var path = oEvent.getSource().getBindingContext("odataEmployees").getPath();

                var EmployeeId = parseInt(path.split('\'')[1]);
                var SapId = this.getOwnerComponent().SapId;

                var filters = [];

                var filterEmployee = new sap.ui.model.Filter("EmployeeId", sap.ui.model.FilterOperator.EQ, EmployeeId.toString());
                var filterSapId = new sap.ui.model.Filter("SapId", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().SapId);

                this.getView().getModel("odataEmployees").read("/Attachments", {
                    filters: [filterSapId],
                    success: function (data) {
                        var detailView = this.getView().byId("employeeDetailsView");

                        var attachmentsModel = detailView.getModel("attachmentsModel");
                        attachmentsModel.setData(data);
                        
                        detailView.bindElement("odataEmployees>" + path);

                        // https://answers.sap.com/questions/10897216/filter-across-multiple-columns-on-jsonmodel.html
                        var list = detailView.byId("attachment")
                        var binding = list.getBinding("items");  
                        binding.filter([filterEmployee], "Application");

                    }.bind(this),
                    error: function (e) {

                        var detailView = this.getView().byId("employeeDetailsView");
                        detailView.bindElement("odataEmployees>" + path);

                    }.bind(this)
                });
            }
		});
	});