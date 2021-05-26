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
                // Identifica elementos dentro de la vista
                this._wizard = this.byId("createEmployeeWizard");
                this._oNavContainer = this.byId("wizardNavContainer");
                this._oWizardContentPage = this.byId("wizardContentPage");

                // Crea un json para la visualización de los botones
                // y comportamiento de otros controles
                var oView = this.getView();
                var oJSONControlBehavior = new sap.ui.model.json.JSONModel({
                    showNextButton: false,

                    employeeType0: 'Default',
                    employeeType1: 'Default',
                    employeeType2: 'Default',

                    firstNameState: undefined,
                    lastNameState: undefined,
                    dniState: undefined,
                    incorporationDateState: undefined,
                    
                    annualSalaryVisible: false,
                    dailyPriceVisible: false,

                    sliderMinValue: 0,
                    sliderMaxValue: 0,
                    sliderStep: 1,
                });
                oView.setModel(oJSONControlBehavior, "ctrlBhvr");

                // Crea un json con los datos del nuevo empleado
                var oJSONNewEmployee = new sap.ui.model.json.JSONModel({
                    employeeId: 0,
                    type: '',
                    firstName: '',
                    lastName: '',
                    dni: '',
                    annualSalary: 0,
                    dailyPrice: 0,
                    incorporationDate: null,
                    comments: ''
                });
                oView.setModel(oJSONNewEmployee, "newEmply");
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

            // Función que guarda el empleado y el primer salario
            // con los datos que se insertaron en el wizard
            onSaveEmployee: function () {
                var mEmployee = this.getView().getModel("newEmply");
                var type = mEmployee.getProperty("/type");
                var salaryAmmout = "0";
                if ( type === "0" || type === "2") {
                    salaryAmmout = mEmployee.getProperty("/annualSalary");
                } else if (type === "1") {
                    salaryAmmout = mEmployee.getProperty("/dailyPrice");
                }

                // Obtienen el máximo EmployeeId desde el modelo OData
                this.getView().getModel("odataEmployees").read("/Users",{
                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId)
                    ],
                    success: function (res) {
                        var eId = 0;
                        res.results.forEach(el => {
                            if(parseInt(el.EmployeeId) > eId) {
                                eId = parseInt(el.EmployeeId);
                                this.getView().getModel("newEmply").setProperty("/employeeId",parseInt(el.EmployeeId)+1);
                                //eId = parseInt(el.EmployeeId);
                            }
                        });
                    }.bind(this),
                    error: function (e) {
                        console.log(e.Message);
                    }.bind(this)
                });

                console.log("eId:" + this.getView().getModel("newEmply").getProperty("/employeeId").toString());

                // Crea el cuerpo del usuario que se creará
                // http://erp13.sap4practice.com:9037/sap/opu/odata/sap/ZEMPLOYEES_SRV/Users/?$format=json
                // http://erp13.sap4practice.com:9037/sap/opu/odata/sap/ZEMPLOYEES_SRV/Salaries/?$format=json
                // var bodyEmployee = {
                //     EmployeeId: "001",
                //     SapId: this.getOwnerComponent().SapId,
                //     Type: mEmployee.getProperty("/type"),
                //     FirstName: mEmployee.getProperty("/firstName"),
                //     LastName: mEmployee.getProperty("/lastName"),
                //     Dni: mEmployee.getProperty("/dni"),
                //     CreationDate: mEmployee.getProperty("/incorporationDate"),
                //     Comments: mEmployee.getProperty("/comments"),
                // }
                // this.getView().getModel("odataEmployees").create("/Users", bodyEmployee, {
                //     success: function (resUser) {
                //         var employeeId = resUser.EmployeeId;
                        
                //         var bodySalary = {
                //             SapId: this.getOwnerComponent().SapId,
                //             EmployeeId: employeeId.toString(),
                //             CreationDate: mEmployee.getProperty("/incorporationDate"),
                //             Ammount: salaryAmmout,
                //             Waers: "EUR",
                //             Comments: mEmployee.getProperty("/comments")
                //         }

                //         this.getView().getModel("odataEmployees").create("/Salaries", bodySalary, {
                //             success: function (resSalary) {
                //                 console.log(resSalary);
                //             }.bind(this),
                //             error: function (e) {
                //                 console.log(e.Message);
                //             }.bind(this)

                //         });
                //     }.bind(this),
                //     error: function (e) {

                //     }.bind(this)
                // });
            },

            // Función que oculta el botón "Siguiente" del wizard
            // Se llama en el evento "activate" de cada paso
            _hideNextButton: function () {
                var mCtrlBhv = this.getView().getModel("ctrlBhvr");
                mCtrlBhv.setProperty("/showNextButton", false);
            },

            // Función que muestra el botón "Siguiente" del wizard
            _showNextButton: function () {
                var mCtrlBhv = this.getView().getModel("ctrlBhvr");
                mCtrlBhv.setProperty("/showNextButton", true);
            },

            // Función auxiliar que muestra u oculta el botón "Siguiente"
            // dependiendo del estado de los campos requeridos
            _checkReqFieldsStepTwo: function () {
                var mCtrlBhv = this.getView().getModel("ctrlBhvr");

                var firstNameState = mCtrlBhv.getProperty("/firstNameState");
                var lastNameState = mCtrlBhv.getProperty("/lastNameState");
                var dniState = mCtrlBhv.getProperty("/dniState");
                var incorporationDateState = mCtrlBhv.getProperty("/incorporationDateState");

                if (firstNameState !== "None" ||
                    lastNameState !== "None" ||
                    dniState !== "None" ||
                    incorporationDateState !== "None") {
                        this._hideNextButton();
                    }
                else {
                    this._showNextButton();
                }
            },

            // Función que captura el tipo de empleado seleccionado
            // y actualiza el estado de los botones de tipo
            // y de los sliders de salario del paso siguiente
            onSelectEmployeeType: function (oEvent) {
                // Obtiene el tipo de empleado desde el id del botón
                var sId = oEvent.getSource().sId;
                var employeeType = sId.substr(sId.length - 1)

                // Guarda el tipo de emplado seleccionado en el modelo json
                var mEmployee = this.getView().getModel("newEmply");
                mEmployee.setProperty("/type", employeeType);

                // Destaca el botón del tipo de empleado seleccionado
                var mCtrlBhv = this.getView().getModel("ctrlBhvr");
                mCtrlBhv.setProperty("/employeeType0", "Default");
                mCtrlBhv.setProperty("/employeeType1", "Default");
                mCtrlBhv.setProperty("/employeeType2", "Default");
                mCtrlBhv.setProperty("/employeeType" + employeeType, "Emphasized");

                // Hace visible el botón "Siguiente"
                // Para ir al siguiente paso del wizard
                if(employeeType != "") {
                    mCtrlBhv.setProperty("/showNextButton", true);
                }

                // En función del tipo de empleado seleccionado
                // oculta o muestra los slider de sueldo anual o precio diario
                // y setea los valores para el slider visible
                if (employeeType === "0") {
                    mCtrlBhv.setProperty("/annualSalaryVisible", true);
                    mCtrlBhv.setProperty("/dailyPriceVisible", false);

                    // Setea los valores máximos y mínimos del slider
                    mCtrlBhv.setProperty("/sliderMinValue", 12000);
                    mCtrlBhv.setProperty("/sliderMaxValue", 80000);
                    mCtrlBhv.setProperty("/sliderStep", 1000);
                    
                    // Setea el valor del slider
                    // Usa setValue porque no bastó con binding
                    mEmployee.setProperty("/annualSalary", 24000);
                    this.getView().byId("annualSalary").setValue(24000);

                } else if (employeeType === "1") {
                    mCtrlBhv.setProperty("/annualSalaryVisible", false);
                    mCtrlBhv.setProperty("/dailyPriceVisible", true);

                    // Setea los valores máximos y mínimos del slider
                    mCtrlBhv.setProperty("/sliderMinValue", 100);
                    mCtrlBhv.setProperty("/sliderMaxValue", 2000);
                    mCtrlBhv.setProperty("/sliderStep", 100);

                    // Setea el valor del slider
                    // Usa setValue porque no bastó con binding
                    mEmployee.setProperty("/dailyPrice", 400);
                    this.getView().byId("dailyPrice").setValue(400);

                } else if (employeeType === "2") {
                    mCtrlBhv.setProperty("/annualSalaryVisible", true);
                    mCtrlBhv.setProperty("/dailyPriceVisible", false);

                    // Setea los valores máximos y mínimos del slider
                    mCtrlBhv.setProperty("/sliderMinValue", 50000);
                    mCtrlBhv.setProperty("/sliderMaxValue", 200000);
                    mCtrlBhv.setProperty("/sliderStep", 10000);

                    // Setea el valor del slider
                    // Usa setValue porque no bastó con binding
                    mEmployee.setProperty("/annualSalary", 70000);
                    this.getView().byId("annualSalary").setValue(70000);
                }
            },

            // Función que se ejecuta en el evento change del campo firstName
            // y actualiza su estado
            updateFirstName: function (oEvent) {
                var mCtrlBhv = this.getView().getModel("ctrlBhvr");

                if (!oEvent.getSource().getValue()) {
                    mCtrlBhv.setProperty("/firstNameState", "Error");
                } else {
                    mCtrlBhv.setProperty("/firstNameState", "None");
                }

                mCtrlBhv.refresh(true);

                // Chequea el estado de los campos
                // para mostrar u ocultar el botón "Siguiente" del wizard
                this._checkReqFieldsStepTwo();
            },

            // Función que se ejecuta en el evento change del campo lastName
            // y actualiza su estado
            updateLastName: function (oEvent) {
                var mCtrlBhv = this.getView().getModel("ctrlBhvr");

                if (!oEvent.getSource().getValue()) {
                    mCtrlBhv.setProperty("/lastNameState", "Error");
                } else {
                    mCtrlBhv.setProperty("/lastNameState", "None");
                }

                mCtrlBhv.refresh(true);

                // Chequea el estado de los campos
                // para mostrar u ocultar el botón "Siguiente" del wizard
                this._checkReqFieldsStepTwo();
            },

            // Función que se ejecuta en el evento change del campo dni
            // y actualiza su estado
            updateDNI: function (oEvent) {
                var mCtrlBhv = this.getView().getModel("ctrlBhvr");

                if (!oEvent.getSource().getValue()) {
                    mCtrlBhv.setProperty("/dniState", "Error");
                } else {
                    if(this._checkDNI(oEvent.getSource().getValue())) {
                        mCtrlBhv.setProperty("/dniState", "None");
                    } else {
                        mCtrlBhv.setProperty("/dniState", "Error");
                    }
                }

                mCtrlBhv.refresh(true);

                // Chequea el estado de los campos
                // para mostrar u ocultar el botón "Siguiente" del wizard
                this._checkReqFieldsStepTwo();
            },

            // Comprueba si un DNI español es válido
            // y devuelve true o false si es correcto o no.
            _checkDNI: function (dni) {
                var number;
                var letter;
                var letterList;
                var regularExp = /^\d{8}[a-zA-Z]$/;
                // Se comprueba que el formato es válido
                if (regularExp.test (dni) === true) {
                    // Número
                    number = dni.substr(0,dni.length-1);
                    // Letra
                    letter = dni.substr(dni.length-1,1);
                    number = number % 23;
                    letterList="TRWAGMYFPDXBNJZSQVHLCKET";
                    letterList=letterList.substring(number,number+1);
                    if (letterList !== letter.toUpperCase()) {
                        // Error
                        return false
                    } else {
                        // Correct
                        return true
                }
                }else{
                    // Error
                    return false
                }
            },

            // Función que se ejecuta en el evento change del campo incorporationDate
            // y actualiza su estado
            updateIncorporationDate: function (oEvent) {
                var mCtrlBhv = this.getView().getModel("ctrlBhvr");

                if (!oEvent.getSource().getValue()) {
                    mCtrlBhv.setProperty("/incorporationDateState", "Error");
                } else {
                    if (!oEvent.getSource().isValidValue()) {
                        mCtrlBhv.setProperty("/incorporationDateState", "Error");
                    } else {
                        mCtrlBhv.setProperty("/incorporationDateState", "None");
                    }
                }

                mCtrlBhv.refresh(true);

                // Chequea el estado de los campos
                // para mostrar u ocultar el botón "Siguiente" del wizard
                this._checkReqFieldsStepTwo();
            },


            // Como referencia, las siguientes 6 funciones fueron tomadas de:
            // https://sapui5.hana.ondemand.com/#/entity/sap.m.Wizard/sample/sap.m.sample.Wizard/code/view/Wizard.view.xml


            // Función que se ejecuta al completar el wizard
            // y presioanr el botón "Revisar"
            // redirecciona al resumen de los datos ingresados
            wizardCompletedHandler: function () {
			    this._oNavContainer.to(this.byId("wizardReviewPage"));
            },

            // Función que se ejecuta al final después de presionar "Edit"
            // en alguno de los pasos del resumen
            // para retornar al wizard
            backToWizardContent: function () {
			    this._oNavContainer.backToPage(this._oWizardContentPage.getId());
		    },
            
            // Función que va de regreso al paso 1 del wizard
            // desde el resumen
            editStepOne: function () {
                this._handleNavigationToStep(0);
            },

            // Función que va de regreso al paso 2 del wizard
            // desde el resumen
            editStepTwo: function () {
                this._handleNavigationToStep(1);
            },

            // Función que va de regreso al paso 3 del wizard
            // desde el resumen
            editStepThree: function () {
                this._handleNavigationToStep(2);
            },

            // Función auxiliar para volver al wizard
            _handleNavigationToStep: function (iStepNumber) {
                var fnAfterNavigate = function () {
                    this._wizard.goToStep(this._wizard.getSteps()[iStepNumber]);
                    this._oNavContainer.detachAfterNavigate(fnAfterNavigate);
                }.bind(this);

                this._oNavContainer.attachAfterNavigate(fnAfterNavigate);
                this.backToWizardContent();
            },

        });
    });