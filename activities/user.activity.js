define(["Kimo/core"], function(Kimo) {
    Kimo.ActivityManager.createActivity("UserActivity", {
        appname:"ReadList",
        initView: function() {
            var rootView = {
                name: "readlist-user-view",
                title: "User view",
                contentEl: $("#user-view-tpl").html()
            };
            this.setContentView(rootView);
        },
        
        invitationsAction: function(){
            $(this.view.view).html($("<p>Invitations page</p>").clone());
        },
        
        accountAction: function(){
            $(this.view.view).html($("<p>AccountPage</p>").clone());
        },
        
        parametersAction: function(){
            $(this.view.view).html($("<p>Parameters Page</p>").clone());
        },
        
        logoutAction: function(){
            var self = this;
            $(this.view.view).html($("<p>Disconnecting...</p>").clone());
            Kimo.Utils.makeRestRequest(appPath+"webservices/members/logout").done(function(){
                document.location.href = appPath;   
            }).fail(function(){
                
            });
        },
        
        onCreate: function() {
        /* do business here */
        },
        
        onResume: function() {
        /* do business here */
        }
        
       
    
    });
});

/*var handleActivitiesRoutes = function(){
    $.routes.each(function(path,action){
        crossroads.addRoute(path,function(){})
    });
}*/