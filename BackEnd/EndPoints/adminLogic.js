/**
 *	File Name:	    adminLogic.js
 *	Project:		Smart-NFC-Application
 *	Orginization:	VastExpanse
 *	Copyright:	    © Copyright 2019 University of Pretoria
 *	Classes:        AppLogic
 *	Related documents:
 *
 *	Update History:
 *	Date		Author		Version		Changes
 *	-----------------------------------------------------------------------------------------
 *	2019/05/19	Duncan		1.0		Original
 *  2019/05/22  Tjaart      1.1     Fixed require filename - sharedLogic.js
 *  2019/06/24  Duncan      2.0     Started functions for demo 3
 *
 *	Functional Description:		 This class is used by our Link Admin Application in order
 *	                            to facilitate all operations needed for the correct operation
 *	                            of the Admin of a company and Link
 *	Error Messages:
 *	Assumptions: 	This file assumes that a there exists a 'sharedLogic' and a 'crudController'
 *                  class.
 *	Constraints: 	None
 */

var SharedLogic = require('./../SharedLogic/sharedLogic.js');
// var demoMode = true;

/**
 * 	Purpose:	This class is to allow the admin application of Link to complete its needed operations
 *	Usage:		The class will be used by having /admin/functionName at the end of the http request where
 *              function name is the function the admin application wants to use
 *	@author:	Duncan Vodden
 *	@version:	1.0
 */
class AdminLogic
{
    /**
     *  Constructor for the class that sets up certain properties as well as instantiate
     *  a new sharedLogic object.
     *
     *  @param req JSON Request sent from the application to the backend system
     *  @param res JSON Response sent back to the application
     */
    constructor(req, res){
        this.req = req;
        this.res = res;
        this.sharedLogic = new SharedLogic(this);
        this.body = "{}";
        this.endpoint = "";
    }

    /**
     *  Function that is called by server.js and extracts the post body, parse it
     *  into json object and validate the api key/ login , sets up the endpoint and
     *  afterwards calls the serve function.
     */
    handle(){
        this.sharedLogic.initialHandle();
    }

    /**
     *  Function to handle the business logic of the class. It is called automatically
     *  once initialHandle() was successful. It calls endServe() in the sharedLogic
     *  class to return the response.
     */
    serve(){
        switch(this.endpoint)
        {
            //Companies
            case "addCompany":
                this.addCompany();  //INTEGRATE
                break;
            case "editCompany":
                this.editCompany(); //INTEGRATE
                break;
            case "deleteCompany":
                this.deleteCompany();//INTEGRATE - DONT DO
                break;
            case "getCompany":
                this.getCompany();//INTEGRATE
                break;
            case "getCompanies":
                this.getCompanies();//INTEGRATE
                break;

            //Buildings
            case "addBuilding":
                this.addBuilding();//INTEGRATE
                break;
            case "editBuilding":
                this.editBuilding();//TODO
                break;
            case "deleteBuilding":
                this.deleteBuilding();//TODO
                break;
            case "getBuilding":
                this.getBuilding();//TODO
                break;
            case "getBuildings":
                this.getBuildings();//TODO
                break;

            //Rooms
            case "addRoom":
                this.addRoom();//TODO
                break;
            case "editRoom":
                this.editRoom();//TODO
                break;
            case "deleteRoom":
                this.deleteRoom();//TODO
                break;
            case "getRoom":
                this.getRoom();//TODO
                break;
            case "getRooms":
                this.getRooms();//TODO
                break;

            //Employees
            case "addEmployee":
                this.addEmployee();//INTEGRATE
                break;
            case "addEmployees":
                this.addEmployees();//TODO
                break;
            case "editEmployee":
                this.editEmployee();//TODO
                break;
            case "deleteEmployee":
                this.deleteEmployee();//TODO
                break;
            case "getEmployee":
                this.getEmployee();//TODO
                break;
            case "getEmployees":
                this.getEmployees();//TODO
                break;

            //password
            case "editPassword":
                this.editPassword();//TODO
                break;

            default:
                this.sharedLogic.endServe(false, "Invalid Endpoint", null);
        }
    }

