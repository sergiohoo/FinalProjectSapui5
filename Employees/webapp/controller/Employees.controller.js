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

                // Modelo del empleado que se está viendo
                var oView = this.getView();
                var SapId = this.getOwnerComponent().SapId;
                var oJSONCurrentEmployee = new sap.ui.model.json.JSONModel({
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: 0,
                    Type: '',
                    FirstName: '',
                    LastName: '',
                    Dni: '',
                    AnnualSalary: 0,
                    DailyPrice: 0,
                    CreationDate: null,
                    Comments: ''
                });
                oView.setModel(oJSONCurrentEmployee, "currEmply");

                oView.attachAfterRendering(function() {
                    var sValue1 = SapId;
                    var sPath = "SapId";
                    var sOperator = "EQ";

                    var oBinding = this.byId("listEmployees").getBinding("items");
                    oBinding.filter([new sap.ui.model.Filter(sPath, sOperator, sValue1)]);
                });

                // var oFilter = new sap.ui.model.Filter("SapId", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().SapId);

                // oView.byId("listEmployees").bindItems("odataEmployees>/Users",oFilter);
                // var items = {path:'odataEmployees>/Users', filters:[{path:'SapId',operator:'EQ',value1:this.getOwnerComponent().SapId}]};
                // listEmployees.items= items;
			}
		});
	});