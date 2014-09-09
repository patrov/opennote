/* prendre le  chargement des contenus  en compte 
 * prendre les liens en compte
 *  */
define(["Kimo/core", "ReadList.models"], function(Kimo, Models) {
    Kimo.ActivityManager.createActivity("EditActivity", {
        appname: "ReadList",
        initView: function() {
            var a = {
                name: "readlist-form-view",
                title: "Form view",
                contentEl: $("#edit-book-tpl").html()
            };
            this.setContentView(a);
        },
        
        events: {
            ".nv-btn.show-form click": "showEditForm",
            ".nv-btn.show-list click": "openMyCard",
            ".nv-btn.show-home click": "goToHome",
            ".refTypeField change": "handleRefType"
        },
        
        /* must have a reference to application */
        onCreate: function(params) {
            this.repository = Models.bookRepository;
            this.documentForm = ReadList.forms.bookForm;
            this.bindEvents();
        },
        
        onStop: function(){
            
        },
        
        onResume: function(params) {
           
        },
        
        populateFromExportAction:function(){},
        
        createAction: function(){
            try{
                var documentItem =  new Models.DocumentItem();
                this._renderForm(documentItem);
            }catch(e){
                console.log("error while create next document");
            }
        },
        /**** Actions check if user has the right to edit a document ****/
        editAction: function(contentId,content){
            var self = this;
            try{
                if(contentId){
                    var dataPromise = this.repository.findById(contentId);
                    dataPromise.done(function(documentItem){
                        self._renderForm(documentItem); 
                    });
                }
            }catch(e){
                console.log("error while edit this content");
            }
        },
        
        _renderForm: function(entity) {
            this.documentForm.setData(entity);
            this.documentForm.setValidator(function(formData) {
                var hasError = 0;
                for (var key in formData) {
                    var value = formData[key];
                    if ($.trim(value) === "") {
                        hasError++;
                    }
                    if(key=="subtitle" && hasError > 0){
                        hasError--;
                    }
                }
                return !hasError;
            });
            this.repository = ReadList.models.bookRepository;
            var container = $('<div class="documentItem Container" />');
            this.documentForm.render(container);
            $(this.view.view).find("#form-ctn").append($(container));
        },
        bindEvents: function() {
            var self = this;
            var promise;
            this.documentForm.on("submit", function(event) {
                var toReadItem = event.data.entity;
                //fix why isNew
                if (typeof toReadItem.isNew != "function") {
                    toReadItem = new Models.DocumentItem(toReadItem.data);
                }
                if (toReadItem.isNew()) {
                    promise = self.repository.add(toReadItem, true);
                    console.log("promise:add", promise);
                } else {
                    /* update here ---> but it should be done automagically */
                    toReadItem.set(event.data.rawData);
                    promise = self.repository.update(toReadItem);
                    console.log("promise:update", promise);
                }
                promise.done(function() {
                    console.log("I'm here my content is saved");
                });


                /*Replace navigateTo with a router*/
                self.navigateTo("home:home", {
                    reposity: self.repository
                });
            });

            this.documentForm.on("error", function(e) {
                console.log(e);
            });


            this.documentForm.on("cancel", function() {
                self.navigateTo("home:home");
            });
        }
       
    });

});

