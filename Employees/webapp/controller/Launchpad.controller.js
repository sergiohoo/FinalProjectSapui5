sap.ui.define([
		"sap/ui/core/mvc/Controller"
    ],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
        "use strict";

		return Controller.extend("hr.Employees.controller.Launchpad", {
			onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            },
            
            // Funciones de navegación desde el Launchpad
            
            //  Employees
            toEmployees: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteEmployees");
            },
            
            // A CreateEmployees
            toCreateEmployee: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteCreateEmployee");
            },

            // A Orders
            toOrders: function () {
                window.open("https://e0390685trial-dev-logali-approuter.cfapps.eu10.hana.ondemand.com/logaligroupEmployees/index.html","_blank");
            }
		});
	});
