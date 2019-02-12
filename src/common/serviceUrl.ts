import { environment } from '../environments/environment';

export const serviceUrls = {
    // Common Services
    Login: environment.commonapihost + 'Login',
    ChangePassword: environment.commonapihost + 'ChangePassword',
    GetRoles: environment.commonapihost + 'GetRoles',
    GetDepartment: environment.commonapihost + 'GetDepartment',
    GetDesignation: environment.commonapihost + 'GetDesignation',
    GetSbu: environment.commonapihost + 'GetSbu',
    GetCategorys: environment.commonapihost + 'GetCategorys',
    GetCity: environment.commonapihost + 'GetCity',
    GetTypeofspace: environment.commonapihost + 'GetTypeofspace',
    GetIndustry: environment.commonapihost + 'GetIndustry',
    GetCountryList: environment.commonapihost + 'GetCountryList',
    GetStateCity: environment.commonapihost + 'GetStateCity',
    GetPrivileges: environment.commonapihost + 'GetPrivileges',
    ForgotPassword: environment.commonapihost  + 'ForgotPassword',
    GetDashboardTable: environment.commonapihost + 'GetDashboardTable',
    GetBarGraphDetails: environment.commonapihost + 'GetBarGraphDetails',
    GetBOQTypes: environment.commonapihost + 'GetBOQTypes',
    GetBOQSpaceListing: environment.commonapihost + 'GetBOQSpaceListing',
    GetSeatingSpaceListing: environment.commonapihost + 'GetSeatingSpaceListing',
    GetClientsName: environment.commonapihost + 'GetClientsName',
    GetProjectName: environment.commonapihost + 'GetProjectName',
    GetEmployeeBySbu: environment.commonapihost + 'GetEmployeeBySbu',
    GetProjectType: environment.commonapihost + 'GetProjectType',
	GetProjectListing: environment.commonapihost + 'GetProjectListing',
	uploadfile: environment.commonapihost + 'uploadfile',
    // Master Services
    
	GetEmployees: environment.mastersapihost + 'GetEmployees',
    UpdateEmployee: environment.mastersapihost + 'UpdateEmployee',
    GetClientList: environment.mastersapihost + 'GetClientList',
    DeleteEmployee: environment.mastersapihost + 'DeleteEmployee',
    AddClient: environment.mastersapihost + 'AddClient',
    GetClientbyId: environment.mastersapihost + 'GetClientbyId',
    UpdateClient: environment.mastersapihost + 'UpdateClient',
    DeleteClient: environment.mastersapihost + 'DeleteClient',
    GetEmployeesWithId: environment.mastersapihost + 'GetEmployeesWithId',
    AddVendor: environment.mastersapihost + 'AddVendor',
    GetVendorList: environment.mastersapihost + 'GetVendorList',
    GetVendorbyId: environment.mastersapihost + 'GetVendorbyId',
    DeleteVendor: environment.mastersapihost + 'DeleteVendor',
    UpdateVendor: environment.mastersapihost + 'UpdateVendor',
    GetFunctionality: environment.mastersapihost + 'GetFunctionality',
    AddRole: environment.mastersapihost + 'AddRole',
    GetRoleList: environment.mastersapihost + 'GetRoleList',
    roledataById: environment.mastersapihost + 'RoledataById',
    UpdateRole: environment.mastersapihost + 'UpdateRole',
    DeleteRole: environment.mastersapihost + 'DeleteRole',

    // Product Services

    GetCategory: environment.productapihost + 'GetCategory',
    SaveAndUpdateCategory: environment.productapihost + 'SaveAndUpdateCategory',
    GetProducts: environment.productapihost + 'GetProducts',
    SaveProduct: environment.productapihost + 'SaveProduct',
    DeleteProduct: environment.productapihost + 'DeleteProduct',
    GetCategoryById: environment.productapihost + 'GetCategoryById',
    GetCategoryListing: environment.productapihost + 'GetCategoryListing',
    GetProductById: environment.productapihost + 'GetProductById',
    GetSubCategory: environment.productapihost + 'GetSubCategory',
    GetParameters: environment.productapihost + 'GetParameters',
    DeleteCategory: environment.productapihost + 'DeleteCategory',
    AddParameter: environment.productapihost + 'AddParameter',
    GetInputType: environment.productapihost + 'GetInputType',
    GetUnit: environment.productapihost + 'GetUnit',
    GetItemListingBySubCatId: environment.productapihost + 'GetItemListingBySubCatId',
    GetStringDropdownUnit: environment.productapihost + 'GetStringDropdownUnit',
    GetFilteredProducts : environment.productapihost + 'GetFilteredProducts',
    SaveAndUpdateCategoryProcall: environment.productapihost + 'SaveAndUpdateCategoryProcall',
    addParameterProcall : environment.productapihost + 'addParameterProcall',

    // Project Services

    GetBOQListing: environment.projectapihost + 'GetBOQListing',
    DeleteBOQ: environment.projectapihost + 'DeleteBOQ',
    SaveOrUpdateBOQ: environment.projectapihost + 'SaveOrUpdateBOQ',
    GetBOQById: environment.projectapihost + 'GetBOQById',
    SaveAndUpdateProject: environment.projectapihost + 'SaveAndUpdateProject',
    ImportBOQListing: environment.projectapihost + 'ImportBOQListing',
    GetBOQCategories: environment.projectapihost + 'GetBOQCategories',
    GetBOQSubCatList: environment.projectapihost + 'GetBOQSubCatList',
    DeleteProject: environment.projectapihost + 'DeleteProject',
    GetProjectListingById: environment.projectapihost + 'GetProjectListingById',
    GetClientSideDesignation: environment.projectapihost + 'GetClientSideDesignation',
    GetProjectCount: environment.projectapihost + 'GetProjectCount',
    RaiseQuery: environment.projectapihost + 'RaiseQuery',
    SendQueryResponse: environment.projectapihost + 'SendQueryResponse',
    UpdateQueryStatus: environment.projectapihost + 'UpdateQueryStatus',
    BoqDetailsProcCall: environment.projectapihost + 'BoqDetailsProcCall',
    DisplayQueryProcCall: environment.projectapihost + 'DisplayQueryProcCall',
    GeneratePDF: environment.projectapihost + 'GeneratePDF',
    getVariantListing: environment.projectapihost + 'getVariantListing',
    getVariantDetails: environment.projectapihost + 'getVariantDetails',
    saveProjectProcedureCall : environment.projectapihost + 'saveProjectProcedureCall',
    AddVariantToEstimate: environment.projectapihost + 'AddVariantToEstimate',
    GetActiveProjects:environment.projectapihost + 'GetActiveProjects',
    GetBoqByCatIdAndProjectId:environment.projectapihost + 'GetBoqByCatIdAndProjectId',
    SaveAndFinalizeBoqDetails:environment.projectapihost + 'SaveAndFinalizeBoqDetails'
};
