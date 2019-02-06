var OpenNote = OpenNote || {};

Kimo.require.config({
    paths:{
        "OpenNote.route": "apps/opennote/routes",
        "OpenNote.forms": "apps/opennote/forms",
        "OpenNote.models": "apps/opennote/models",
        "OpenNote.ContentTypePluginMng": "apps/opennote/components/ContentTypeManager",
        "OpenNote.ContentTypes": "apps/opennote/contenttypes/contenttype",
        "OpenNote.TemplateManager": "apps/opennote/components/TemplateManager"
    }
});

define("OpenNote",
    [
        "Kimo/core",
        "OpenNote.route",
        "OpenNote.forms",
        "OpenNote.models",
        "OpenNote.ContentTypes",
        "OpenNote.TemplateManager"
    ], function(Kimo) {
        Kimo.ApplicationManager.create("OpenNote", {
            _settings: {
                mainViewContainer: "#app-opennote-wrapper",
                mainActivity: "HomeActivity",
                route: "home:home",
                viewSettings: {
                    id: "opennote-app",
                    cls: "opennote",
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
                $(".mainWrapper").css({ border: "1px solid red" })
                $(".mainWrapper").on("click", "#searhBtn", function(e) {
                    var searchValue = $("#searhField").val();
                    var container = $("#searchFieldWrapper");
                   /* Kimo.ActivityManager.invoke("OpenNote:SearchEngineActivity", {
                        method: "showSearchResult", 
                        params: [searchValue, container]
                    });*/
                });

               /* Kimo.Utils.makeRestRequest(appPath+"webservices/members/current").done(function(response){
                    $(".current-user").text(response.result.completeName);
                });*/

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
        console.log("error", e);
    });
