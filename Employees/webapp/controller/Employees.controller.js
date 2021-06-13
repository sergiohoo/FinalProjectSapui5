sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/ui/core/routing/History",
	],
	/**
     * Controlador de la
     * vista para ver los empleados
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter 
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
     * @param {typeof sap.ui.core.routing.History} History 
     */
	function (Controller, Filter, FilterOperator, History) {
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

            // Función que vuelve a la vista anterior
            onBack: function (oEvent) {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined) {
                    window.history.go(-1);
                } else {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteLaunchpad", true);
                }
            },

            // Función que se ejecuta al seleccionar un empleado en el listado
            // Aplica el binding context a la vista de detalles
            // y al elemento UploadCollection de la vista
            onSelectEmployee: function (oEvent) {
                
                var path = oEvent.getSource().getBindingContext("odataEmployees").getPath();

                // Aplica el binding conext a la vista de detalles según el path seleccionado de la lista
                var detailView = this.getView().byId("employeeDetailsView");
                detailView.bindElement("odataEmployees>" + path);

                // Obtiene el EmployeeId y SapId del empleado que se está visualizando
                var EmployeeId = parseInt(path.split('\'')[1]).toString().padStart(3,'0');
                var SapId = this.getOwnerComponent().SapId;

                // Carga los valores de EmployeeId y SapId en el modelo de Nuevo Salario
                var mNewSalary = detailView.getModel("jsonNewSalary");
                mNewSalary.setProperty("/EmployeeId",EmployeeId);
                mNewSalary.setProperty("/SapId",SapId);

                // Crea filtros a partir del path
                var filters = [];
                var filterEmployee = new sap.ui.model.Filter("EmployeeId", sap.ui.model.FilterOperator.EQ, EmployeeId);
                var filterSapId = new sap.ui.model.Filter("SapId", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().SapId);

                // Obtiene y carga los attachments del empleado
                this.getView().getModel("odataEmployees").read("/Attachments", {
                    // Aplica el filtro de SapId
                    // Por alguna razón desconocida, no permite aplicar ambos filtros a la vez,
                    // por eso el siguiente filtro se aplica al UploadCollection después del binding.
                    filters: [filterSapId],
                    success: function (data) {
                        
                        var detailView = this.getView().byId("employeeDetailsView");

                        // Actualiza los datos del modelo attachments de la vista de detalles
                        // que es el origen de los datos de los items de UploadCollection
                        var attachmentsModel = detailView.getModel("attachmentsModel");
                        attachmentsModel.setData(data);

                        // Filtra los ítemes del UploadCollection por EmployeeId
                        // Referencia:
                        // https://answers.sap.com/questions/10897216/filter-across-multiple-columns-on-jsonmodel.html
                        var list = detailView.byId("attachment")
                        var binding = list.getBinding("items");  
                        binding.filter([filterEmployee], "Application");

                    }.bind(this),
                    error: function (e) {

                    }.bind(this)
                });

                // Obtiene y carga los salarios del empleado
                this.getView().getModel("odataEmployees").read("/Salaries", {
                    // Aplica el filtro de SapId
                    // Por alguna razón desconocida, no permite aplicar ambos filtros a la vez,
                    // por eso el siguiente filtro se aplica al UploadCollection después del binding.
                    filters: [filterSapId],
                    success: function (data) {
                        
                        var detailView = this.getView().byId("employeeDetailsView");

                        // Actualiza los datos del modelo attachments de la vista de detalles
                        // que es el origen de los datos de los items de Timeline
                        var timelineModel = detailView.getModel("timelineModel");
                        timelineModel.setData(data);

                        // Filtra los ítemes del Timeline por EmployeeId
                        // Referencia:
                        // https://answers.sap.com/questions/10897216/filter-across-multiple-columns-on-jsonmodel.html
                        var list = detailView.byId("timeline")
                        var binding = list.getBinding("content");  
                        binding.filter([filterEmployee], "Application");
                    }.bind(this),
                    error: function (e) {

                    }.bind(this)
                });
            }
		});
	});