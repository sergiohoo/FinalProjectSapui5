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
            toEmployees: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteEmployees");
            },
            toCreateEmployee: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteCreateEmployee");
            },
            toOrders: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteOrders");
            }
		});
	});
