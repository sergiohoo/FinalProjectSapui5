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
            },

            onPromote: function () {

            },

            onDismiss: function () {
                
            },

            // Formatter para visualizar la fecha con el patrón dd/MM/yyyy
            dateFormat: function (date) {
                var pattern = sap.ui.core.format.DateFormat.getDateInstance({pattern : 'dd/MM/yyyy'});
                return pattern.format(date);
            }
		});
	});