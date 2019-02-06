/* prendre le  chargement des contenus  en compte 
 * prendre les liens en compte
 *  */
define(["Kimo/core", "OpenNote.models"], function(Kimo, Models) {
    Kimo.ActivityManager.createActivity("EditActivity", {
        appname: "OpenNote",
        initView: function() {
            var viewInfos = {
                name: "readlist-form-view",
                title: "Form view",
                contentEl: $("#edit-book-tpl").html()
            };
            this.setContentView(viewInfos);
        },
        
        // switch to directive
        events: {
            ".nv-btn.show-form click": "showEditForm",
            ".nv-btn.show-list click": "openMyCard",
            ".nv-btn.show-home click": "goToHome",
            ".refTypeField change": "handleRefType"
        },
        
        /* must have a reference to the current application */
        onCreate: function(params) {
            this.repository = Models.bookRepository;
            this.documentForm = OpenNote.forms.bookForm;
            this.bindEvents();
        },
        
        onStop: function() {
            
        },
        
        onResume: function(params) {
           
        },
        
        populateFromExportAction : function() {},
        
        createAction: function(linkParam, appParam){
            var data = (appParam && appParam.data ) ? appParam.data.volumeInfo : false;
            
            if ($.isPlainObject(data)) {
                data.pages = data.pageCount;
                data.author = data.authors;
                data.tags = data.categories.join(",");
            }
           
            try {
                var documentItem =  new Models.DocumentItem(data);
                this._renderForm(documentItem);
            } catch(e) {
                console.log("error while created document");
            }
        },

        /**** Actions check if user has the right to edit a document ****/
        // use décorator that will be called before the action
        editAction: function(contentId, content) {
            var self = this;
            try{
                if (contentId) {
                    this.currentContentId = contentId
                    var dataPromise = this.repository.findById(contentId);
                    dataPromise.done(function(documentItem) {
                        console.log("caliente:::", documentItem)
                        self._renderForm(documentItem); 
                    });
                }
            }catch(e){
                console.log("error while edit this content");
            }
        },
        
        _renderForm: function(entity) {
            //we set only the fields that are editable
            this.documentForm.setData(entity.getFields());
            this.documentForm.setValidator(function(formData) {
                var hasError = 0;
                for (var key in formData) {
                    var value = formData[key];
                    if ($.trim(value) === "") {
                        hasError ++;
                    }
                    if(key == "subtitle" && hasError > 0) {
                        hasError --;
                    }
                }
                return !hasError;
            });
            var container = $('<div class="documentItem Container" />');
            this.documentForm.render(container);
            $(this.view.view).find("#form-ctn").html($(container));
        },

        bindEvents: function() {
            var self = this;
            var promise;
            this.documentForm.on("submit", function(event) {
                var mainDocumentItem = event.data.entity;

                // fix why isNew
                if (typeof mainDocumentItem.isNew != "function") {
                    //strange but we have to handle the id
                    mainDocumentItem.id = self.currentContentId 
                    mainDocumentItem = new Models.DocumentItem({ fields: mainDocumentItem });
                }
                if (mainDocumentItem.isNew()) {
                    promise = self.repository.add(mainDocumentItem, true);
                } else {
                    /* update here ---> but it should be done automagically */
                    console.log("icic:: update case")
                    mainDocumentItem.set('fields', event.data.rawData);
                    promise = self.repository.update(mainDocumentItem);
                }
                
                promise.done(function() {
                    self.navigateTo("home:home", {
                        reposity: self.repository
                    });
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

