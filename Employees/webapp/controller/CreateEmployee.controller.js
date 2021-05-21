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

            },
            
            onCancel: function () {
                let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                MessageBox.confirm(oResourceBundle.getText("confirmCancelCreateEmployee"), {
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                            oRouter.navTo("RouteLaunchpad");
                        }
                    }.bind(this)
                });
            }
		});
	});