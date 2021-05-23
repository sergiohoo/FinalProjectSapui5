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
                // y comportamiento de otros controles
                var oView = this.getView();
                var oJSONControlBehavior = new sap.ui.model.json.JSONModel({
                    employeeType0: 'Default',
                    employeeType1: 'Default',
                    employeeType2: 'Default',

                    firstNameState: "None",
                    lastNameState: "None",
                    dniState: "None",
                    incorporationDateState: "None",
                    
                    annualSalaryVisible: false,
                    dailyPriceVisible: false,

                    sliderMinValue: 0,
                    sliderMaxValue: 0,
                    sliderStep: 1,
                });
                oView.setModel(oJSONControlBehavior, "jsonControlBehavior");

                // Crea un json con los datos del nuevo empleado
                var oJSONNewEmployee = new sap.ui.model.json.JSONModel({
                    type: '0',
                    firstName: '',
                    lastName: '',
                    dni: '',
                    annualSalary: 0,
                    dailyPrice: 0,
                    incorporationDate: null,
                });
                oView.setModel(oJSONNewEmployee, "jsonNewEmployee");
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

                // Guarda el tipo de emplado seleccionado en el modelo json
                var mEmployee = this.getView().getModel("jsonNewEmployee");
                mEmployee.setProperty("/type", employeeType);

                // Destaca el botón del tipo de empleado seleccionado
                var mCtrlBhv = this.getView().getModel("jsonControlBehavior");
                mCtrlBhv.setProperty("/employeeType0", "Default");
                mCtrlBhv.setProperty("/employeeType1", "Default");
                mCtrlBhv.setProperty("/employeeType2", "Default");
                mCtrlBhv.setProperty("/employeeType" + employeeType, "Emphasized");

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
                    this.getView().byId("annualGrossSalary").setValue(24000);

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
                    this.getView().byId("annualGrossSalary").setValue(70000);
                }
            },

            updateFirstName: function (oEvent) {
                var mCtrlBhv = this.getView().getModel("jsonControlBehavior");

                if (!oEvent.getSource().getValue()) {
                    mCtrlBhv.setProperty("/firstNameState", "Error");
                } else {
                    mCtrlBhv.setProperty("/firstNameState", "None");
                }

                mCtrlBhv.refresh(true);
            },

            updateLastName: function (oEvent) {
                var mCtrlBhv = this.getView().getModel("jsonControlBehavior");

                if (!oEvent.getSource().getValue()) {
                    mCtrlBhv.setProperty("/lastNameState", "Error");
                } else {
                    mCtrlBhv.setProperty("/lastNameState", "None");
                }

                mCtrlBhv.refresh(true);
            },

            updateDNI: function (oEvent) {
                var mCtrlBhv = this.getView().getModel("jsonControlBehavior");

                if (!oEvent.getSource().getValue()) {
                    mCtrlBhv.setProperty("/dniState", "Error");
                } else {
                    mCtrlBhv.setProperty("/dniState", "None");
                }

                mCtrlBhv.refresh(true);
            }
        });
    });