    /**
     *  Function that is called to create a company, will use SharedLogic's crudController in order to
     *  complete the operation
     *
     *  @param  companyName string The company name
     *  @param  companyWebsite string The website belonging to the company
     *  @param  companyUsername string The username of the company - for login purposes
     *  @param  companyPassword string the password of the company - for login purposes
     *
     *  @return JSON {
     *                  companyId : int The ID of the company being added
     *               }
     */
    addCompany(){
        var message;
        var data = new Object();
        var success;

        //check to see if parameters are present
        var presentParams = false;
        var presentReturn = "";

        if(this.body.companyName === undefined){
            presentParams = true;
            presentReturn += "companyName, ";
        }
        if(this.body.companyWebsite === undefined){
            presentParams = true;
            presentReturn += "companyWebsite, ";
        }
        if(this.body.companyUsername === undefined){
            presentParams = true;
            presentReturn += "companyUsername, ";
        }
        if(this.body.companyPassword === undefined){
            presentParams = true;
            presentReturn += "companyPassword, ";
        }

        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.companyName)){
                invalidParams = true;
                invalidReturn += "companyName, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyWebsite)){
                invalidParams = true;
                invalidReturn += "companyWebsite, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyUsername)){
                invalidParams = true;
                invalidReturn += "companyUsername, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyPassword)){
                invalidParams = true;
                invalidReturn += "companyPassword, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.companyId = 0;
                    message = this.body.companyName + " Added! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    var passwordId = this.sharedLogic.crudController.createPassword(this.body.companyUsername, this.body.companyPassword);

                    if(passwordId.success){

                        var companyId = this.sharedLogic.crudController.createCompany(this.body.companyName, this.body.companyWebsite, passwordId.data.passwordId);

                        if(companyId.success){
                            data.companyId = companyId.data.companyId;
                            message = this.body.companyName + " Added!";
                            success = true;
                        }
                        else{
                            data = null;
                            message = companyId.message;
                            success = false;
                        }
                    }
                    else{
                        data = null;
                        message = passwordId.message;
                        success = false
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);
    }

    /**
     *  Function that is called to edit a companies details
     *  @param companyId
     *  @param companyName
     *  @param companyWebsite
     *  @param companyUsername
     *
     *  @return JSON {
     *                  companyId : int The company ID that has just be edited
     *               }
     */
    editCompany(){
        var message;
        var data = new Object();
        var success;

        //check to see if parameters are present
        var presentParams = false;
        var presentReturn = "";

        if(this.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        if(this.body.companyName === undefined){
            presentParams = true;
            presentReturn += "companyName, ";
        }
        if(this.body.companyWebsite === undefined){
            presentParams = true;
            presentReturn += "companyWebsite, ";
        }
        if(this.body.companyUsername === undefined){
            presentParams = true;
            presentReturn += "companyWebsite, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.companyId) || !this.sharedLogic.validateNumeric(this.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyName)){
                invalidParams = true;
                invalidReturn += "companyName, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyWebsite)){
                invalidParams = true;
                invalidReturn += "companyWebsite, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyUsername)){
                invalidParams = true;
                invalidReturn += "companyUsername, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.companyId = this.body.companyId;
                    message = this.body.companyName + " edited! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Edit Company not integrated yet";
                    data = null;
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);

    }

    /**
     *  This function is used by the Link admin to delete an existing company
     *
     *  @param companyId int The company to be deleted
     *
     *  @return JSON {
     *                  companyId : int The ID of the company just deleted
     *               }
     */
    deleteCompany(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(this.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.companyId) || !this.sharedLogic.validateNumeric(this.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.companyId = this.body.companyId;
                    message = "Deleted! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Delete Company not implemented";
                    data = null;
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);
    }

    /**
     * @param companyId
     *
     * @return JSON {
     *                  //TODO
     *              }
     */
    getCompany(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(this.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.companyId) || !this.sharedLogic.validateNumeric(this.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }

            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.companyName = "Vast Expanse";
                    data.website = "https://github.com/cos301-2019-se/Smart-NFC-Card-Applications";
                    data.companyId = this.body.companyId;
                    data.passwordId = 0;
                    message = "Retrieved "+data.companyName+"! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Get Company not integrated";
                    data = null;
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);
    }

    /**
     * This function will be used by Link admins to get a list of all the registered companies
     *
     * @return Array of JSON {
     *                          //TODO
     *                      }
     */
    getCompanies(){
        var message;
        var success;
        var data = new Object();
        if(this.demoMode){
            //return mock data
            success = false;
            message = "Get Companies body not known";
            data = null;
        }
        else{
            //return data from crudController
            success = false;
            message = "Get Companies not implemented";
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);
    }

    /**
     * This function will be used to create buildings belonging to a specific company
     *
     * @param buildingBranchName string The Name of the branch i.e Link Johannesburg
     * @param buildingLatitude string The latitude of the building being created
     * @param buildingLongitude string The longitude of the building being created
     * @param companyId int The company ID that the building belongs to
     * @param networkSsid string The name of the wifi for guests to connect for
     * @param networkType string The type of the wifi network for guests to connect to
     * @param networkPassword string The password for the wifi network for access to the wifi for guests
     *
     * @return JSON {
     *                  buildingId int The ID of the building
     *              }
     */
    addBuilding(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(this.body.buildingBranchName === undefined){
            presentParams = true;
            presentReturn += "buildingBranchName, ";
        }
        if(this.body.buildingLatitude === undefined){
            presentParams = true;
            presentReturn += "buildingLatitude, ";
        }
        if(this.body.buildingLongitude === undefined){
            presentParams = true;
            presentReturn += "buildingLongitude, ";
        }
        if(this.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        if(this.body.networkSsid === undefined){
            presentParams = true;
            presentReturn += "networkSsid, ";
        }
        if(this.body.networkType === undefined){
            presentParams = true;
            presentReturn += "networkType, ";
        }
        if(this.body.networkPassword === undefined){
            presentParams = true;
            presentReturn += "networkPassword, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingBranchName)){
                invalidParams = true;
                invalidReturn += "buildingBranchName, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingLatitude)){
                invalidParams = true;
                invalidReturn += "buildingLatitude, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingLongitude)){
                invalidParams = true;
                invalidReturn += "buildingLongitude, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyId) || !this.sharedLogic.validateNumeric(this.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.networkSsid)){
                invalidParams = true;
                invalidReturn += "networkSsid, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.networkType)){
                invalidParams = true;
                invalidReturn += "networkType, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.networkPassword)){
                invalidParams = true;
                invalidReturn += "networkPassword, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.buildingId = 0;
                    message = "Building added! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Add Building not integrated";
                    data = null;
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);
    }

    /**
     * This function will be used to update a buildings details
     *
     * @param buildingId int The building ID of the building to be changed
     * @param buildingBranchName string The new name of the branch
     * @param buildingLatitude string The new Latitude of the branch
     * @param buildingLongitude string the new Longitude of the branch
     * @param wifiParamId int The wifi param ID corresponding to the wifi table belonging to that building
     * @param networkSsid string The new network SSID of the building
     * @param networkType string The new Type of the network of the building
     * @param networkPassword string The new Password of the network
     *
     * @return JSON {
     *                  buildingId int The ID of the building being updated
     *              }
     */
    editBuilding(){
        var message;
        var data = new Object();
        var success;

        var presentParams = false;
        var presentReturn = "";

        if(this.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }
        if(this.body.buildingBranchName === undefined){
            presentParams = true;
            presentReturn += "buildingBranchName, ";
        }
        if(this.body.buildingLatitude === undefined){
            presentParams = true;
            presentReturn += "buildingLatitude, ";
        }
        if(this.body.buildingLongitude === undefined){
            presentParams = true;
            presentReturn += "buildingLongitude, ";
        }
        if(this.body.wifiParamId === undefined){
            presentParams = true;
            presentReturn += "wifiParamId, ";
        }
        if(this.body.networkSsid === undefined){
            presentParams = true;
            presentReturn += "networkSsid, ";
        }
        if(this.body.networkType === undefined){
            presentParams = true;
            presentReturn += "networkType, ";
        }
        if(this.body.networkPassword === undefined){
            presentParams = true;
            presentReturn += "networkPassword, ";
        }
        //check if the parameters are valid if parameters are present
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingId) || !this.sharedLogic.validateNumeric(this.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingBranchName)){
                invalidParams = true;
                invalidReturn += "buildingBranchName, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingLatitude)){
                invalidParams = true;
                invalidReturn += "buildingLatitude, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingLongitude)){
                invalidParams = true;
                invalidReturn += "buildingLongitude, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.wifiParamId) || !this.sharedLogic.validateNumeric(this.body.wifiParamId)){
                invalidParams = true;
                invalidReturn += "wifiParamId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.networkSsid)){
                invalidParams = true;
                invalidReturn += "networkSsid, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.networkType)){
                invalidParams = true;
                invalidReturn += "networkType, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.networkPassword)){
                invalidParams = true;
                invalidReturn += "networkPassword, ";
            }
            //if parameters are valid then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.buildingId = this.body.buildingId;
                    message = "Building edited! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController
                    success = false;
                    message = "Edit Building not integrated";
                    data = null;
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);
    }

    deleteBuilding(){}

    getBuilding(){}

    getBuildings(){}

    addRoom(){}

    editRoom(){}

    deleteRoom(){}

    getRoom(){}

    getRooms(){}

    /**
     * Function that is called to create an employee, will use SharedLogic's crudController in order
     * to complete the operation. It will create an Employee belonging to the Company ID passed in through
     * the parameter
     *
     * @param   employeeName string The name of the employee
     * @param   employeeSurname string The surname of the employee
     * @param   employeeTitle string The Title of the employee e.g Mr/Mrs
     * @param   employeeCellphone string The Cellphone number of the employee
     * @param   employeeEmail string The email address of the employee - used for login purposes
     * @param   companyId int The ID of the company to which the employee is being added to
     * @param   buildingId int The building that the employee works at
     * @param   employeePassword string The Password chosen by the employee - for login purposes
     *
     * @return JSON {
     *                  employeeId : int The ID of the employee being added
     *              }
     */
    addEmployee(){
        var data = new Object();
        var message;
        var success;

        //check if parameters are present
        var presentParams = false;
        var presentReturn = "";

        if(this.body.employeeName === undefined){
            presentParams = true;
            presentReturn += "employeeName, ";
        }
        if(this.body.employeeSurname === undefined){
            presentParams = true;
            presentReturn += "employeeSurname, ";
        }
        if(this.body.employeeTitle === undefined){
            presentParams = true;
            presentReturn += "employeeTitle, ";
        }
        if(this.body.employeeCellphone === undefined){
            presentParams = true;
            presentReturn += "employeeCellphone, ";
        }
        if(this.body.employeeEmail === undefined){
            presentParams = true;
            presentReturn += "employeeEmail, ";
        }
        if(this.body.companyId === undefined){
            presentParams = true;
            presentReturn += "companyId, ";
        }
        if(this.body.buildingId === undefined){
            presentParams = true;
            presentReturn += "buildingId, ";
        }
        if(this.body.employeePassword === undefined){
            presentParams = true;
            presentReturn += "employeePassword, ";
        }
        //if parameters are present, validate if correct format
        if(!presentParams){
            var invalidParams = false;
            var invalidReturn = "";
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeName) || !this.sharedLogic.validateAlpha(this.body.employeeName)){
                invalidParams = true;
                invalidReturn += "employeeName, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeSurname) || !this.sharedLogic.validateAlpha(this.body.employeeSurname)){
                invalidParams = true;
                invalidReturn += "employeeSurname, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeTitle)){
                invalidParams = true;
                invalidReturn += "employeeTitle, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeCellphone) || !this.sharedLogic.validateCellphone(this.body.employeeCellphone)){
                invalidParams = true;
                invalidReturn += "employeeCellphone, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeeEmail) || !this.sharedLogic.validateEmail(this.body.employeeEmail)){
                invalidParams = true;
                invalidReturn += "employeeEmail, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.companyId) || !this.sharedLogic.validateNumeric(this.body.companyId)){
                invalidParams = true;
                invalidReturn += "companyId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.buildingId) || !this.sharedLogic.validateNumeric(this.body.buildingId)){
                invalidParams = true;
                invalidReturn += "buildingId, ";
            }
            if(!this.sharedLogic.validateNonEmpty(this.body.employeePassword)){
                invalidParams = true;
                invalidReturn += "employeePassword, ";
            }
            //if valid parameters then execute function
            if(!invalidParams){
                if(this.demoMode){
                    //return mock data
                    data.employeeId = 0;
                    message = "Employee Added! - Mock";
                    success = true;
                }
                else{
                    //return data from crudController

                    var passwordId = this.sharedLogic.crudController.createPassword(this.body.employeeEmail, this.body.employeePassword);

                    if(passwordId.success){

                        var employeeId = this.sharedLogic.crudController.createEmployee(this.body.employeeName, this.body.employeeSurname,
                            this.body.employeeTitle, this.body.employeeCellphone,
                            this.body.employeeEmail, this.body.companyId,
                            passwordId.data.passwordId);

                        if(employeeId.success){
                            data.employeeId = employeeId.data.employeeId;
                            message = "Employee Added!";
                            success = true;
                        }
                        else{
                            data = null;
                            message = employeeId.message;
                            success = false;
                        }
                    }
                    else{
                        data = null;
                        message = passwordId.message;
                        success = false;
                    }
                }
            }
            else{
                success = false;
                message = "Invalid Parameters: "+invalidReturn;
                message = message.slice(0, message.length-2);
                data = null;
            }
        }
        else{
            success = false;
            message = "Missing Parameters: "+presentReturn;
            message = message.slice(0, message.length-2);
            data = null;
        }
        this.sharedLogic.endServe(success, message, data);
    }

    addEmployees(){}

    editEmployee(){}

    deleteEmployee(){}

    getEmployee(){}

    getEmployees(){}

    editPassword(){}

}

module.exports = AdminLogic;