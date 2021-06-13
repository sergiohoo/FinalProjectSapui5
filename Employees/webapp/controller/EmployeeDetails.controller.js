sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        "sap/m/MessageBox"
	],
	/**
     * Controlador de la
     * vista para ver los empleados
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.Filter} Filter 
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator 
     * @param {typeof sap.m.MessageBox} MessageBox
     */
	function (Controller, Filter, FilterOperator, MessageBox) {
		"use strict";

		return Controller.extend("hr.Employees.controller.Employees", {
			onInit: function () {

                // Modelo de los archivos adjuntos
                var oView = this.getView();
                var oJSONAttachments = new sap.ui.model.json.JSONModel();
                oView.setModel(oJSONAttachments, "attachmentsModel");

                // Modelo del timeline
                var oJSONTimeline = new sap.ui.model.json.JSONModel();
                oView.setModel(oJSONTimeline, "timelineModel");

                // Inicializa el modelo para el nuevo salario de ascenso
                // tanto los valores como los estados de los campos
                var oJSONNewSalary = new sap.ui.model.json.JSONModel({
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: null,
                    Ammount: null,
                    CreationDate: null,
                    Comments: '',

                    ammountState: undefined,
                    creationDateState: undefined,
                    commentsState: undefined
                });
                oView.setModel(oJSONNewSalary, "jsonNewSalary");
            },

            // Función que se ejecuta al presionar el botón Ascender que abre el cuadro de diálogo
            onPromote: function () {
                
                // Limpia el formulario del cuadro de diálogo
                var mNewSalary = this.getView().getModel("jsonNewSalary")
                mNewSalary.setProperty("/Ammount",null);
                mNewSalary.setProperty("/CreationDate",null);
                mNewSalary.setProperty("/Comments",null);

                // Si es la primera vez que se abre, lo inicializa desde el fragmento
                if (!this._oPromoteDialog) {
                    this._oPromoteDialog = sap.ui.xmlfragment("hr.Employees.fragment.PromoteDialog", this);
                    this.getView().addDependent(this._oPromoteDialog);
                }

                this._oPromoteDialog.open();
            },

            // Función que se ejecuta al presionar el botón para cerrar el formulario
            onClosePromoteDialog: function () {
                this._oPromoteDialog.close();
            },

            // Función para evitar que se ingresen caracteres no numéricos en el campo salario
            // Referencia:
            // https://answers.sap.com/questions/134304/how-to-make-input-field-accept-only-numeric-values.html
            acceptNumbersOnly: function (oEvent) {
                var _oInput = oEvent.getSource();
                var val = _oInput.getValue();
                val = val.replace(/[^\d]/g, '');
                _oInput.setValue(val);
            },

            // Función que se ejecuta en el evento change del campo Ammount
            // y actualiza su estado
            updateAmmountState: function (oEvent) {
                var mNewSalary = this.getView().getModel("jsonNewSalary");

                if (!oEvent.getSource().getValue()) {
                    mNewSalary.setProperty("/commentsState", "Error");
                } else {
                    mNewSalary.setProperty("/commentsState", "None");
                }

                mNewSalary.refresh(true);
            },
            
            // Función que se ejecuta en el evento change del campo Comments
            // y actualiza su estado
            updateCommentsState: function (oEvent) {
                var mNewSalary = this.getView().getModel("jsonNewSalary");

                if (!oEvent.getSource().getValue()) {
                    mNewSalary.setProperty("/ammountState", "Error");
                } else {
                    mNewSalary.setProperty("/ammountState", "None");
                }

                mNewSalary.refresh(true);
            },

            // Función que se ejecuta en el evento change del campo CreationDate
            // y actualiza su estado
            creationDateState: function (oEvent) {
                var mNewSalary = this.getView().getModel("jsonNewSalary");

                if (!oEvent.getSource().getValue()) {
                    mNewSalary.setProperty("/creationDateState", "Error");
                } else {
                    if (!oEvent.getSource().isValidValue()) {
                        mNewSalary.setProperty("/creationDateState", "Error");
                    } else {
                        mNewSalary.setProperty("/creationDateState", "None");
                    }
                }

                mNewSalary.refresh(true);
            },

            // Función que actualiza el historial de salarios
            updateHistoricalTimeline: function () {
                
                // Obtiene el EmployeeId y SapId del empleado que se está visualizando
                var path = this.getView().getBindingContext("odataEmployees").getPath();

                var EmployeeId = parseInt(path.split('\'')[1]).toString().padStart(3,'0');
                var SapId = this.getOwnerComponent().SapId;

                // Crea filtros a partir del path
                var filters = [];
                var filterEmployee = new sap.ui.model.Filter("EmployeeId", sap.ui.model.FilterOperator.EQ, EmployeeId.toString());
                var filterSapId = new sap.ui.model.Filter("SapId", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().SapId);

                // Obtiene y carga los salarios del empleado
                this.getView().getModel("odataEmployees").read("/Salaries", {
                    // Aplica el filtro de SapId
                    // Por alguna razón desconocida, no permite aplicar ambos filtros a la vez,
                    // por eso el siguiente filtro se aplica al UploadCollection después del binding.
                    filters: [filterSapId],
                    success: function (data) {
                        
                        var detailView = this.getView();

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
            },

            // Función que se ejecuta en el evento press del botón Aceptar
            // del cuadro de diálogo de Ascenso.
            onAcceptPromoteDialog: function () {
                var mNewSalary = this.getView().getModel("jsonNewSalary");

                // Crea el cuerpo del salario que se creará
                // http://erp13.sap4practice.com:9037/sap/opu/odata/sap/ZEMPLOYEES_SRV/Salaries/?$format=json        
                var bodySalary = {
                    SapId: mNewSalary.getProperty("/SapId"),
                    EmployeeId: mNewSalary.getProperty("/EmployeeId"),
                    CreationDate: mNewSalary.getProperty("/CreationDate"),
                    Ammount: mNewSalary.getProperty("/Ammount"),
                    Waers: "EUR",
                    Comments: mNewSalary.getProperty("/Comments")
                }
                // Inserta el salario del usuario en el modelo OData
                this.getView().getModel("odataEmployees").create("/Salaries", bodySalary, {
                    success: function (res) {
                        // Si la respuesta es success, se muestra un mensaje de confirmación
                        var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                        MessageBox.show(
                        oResourceBundle.getText("messageSuccessPromotion"), {
                            icon: MessageBox.Icon.INFORMATION,
                            title: oResourceBundle.getText("titleSuccessPromotion"),
                            actions: [MessageBox.Action.OK],
                            onClose: function (oAction) {
                                // Llama a la función que actualiza el historial
                                this.updateHistoricalTimeline();
                                // Cierra el cuadro de diálogo
                                this._oPromoteDialog.close();
                            }.bind(this)
                        }
                    );
                    }.bind(this),
                    error: function (e) {
                        console.log("error save salary");
                    }.bind(this)

                });
            },

            onDismiss: function () {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                MessageBox.confirm(
                    oResourceBundle.getText("messageConfirmDeletion"), {
                        title: oResourceBundle.getText("titleConfirmDeletion"),
                        onClose: function (oAction) {
                            if(oAction === "OK") {
                                // Obtiene el empleado que se está visualizando
                                var oData = this.getView().getBindingContext("odataEmployees").getObject();
                                var EmployeeId = oData.EmployeeId;
                                var SapId = oData.SapId;

                                var sPath = "/Users(EmployeeId='"+EmployeeId+"',SapId='"+SapId+"')";

                                this.getView().getModel("odataEmployees").remove(sPath, {
                                    success: function () {
                                        // Si la respuesta es success, se muestra un mensaje de confirmación
                                        var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                                        MessageBox.show(
                                        oResourceBundle.getText("messageSuccessDeletion"), {
                                            icon: MessageBox.Icon.INFORMATION,
                                            title: oResourceBundle.getText("titleSuccessDeletion"),
                                            actions: [MessageBox.Action.OK],
                                            onClose: function (oAction) {
                                                // Al cerrar el mensaje, se ve vacío el panel derecho
                                                this.getView().unbindContext("odataEmployees");
                                                this.getView().getModel("odataEmployees").updateBindings();
                                                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                                                oRouter.navTo("RouteEmployees");
                                            }.bind(this)
                                        });
                                    }.bind(this),
                                    error: function () {

                                    }.bind(this)
                                });
                            }
                        }.bind(this)
                    }
                );  
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
                
                var bindingContext = this.getView().getBindingContext("odataEmployees");
                var path = bindingContext.getPath();
                // El EmployeeId viene desde binding context con ceros a la izquierda
                // es por eso que se convierte a entero y luego a string:
                var EmployeeId = parseInt(bindingContext.getModel().getProperty(path).EmployeeId).toString().padStart(3,'0');

                var fileName = oEvent.getParameter("fileName");
                // @ts-ignore
                var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: this.getOwnerComponent().SapId + ";" + 
                        EmployeeId + ";" + fileName
                });
                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            },

            // Función que obtiene el token desde el modelo OData
            // para subir el fichero
            onFileChange: function (oEvent) {
                var oUplodCollection = oEvent.getSource();
                var tokenValue = this.getView().getModel("odataEmployees").getSecurityToken();
                // Header Token CSRF - Cross-site request forgery
                // @ts-ignore
                var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                    name: "x-csrf-token",
                    value: tokenValue
                });
                oUplodCollection.addHeaderParameter(oCustomerHeaderToken);
            },

            // Función que refresca el binding del UploadCollection control
            uploadCollectionSetBinding: function () {
                // Obtiene el EmployeeId y SapId del empleado que se está visualizando
                var path = this.getView().getBindingContext("odataEmployees").getPath();

                var EmployeeId = parseInt(path.split('\'')[1]).toString().padStart(3,'0');
                var SapId = this.getOwnerComponent().SapId;

                // Crea filtros a partir del path
                var filters = [];
                var filterEmployee = new sap.ui.model.Filter("EmployeeId", sap.ui.model.FilterOperator.EQ, EmployeeId.toString());
                var filterSapId = new sap.ui.model.Filter("SapId", sap.ui.model.FilterOperator.EQ, this.getOwnerComponent().SapId);

                // Obtiene los attachments del empleado
                this.getView().getModel("odataEmployees").read("/Attachments", {
                    // Aplica el filtro de SapId
                    // Por alguna razón desconocida, no permite aplicar ambos filtros a la vez,
                    // por eso el siguiente filtro se aplica al UploadCollection después del binding.
                    filters: [filterSapId],
                    success: function (data) {

                        var detailView = this.getView();

                        // Actualiza los datos del modelo attachments de la vista
                        // que es el origen de los datos de los items de UploadCollection
                        var attachmentsModel = this.getView().getModel("attachmentsModel");
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
            },

            onFileUploadComplete: function (oEvent) {

                this.uploadCollectionSetBinding();
                oEvent.getSource().getBinding("items").refresh();
            },

            // Función que se ejecuta al borrar un archivo
            onFileDeleted: function (oEvent) {

                var oUploadCollection = oEvent.getSource();
                
                // Obtiene el contexto, el path y los datos del archivo
                var oContext = oEvent.getParameter("item").getBindingContext("attachmentsModel");
                var sPath = oEvent.getParameter("item").getBindingContext("attachmentsModel").getPath();
                var AttId = oContext.getModel().getProperty(sPath).AttId;
                var EmployeeId = oContext.getModel().getProperty(sPath).EmployeeId;
                var SapId = oContext.getModel().getProperty(sPath).SapId;

                // Crea el path para apuntar al archivo en el modelo OData
                var attachmetsPath = "/Attachments(AttId='"+AttId+"',SapId='"+SapId+"',EmployeeId='"+EmployeeId+"')";

                // Ejecuta la función remove al path en el modelo OData
                this.getView().getModel("odataEmployees").remove(attachmetsPath, {
                    success: function () {
                        this.uploadCollectionSetBinding();
                        oUploadCollection.getBinding("items").refresh();
                    }.bind(this),
                    error: function () {
                        this.uploadCollectionSetBinding();
                        oUploadCollection.getBinding("items").refresh();
                    }.bind(this)
                });
            },
            
            downloadFile : function (oEvent) {

                // Obtiene el contexto, el path y los datos del archivo
                var oContext = oEvent.getSource().getBindingContext("attachmentsModel");
                var sPath = oEvent.getSource().getBindingContext("attachmentsModel").getPath();
                var AttId = oContext.getModel().getProperty(sPath).AttId;
                var EmployeeId = oContext.getModel().getProperty(sPath).EmployeeId
                var SapId = oContext.getModel().getProperty(sPath).SapId

                // Crea el path para apuntar al archivo en el modelo OData
                var attachmetsPath = "(AttId='"+AttId+"',SapId='"+SapId+"',EmployeeId='"+EmployeeId+"')"
                
                window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV/Attachments" + attachmetsPath + "/$value");
            }
		});
	});