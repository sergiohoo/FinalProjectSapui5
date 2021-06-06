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

            onAfterRendering: function () {
                //Bind files
                if(this.getView().getModel("odataEmployees")) {
                    var employeeId = this.getView().getModel("odataEmployees").getProperty("/EmployeeId").toString();
                    this.byId("uploadCollection").bindAggregation("items", {
                        path: "odataEmployees>/Attachments",
                        filters: [
                            new Filter("SapId", FilterOperator.EQ, this.getOwnerComponent().SapId),
                            new Filter("EmployeeId", FilterOperator.EQ, employeeId),
                        ],
                        template: new sap.m.UploadCollectionItem({
                            documentId: "{odataEmployees>Attachments>/AttId}",
                            visibleEdit: false,
                            fileName: "{odataEmployees>Attachments>/DocName}"
                        }).attachPress(this.downloadFile)
                    });
                }
            },

            onPromote: function () {

            },

            onDismiss: function () {
                
            },

            // Formatter para visualizar la fecha con el patrón dd/MM/yyyy
            dateFormat: function (date) {
                var pattern = sap.ui.core.format.DateFormat.getDateInstance({pattern : 'dd MMM yyyy'});
                return pattern.format(date);
            },

            // Función que crea el slug y lo agrega al UploadCollection
            onFileBeforeUpload: function (oEvent) {
                var mEmployee = this.getView().getModel("odataEmployees");
                let fileName = oEvent.getParameter("fileName");
                // @ts-ignore
                let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: this.getOwnerComponent().SapId + ";" + 
                        mEmployee.getProperty("/EmployeeId").toString() + ";" + fileName
                });
                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            },

            // Función que obtiene el token desde el modelo OData
            // para subir el fichero
            onFileChange: function (oEvent) {
                let oUplodCollection = oEvent.getSource();
                // Header Token CSRF - Cross-site request forgery
                // @ts-ignore
                let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                    name: "x-csrf-token",
                    value: this.getView().getModel("odataEmployees").getSecurityToken()
                });
                oUplodCollection.addHeaderParameter(oCustomerHeaderToken);
            },

            onFileUploadComplete: function (oEvent) {
                oEvent.getSource().getBinding("items").refresh();
            },

            onFileDeleted: function (oEvent) {
                var oUploadCollection = oEvent.getSource();
                var sPath = oEvent.getParameter("item").getBindingContext("odataEmployees").getPath();
                this.getView().getModel("odataEmployees").remove(sPath, {
                    success: function () {
                        oUploadCollection.getBinding("items").refresh();
                    },
                    error: function () {

                    }
                });
            },

            downloadFile : function(oEvent) {
                const sPath = oEvent.getSource().getBindingContext("odataEmployees").getPath();
                window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV/Attachments" + sPath + "/$value");
            }
		});
	});