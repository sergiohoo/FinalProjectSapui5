sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * Controlador de la
     * vista para ver los empleados
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
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

                var detailView = this.getView().byId("employeeDetailsView");
                detailView.bindElement("odataEmployees>" + path);

                console.log(path);
            }
		});
	});