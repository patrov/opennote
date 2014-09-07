define(["Kimo/core"], function(Kimo) {
    Kimo.ActivityManager.createActivity("SearchEngineActivity", {
        appname: "ReadList",
        initView: function() {
            var a = {
                name: "readlist-step-view",
                title: "Steps view",
                contentEl: $("#search-result-wrapper-tpl").html()
            };
            this.setContentView(a);
        },
        events: {
            ".fa-search click": "doSearch"
        },
        onCreate: function() {
            var self = this;
            this.mainContainer = null;

            this.searchView = new Kimo.DataView({
                data: [],
                appendToTop: true,
                selectorCls: "",
                itemCls: "content-item",
                height: "580px",
                itemRenderer: function(item) {
                    console.log("itemRenderer");
                }
            });
            /* switch to form */
            this.form = $('<div class="form-wrapper"><form class="form-search pull-left">'
                    + '<input class="search_field" placeholder="Search" type="search"/>'
                    + '<button type="submit" class="btn"><i class="fa fa-search"></i></button>'
                    + '</form></div>').clone();

            $(this.form).delegate(".btn", "click", function() {
                var term = $(this).prev(".search_field").eq(0).val();
                Kimo.Utils.makeRestRequest("/webservice/contents/search", {
                    data: {
                        q: term,
                        mainContainer: self.mainContainer //localiser // tout la base
                    },
                    "success": function(response) {
                        self.onSearch(response.result);
                    },
                    error: function() {
                        console.log("strangee");
                    }
                })

            });
        },
        getmainContainer: function() {
            return this.mainContainer;
        },
        
        doSearchAction: function(term) {
           makeRequest("ws_data.search", {
                    params: {
                        critetia: term
                    }
                }).done($.proxy(this.handleResult,this));
        },
        
        handleResult: function(response){
             var html = Mustache.render($("#search-result-tpl").html(),response.result);
             $(this.view.view).find(".resultCtn").html(html);
        },
        
        onResume: function() {
        },
        
        public_getSearchEngine: function(mainContainer, onSearch) {
            this.mainContainer = mainContainer;
            this.onSearch = (typeof onSearch == "function") ? onSearch : $.noop;
            return this.form;
        },
        
        public_showSearchResult: function(term, container) {
            this.navigateTo("content:search",{},{'{q}':term});
        },
        


        showSuggestions: function(response) {
            /*show to suggestions contents*/
            // $(".tabContent").hide();
            $(".showsuggestion-btn").trigger("click");
            var suggestions = Mustache.render($("#content-suggestion-tpl").html(), response.result);
            $("#suggestionCtn").html(suggestions);
        },
        public_getSimilarContents: function(content) {
            var self = this;
            $(".showsuggestion-btn").trigger("click");
            $("#suggestionCtn").html($("<p>Loading...</p>").clone());
            Kimo.Utils.makeRestRequest("/webservices/contents/suggest/"+content.getUid()).done($.proxy(self.showSuggestions, self));
        }
    });
});