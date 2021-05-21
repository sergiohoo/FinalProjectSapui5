sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox"
	],
	/**
     * Controlador de la
     * vista para ver los empleados
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.m.MessageBox} MessageBox
     */
	function (Controller, MessageBox) {
		"use strict";

		return Controller.extend("hr.Employees.controller.CreateEmployee", {
			onInit: function () {
                // Crea un json para la visualización de los botones
                var oView = this.getView();
                var oJSONButtonType = new sap.ui.model.json.JSONModel({
                    employeeType0: 'Default',
                    employeeType1: 'Default',
                    employeeType2: 'Default',
                });
                oView.setModel(oJSONButtonType, "jsonButtonType");
            },
            
            // Función que cancela la operación de crear un nuevo empleado
            // y vuelve al launchpad del menú principal
            onCancel: function () {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                MessageBox.confirm(oResourceBundle.getText("confirmCancelCreateEmployee"), {
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("RouteLaunchpad");
                        }
                    }.bind(this)
                });
            },

            // Función que captura el tipo de empleado seleccionado
            onSelectEmployeeType: function (oEvent) {
                // Obtiene el tipo de empleado desde el id del botón
                var sId = oEvent.getSource().sId;
                var employeeType = sId.substr(sId.length - 1)

                // Crea un json con los datos del nuevo empleado
                // Comenzando con el tipo
                var oView = this.getView();
                var oJSONNewEmployee = new sap.ui.model.json.JSONModel({
                    type: employeeType,
                    name: '',
                    lastName: '',
                    dni: '',
                    salary: 0,
                    incorporationDate: null
                });
                oView.setModel(oJSONNewEmployee, "jsonNewEmployee");

                //Destaca el botón del tipo de empleado seleccionado
                oView.getModel("jsonButtonType").setProperty("/employeeType0", "Default");
                oView.getModel("jsonButtonType").setProperty("/employeeType1", "Default");
                oView.getModel("jsonButtonType").setProperty("/employeeType2", "Default");
                oView.getModel("jsonButtonType").setProperty("/employeeType" + employeeType, "Emphasized");

            }
		});
	});