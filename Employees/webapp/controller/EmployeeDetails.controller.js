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

                // Modelo de los archivos adjuntos
                var oView = this.getView();
                var oJSONAttachments = new sap.ui.model.json.JSONModel();
                oView.setModel(oJSONAttachments, "attachmentsModel");
            },

            onPromote: function () {

            },

            onDismiss: function () {
                
            },

            // Formatter para visualizar la fecha con el patrón dd/MM/yyyy
            dateFormat: function (date) {
                if(date) {
                    var pattern = sap.ui.core.format.DateFormat.getDateInstance({pattern : 'dd MMM yyyy'});
                    return pattern.format(date);
                }
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

            // Función que refresca el binding del control Upload
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