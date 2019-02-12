import { Injectable } from '@angular/core';
import { serviceUrls } from '../../../common/serviceUrl';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
	providedIn: 'root'
})
export class CommonCallService {

	constructor(private http: HttpClient) { }

	// AddEmployee(body) {
	// 	return this.http.post(serviceUrls.AddEmployee, body)
	// }
	GetRoles() {
		return this.http.get(serviceUrls.GetRoles)
	}
	GetDepartment() {
		return this.http.get(serviceUrls.GetDepartment)
	}
	GetDesignation() {
		return this.http.get(serviceUrls.GetDesignation)
	}
	GetEmployees(body) {
		return this.http.post(serviceUrls.GetEmployees,body)
	}
	UpdateEmployee(body) {
		return this.http.post(serviceUrls.UpdateEmployee, body)
	}
	GetSbu() {
		return this.http.get(serviceUrls.GetSbu)
	}
	GetClientList() {
		return this.http.get(serviceUrls.GetClientList)
	}
	DeleteEmployee(body) {
		return this.http.post(serviceUrls.DeleteEmployee, body)
	}
	// GetCategory() {
	// 	return this.http.get(serviceUrls.GetCategory)
	// }
	GetCity() {
		return this.http.get(serviceUrls.GetCity)
	}
	GetTypeofspace() {
		return this.http.get(serviceUrls.GetTypeofspace)
	}
	GetIndustry() {
		return this.http.get(serviceUrls.GetIndustry)
	}
	AddClient(body) {
		return this.http.post(serviceUrls.AddClient, body)
	}
	GetDataForEdit(body) {
		return this.http.post(serviceUrls.GetClientbyId, body)
	}
	UpdateClient(body) {
		return this.http.post(serviceUrls.UpdateClient, body)
	}
	DeleteClient(body) {
		return this.http.post(serviceUrls.DeleteClient, body)
	}
	SaveAndUpdateCategory(body) {
		return this.http.post(serviceUrls.SaveAndUpdateCategory, body)
	}
	SaveProduct(body) {
		return this.http.post(serviceUrls.SaveProduct, body)
	}
	GetProducts(body) {
		return this.http.post(serviceUrls.GetProducts,body)
	}
	DeleteProduct(body) {
		return this.http.post(serviceUrls.DeleteProduct, body)
	}
	GetCategoryListing() {
		return this.http.get(serviceUrls.GetCategoryListing)
	}
	GetCategoryById(body) {
		return this.http.post(serviceUrls.GetCategoryById, body)
	}
	DeleteCategory(body) {
		return this.http.post(serviceUrls.DeleteCategory, body)
	}
	GetBOQListing(data) {
		return this.http.post(serviceUrls.GetBOQListing,data);
	}
	DeleteBOQ(body) {
		return this.http.post(serviceUrls.DeleteBOQ, body)
	}
	GetBOQTypes() {
		return this.http.get(serviceUrls.GetBOQTypes)
	}
	GetCountry() {
		return this.http.get(serviceUrls.GetCountryList)
	}
	AddVendor(body) {
		return this.http.post(serviceUrls.AddVendor, body)
	}
	AddParameter(body) {
		return this.http.post(serviceUrls.AddParameter, body)
	}
	GetEmployeesWithId(body) {
		return this.http.post(serviceUrls.GetEmployeesWithId, body)
	}
	GetVendorList() {
		return this.http.get(serviceUrls.GetVendorList)
	}
	GetVendorDataForEdit(body) {
		return this.http.post(serviceUrls.GetVendorbyId, body)
	}
	GetSubCategory(body) {
		return this.http.post(serviceUrls.GetSubCategory, body)
	}
	GetParameters(body) {
		return this.http.post(serviceUrls.GetParameters, body)
	}
	vendordataById(body) {
		return this.http.post(serviceUrls.GetVendorbyId, body)
	}
	UpdateVendor(body) {
		return this.http.post(serviceUrls.UpdateVendor, body)
	}
	DeleteVendor(body) {
		return this.http.post(serviceUrls.DeleteVendor, body)
	}
	GetStateCity(body) {
		return this.http.post(serviceUrls.GetStateCity, body)
	}
	GetProductById(body) {
		return this.http.post(serviceUrls.GetProductById, body)
	}
	// GetCategorys() {
	// 	return this.http.get(serviceUrls.GetCategorys)
	// }
	GetInputType() {
		return this.http.get(serviceUrls.GetInputType)
	}
	GetUnit() {
		return this.http.get(serviceUrls.GetUnit)
	}
	GetItemListingBySubCatId(body) {
		return this.http.post(serviceUrls.GetItemListingBySubCatId, body)
	}
	GetFunctionality() {
		return this.http.get(serviceUrls.GetFunctionality);
	}
	AddRole(body) {
		return this.http.post(serviceUrls.AddRole, body)
	}
	GetRoleList(body) {
		return this.http.post(serviceUrls.GetRoleList,body)
	}
	roledataById(body) {
		return this.http.post(serviceUrls.roledataById, body)
	}
	UpdateRole(body) {
		return this.http.post(serviceUrls.UpdateRole, body)
	}
	DeleteRole(body) {
		return this.http.post(serviceUrls.DeleteRole, body)
	}
	GetClientsName() {
		return this.http.get(serviceUrls.GetClientsName)
	}
	GetProjectName(body) {
		return this.http.post(serviceUrls.GetProjectName,body)
	}
	GetEmployeeBySbu(body) {
		return this.http.post(serviceUrls.GetEmployeeBySbu, body)
	}
	GetProjectType() {
		return this.http.get(serviceUrls.GetProjectType)
	}
	SaveAndUpdateProject(body) {
		return this.http.post(serviceUrls.SaveAndUpdateProject, body)
	}
	GetBOQById(body) {
		return this.http.post(serviceUrls.GetBOQById, body)
	}
	GetBOQSpaceListing() {

		return this.http.get(serviceUrls.GetBOQSpaceListing);
	}
	GetSeatingSpaceListing() {

		return this.http.get(serviceUrls.GetSeatingSpaceListing);
	}
	SaveOrUpdateBOQ(body) {

		return this.http.post(serviceUrls.SaveOrUpdateBOQ, body);
	}
	GetPrivileges(body) {
		return this.http.post(serviceUrls.GetPrivileges, body)
	}
	ImportBOQListing(body) {
		return this.http.post(serviceUrls.ImportBOQListing, body);
	}
	GetBOQCategories(body) {
		return this.http.post(serviceUrls.GetBOQCategories, body)
	}
	GetClientSideDesignation(){
		return this.http.get(serviceUrls.GetClientSideDesignation);		
	}
	DeleteProject(body){
		return this.http.post(serviceUrls.DeleteProject, body)
	}
	GetProjectListingById(body){
		return this.http.post(serviceUrls.GetProjectListingById, body)		
	}
	GetProjectListing(body){
		return this.http.post(serviceUrls.GetProjectListing,body);		
	}
	GetProjectCount(body){
		return this.http.post(serviceUrls.GetProjectCount,body);						
	}
	GetFilteredProducts(body){
		return this.http.post(serviceUrls.GetFilteredProducts,body);
	}
	RaiseQuery(body){
		return this.http.post(serviceUrls.RaiseQuery,body);
	}
	SendQueryResponse(body){
		return this.http.post(serviceUrls.SendQueryResponse,body);
	}
	UpdateQueryStatus(body){
		return this.http.post(serviceUrls.UpdateQueryStatus, body);
	}
	BoqDetailsProcCall(body){
		return this.http.post(serviceUrls.BoqDetailsProcCall, body);
	}
	DisplayQueryProcCall(body){
		return this.http.post(serviceUrls.DisplayQueryProcCall,body)
	}
	GeneratePDF(body){
		return this.http.post(serviceUrls.GeneratePDF,body)
	}
	SaveAndUpdateCategoryProcall(body){
		return this.http.post(serviceUrls.SaveAndUpdateCategoryProcall,body);
	}
	getVariantListing(body){
		return this.http.post(serviceUrls.getVariantListing,body);
	}
	getVariantDetails(body){
		return this.http.post(serviceUrls.getVariantDetails,body);
	}
	addParameterProcall(body){
		return this.http.post(serviceUrls.addParameterProcall,body)
	}
	ForgotPassword(body){
		return this.http.post(serviceUrls.ForgotPassword,body)
	}
	GetDashboardTable(body){
		return this.http.post(serviceUrls.GetDashboardTable,body)
	}
	GetBarGraphDetails(){
		return this.http.get(serviceUrls.GetBarGraphDetails);
	}
	saveProjectProcedureCall(body){
		return this.http.post(serviceUrls.saveProjectProcedureCall,body);
	}
	AddVariantToEstimate(body){
		return this.http.post(serviceUrls.AddVariantToEstimate,body);
	}
	GetActiveProjects(body){
		return this.http.post(serviceUrls.GetActiveProjects,body);
	}
	GetBoqByCatIdAndProjectId(body){
		return this.http.post(serviceUrls.GetBoqByCatIdAndProjectId,body);
	}
	SaveAndFinalizeBoqDetails(body){
		return this.http.post(serviceUrls.SaveAndFinalizeBoqDetails,body);
	}
	uploadfile(body){
		return this.http.post(serviceUrls.uploadfile,body);
	}
	
}
