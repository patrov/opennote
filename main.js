var ReadList = ReadList || {};
Kimo.require.config({
    paths:{
        "ReadList.route": "apps/readlist/routes",
        "ReadList.forms": "apps/readlist/forms",
        "ReadList.models": "apps/readlist/models",
        "ReadList.ContentTypePluginMng": "apps/readlist/components/ContentTypeManager",
        "ReadList.ContentTypes": "apps/readlist/contenttypes/contenttype",
        "ReadList.params.activity": "apps/readlist/activities/params.activity",
        "ReadList.home.activity":"apps/readlist/activities/home.activity",
        "ReadList.edit.activity": "apps/readlist/activities/edit.activity",
        "ReadList.exporter.activity": "apps/readlist/activities/exporter.activity",
        "ReadList.docimporter.activity": "apps/readlist/activities/docimporter.activity",
        "ReadList.contentedition.activity": "apps/readlist/activities/contentedition.activity",
        "ReadList.searchengine.activity": "apps/readlist/activities/searchengine.activity",
        "ReadList.user.activity": "apps/readlist/activities/user.activity",
        "ReadList.admin.activity": "apps/readlist/activities/admin.activity",
        "ReadList.TemplateManager": "apps/readlist/components/TemplateManager"
    }
});

define("ReadList",
    ["Kimo/core","ReadList.route","ReadList.forms","ReadList.models","ReadList.ContentTypes",
    "ReadList.params.activity","ReadList.home.activity","ReadList.edit.activity","ReadList.exporter.activity",
    "ReadList.docimporter.activity", "ReadList.TemplateManager", "ReadList.contentedition.activity","ReadList.searchengine.activity","ReadList.user.activity"
    ], function(Kimo) {
        
        Kimo.ApplicationManager.create("ReadList", {
            _settings: {
                mainViewContainer: "#readList",
                mainActivity: "HomeActivity",
                route: "home:home",
                viewSettings: {
                    id: "readlist-app",
                    cls: "readlist",
                    draggable: false,
                    resizable: true,
                    size: {
                        width: "1024px",
                        height: "750px",
                        responsive: true
                    }
                }
            },
            
            onStart: function() {
                
                $(".mainWrapper").on("click", "#searhBtn", function(e) {
                    var searchValue = $("#searhField").val();
                    var container = $("#searchFieldWrapper");
                    Kimo.ActivityManager.invoke("ReadList:SearchEngineActivity", {
                        method: "showSearchResult", 
                        params: [searchValue, container]
                    });
                });
                Kimo.Utils.makeRestRequest(appPath+"webservices/members/current").done(function(response){
                    $(".current-user").text(response.result.completeName);
                });
                Kimo.ModelManager.useAdapter(Kimo.AdapterRegistry.get("restAdapter"));
            },
            
            onNotification: function(message) {
                /*according to message, call appropriate activity*/
                if (message.topic === "newContent") {
                }
                if (message.topic === "/newTwitter") {
                }
                if (message.topic == "/invitation") {

                }
            },
            onError: function(e) {
                console.log(e);
            }
        });

    },function(e){
        console.log("error",e);
    });
