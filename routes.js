
define(["Kimo.NavigationManager"],function(NvgManager){
    NvgManager.registerRoutes("ReadList", { 
    
        "home:home": {
            url:"#/home",
            action:"HomeActivity:showHome"
        },
        
        "contentboard:show": {
            url:"#/content/showboard/{id}",
            action: "ContentEditionActivity:showBoard"
        },
        
        "content:search":{
            url: "#/content/search?q={q}",
            action:"SearchEngineActivity:doSearch"
        },
        
        "content:admin": {
        url: "#/opennote/admin",
        action: ""
        },
        
        "content:edit":{
            url: "#/content/edit/{id}",
            action: "EditActivity:edit"
        },
        
        "content:create":{
            url :"#/content/create",
            action: "EditActivity:create"
        },
        
        "content:import": {
            url: "#/content/import",
            action: "DocumentImportActivity:showForm"
        },
        
        "user:account":{
            url: "#/user/account",
            action: "UserActivity:account"
        },
        
        "user:parameters":{
            url: "#/user/parameters",
            action: "UserActivity:parameters"
        },
        
        "user:invitations":{
            url: "#/user/invitations",
            action: "UserActivity:invitations"
        },
        
        "user:logout":{
            url: "#/user/logout",
            action: "UserActivity:logout"
        },
        
        "export:list": {
            url:"#/export",
            action: "ExportActivity:list"
        },
    
        "export:home": {
            url:"#/export/home",
            action: "ExportActivity:showDel"
        }
    
    });
    
});

