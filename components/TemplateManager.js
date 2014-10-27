define([], function(){
    
    return  TemplateManager = {
        error: "",
        
        render: function (path, params) {
            var deferred = new $.Deferred();
            var self = this;
            var placeHolder = params.placeHolder || $("<div>Loading...</div>");
            
            require(["text!" + path], function(tpl){
                if(typeof params.dataLoader=="function"){
                    params.dataLoader().done(function(data){
                        params.data = data;
                        self.renderer(tpl, placeHolder, params);
                    });
                }else{
                    self.renderer(tpl, placeHolder, params);
                }
            }, function(){
                self.errorRenderer();
            });
            return placeHolder;
        },
        
        renderer: function(tpl, placeHolder, params){
            var html = Mustache.render(tpl, params.data);
            var action = params.renderAction || "html";
            $(placeHolder)[action](html);
        },
        
        errorRenderer: function(placeHolder){
            $(placeHolder).html("<p>Error while loadind the template...</p>");
        }
    }    
});