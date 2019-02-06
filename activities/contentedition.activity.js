define(["Kimo/core", "vendor.handlebars", "OpenNote.models", "OpenNote.forms", "OpenNote.ContentTypePluginMng"], function(Kimo, Handlebars, M, F, ContentTypePluginManager) {
   
    var ActivityManager = Kimo.ActivityManager;
    Kimo.ActivityManager.createActivity("ContentEditionActivity", {
        appname: "OpenNote",
        initView: function() {
            var a = {
                name: "editcontent-board-view",
                title: "Main content board",
                contentEl: document.createElement('div')
            }
            this.setContentView(a);
        },
        
        events: {
            ".content-type click": "_test"
        },
        
        onStop: function() {
            /* clean everything deal with some sort of cache */
            if (this.contentList) {
                this.contentList.reset();
                this._resetContentScroller();
            }
            //this._toggleEditBoard();
            /* clean edit form */
            this._resizeBoard("content");
        },
        
        onCreate: function(params) {
            this.dataContainer = $(this.view.view).find(".data-view-ctn").eq(0);
            this.repository  = OpenNote.models.bookRepository;
            //ContentTypePluginManager.initPlugins().done($.proxy(this.initContentTypes,this));  
            //this.configure();
        },
        
        initContentTypes: function(){
            var tplParams = ContentTypePluginManager.getAvailableContentConf();
            var template = Handlebars.compile($("#edit-board-tpl").html())
            var editBoard = template(tplParams)
            console.log(this.view.view.get(0).innerHTML)
            $(this.view.view).find(".edit-zone").append($(editBoard));
            this.editSection = $(this.view.view).find(".edit-zone").eq(0);
            this.contentSection = $(this.view.view).find(".data-container").eq(0);
            this.editBoard = $(this.view.view).find("#board-wrapper").eq(0);
            //$(this.editBoard).find(".searchSection").html(searchEngine);
            this.defaultContent = $(this.view.view).find("#main-text-container");
            this.formContainer = $(this.view.view).find("#form-container").eq(0);
            this.contentFormWrapper = $(this.view.view).find("#contents-form-container").eq(0);
            this.actionsContainer = $(this.view.view).find("#actionContainer");
            this.formAction = $($("#formBtn-tpl").html()).clone();
            this.contentItem = $($("#content-tpl").html()).clone();
            this.editBtn = $(this.editBoard).find(".edit-btn").eq(0);
            
        },
        
        configure: function(){    
            /*create content list*/
            this.contentList = this._createContentList();
            this.contentList.render($(this.dataContainer));
            this._bindEvents();
        },
        
        onResume: function(params) {
            
        },
        
        /** Afficher le board */
        showBoardAction : function(routeId, selectedContent) {
            var self = this;
            this.on("viewReady", function(render) {
                if(routeId) {
                    var dataPromise = OpenNote.models.bookRepository.findById(routeId);
                    dataPromise.done(function(entity) {
                        self.configure();
                        self.initContentTypes()
                        self._handleContentChanged(entity);
                    });
                    return;
                }
                console.log("selectedContent", selectedContent)
                if (selectedContent) {
                    this._handleContentChanged(selectedContent);
                }
            })
            
        },
        
        _handleContentChanged: function(currentContent) {
            this.currentContent = currentContent;
            ContentTypePluginManager.setMainContent(currentContent);
            this.currentForm = null;
            this.currentType = null;
            this.nxtAction = null;
            this.editBoardIsVisible = true;
            this.searchMode = false;
            this.templateCache = {};
            if (!this.currentContent)
                throw "CurrentContentNotFound";
            this.currentContent.on("change", $.proxy(this._handleCurrentContentChange, this));
            this._renderCurrentDocument();
            ContentTypePluginManager.initPlugins().done($.proxy(this._populateDataView,this));
        },
        _populateDataView: function() {
            var self = this;
            var promise = this.currentContent.loadContents();
            console.log("", self.contentList)
            self.contentList.showLoadingMsg();
            promise.done(function(response) {
                self.contentList.setData(self.currentContent.getContents(), true);
            });
        },
        /*no need*/
        onSearchResult: function(contents) {
            if (!$.isArray(contents))
                return;
            var counter = 1;
            contents.map(function(content) {
                content._cid = "sr_" + counter;
                counter++;
            });
            this.currentContent.extendsContent(contents, true);
            this.contentList.setData(contents, true); //handle pagination || infinite scroll || handle filter
        },
        editContent: function(data) {
            try {
                this.nxtAction = "update";
                this._initContentType(data.__contentType__); // 1
                /* switch to edit mode */
                $(this.editBtn).trigger("click");
                this._handleForm(data); // 2
            } catch (e) {
                console.log(e);
                throw "ErrorWhileEditingContent";
            }
        },
        removeContent: function(jsonData) {
            try {
                this._initContentType(jsonData.__contentType__);
                var entity = ContentTypePluginManager.createContent(jsonData.__entity__, jsonData); //item should have uid
                this.currentContent.handleContent(entity, "delete", this.currentContentType.getName());
                entity.remove(); // handle events here after delete
            } catch (e) {
                console.log(e);
                throw "ErrorWhileRemovingContent";
            }

        },
        _toggleSearchMode: function(mode) {
            if (mode == "edit") {
                $(this.editBoard).find(".searchSection").hide();
                $(this.editBoard).find(".contentSection").show();
                this.searchMode = false;
            }

            if (mode == "search") {
                $(this.editBoard).find(".searchSection").show();
                $(this.editBoard).find(".contentSection").hide();
                this.searchMode = true;
            }
        },
        _resetContentScroller: function() {
            $(this.contentSection).find(".nano").nanoScroller({
                alwaysVisible: true,
                scroll: 'top'
            });
        },
        _initScroller: function() {
            $(this.contentSection).find(".nano").nanoScroller({
                alwaysVisible: true
            });

            $("#contents-form-container").nanoScroller({
                alwaysVisible: false
            });
        },
        showSimilarContents: function(content, e) {
            ActivityManager.invoke("OpenNote:SearchEngineActivity", {
                method: "getSimilarContents",
                params: [content, $.proxy(this.onSimilarResult, this)]
            });

        },
        onSimilarResult: function(content) {

        },
        _createContentList: function() {
            var self = this;
            /* itemRenderer */
            var itemRender = function(data) {
                /* send before render notification here */
                var emptyFragment = document.createDocumentFragment();
                var contentType = data["__contentType__"];
                if (typeof contentType !== "string")
                    return emptyFragment;
                self._initContentType(contentType);
                /* contexte */
                var context = "main";
                var template = Handlebars.compile(self.currentContentType.getContentTemplate(context))
                var renderer = template(data);
                /* experimental */
                if(typeof self.currentContentType.render == "function") {
                    renderer = self.currentContentType.render(data, context);
                }
                renderer = $(renderer).attr("data-contentType", contentType);
                if (data.hasOwnProperty("uid")) {
                    $(renderer).attr("item-uid", data.uid);
                }
                renderer = $(renderer).attr("content-ref", self.currentContentType.getUid());
                //self._resetContentScroller();
                return renderer;
            }

            var dataList = new Kimo.DataView({
                data: [],
                appendToTop: true,
                selectorCls: "",
                itemCls: "content-item",
                height: "580px",
                loadingMsg: $("<p>Loading...</p>"),
                emptyMsg: $("<p> nothing to show</p>"),
                /*buttons: [{
                 ico:"fa-lightbulb-o",
                 title:"Suggestion",
                 click: function(){ alert("radical");}}],*/
                itemActions: {},
                itemRenderer: itemRender
            });

            dataList.on("itemSelected", function(e) {
                var contentRef = $(e.data).attr("content-ref");
                var contentTypeInstance = ContentTypePluginManager.getContentType(contentRef);
                if (!contentTypeInstance)
                    return;
                if (typeof contentTypeInstance.onItemSelected == "function") {
                    var jsonData = self.currentContent.getContentByCid($(e.data).data("uid"));
                    var entity = ContentTypePluginManager.createObjectByJson(jsonData, self.currentContent);
                    contentTypeInstance.onItemSelected(e.data, entity);
                }
            });

            dataList.on("beforeRender", function() {
                });

            dataList.on("afterRender", function() {
                self._resetContentScroller();
            });

            dataList.on("mouseOnItem", function(e) {
                var contentRef = $(e.data).attr("content-ref");
                var contentTypeInstance = ContentTypePluginManager.getContentType(contentRef);
                if (!contentTypeInstance)
                    return;
                var jsonContent = self.currentContent.getContentByCid($(e.data).data("uid"));
                var ico = ( $(e.data).hasClass("toExport"))? "fa-check-square-o export-btn" : "fa-square-o export-btn";
                var exportActions = {
                    ico: ico,
                    click: $.proxy(self.handleContentSelection, self, jsonContent,e.data),
                    title: "Selectionner un contenu"
                };
                var similarContents = {
                    ico: "fa-lightbulb-o", 
                    click: $.proxy(self.showSimilarContents, self, jsonContent), 
                    title: "suggestions"
                };
                this.updateItemActions(e.data, [similarContents, exportActions]);
                if (typeof contentTypeInstance.onItemHover === "function") {
                    var jsonData = self.currentContent.getContentByCid($(e.data).data("uid"));
                    contentTypeInstance.onItemHover(e.data, jsonData);
                }
            });

            dataList.on("mouseLeaveItem", function(e) {
                var contentRef = $(e.data).attr("content-ref");
                var contentTypeInstance = ContentTypePluginManager.getContentType(contentRef);
                if (!contentTypeInstance)
                    return;
                this.updateItemActions(e.data, []);
                if (typeof contentTypeInstance.onItemOut === "function") {
                    var jsonData = self.currentContent.getContentByCid($(e.data).data("uid"));
                    contentTypeInstance.onItemOut(e.data, jsonData);
                }
            });

            dataList.on("itemEdited", function(e) {
                var contentId = $(e.data).data("uid");
                if (contentId) {
                    var jsonData = self.currentContent.getContentByCid(contentId);
                    self.editContent(jsonData);
                }
            });

            dataList.on("itemDeleted", function(e) {
                var contentId = $(e.data).data("uid");
                if (contentId) {
                    var jsonData = self.currentContent.getContentByCid(contentId);
                    if (confirm("This content will be deleted. Do you want to continue?")) {
                        self.removeContent(jsonData);
                    }
                }
            });
            return dataList;
        },
        _renderCurrentDocument: function() {
            var template = Handlebars.compile($("#content-book-tpl").html())
            var render = template(this.currentContent.toJson(true));
            $(this.view.view).find(".header").html(render);
        },
        
        /*add reset to abstract */
        _initContentType: function(contentType) {
            this.currentContentType = ContentTypePluginManager.initialize(contentType);
        },
        
        /* Ajouter un contenu */
        _addNewContent: function(action) {
            var self = this;
            var entity = this.currentForm.getData(); //row data
            action = this.nxtAction || "update";
            if (typeof entity.save !== "function") { 
                action = "create";
                var data = entity.data;
                entity = ContentTypePluginManager.createContent(data.__entity__);
                entity.set(data);
            }else{
                action = (entity.isNew()) ? "create" : "update";
            }

            entity.set("container", this.currentContent.getCtnKey());
            /* avant enregistrement --> donner la chance au plugin de faire quelque chose 
             * user
             * */
            self.currentContentType.onBeforeEntitySave(entity).then(function (entity) {
                
                if (!entity.checkData()) throw "EntityDataIsNotValid";
                entity.save().then(function() {
                    self.currentContentType.onEntitySave(entity);
                    self.nxtAction = null;
                    self.currentContent.handleContent(entity, action, self.currentContentType.getName());
                    self._toggleEditBoard();
                    $(self.defaultContent).val("");
                    self._resizeBoard("content");
                })
            });
        },
        _resizeBoard: function(mode) {
            if (mode == "edit") {
                $(this.contentSection).removeClass("span7").addClass("span5");
                $(this.editSection).removeClass("span5").addClass("span7");
            }
            if (mode == "content") {
                $(this.editSection).removeClass("span7").addClass("span5");
                $(this.contentSection).removeClass("span5").addClass("span7");
                $(this.defaultContent).blur();
            }
        },
        /*Explore state content that can save boolean properties*/
        handleContentSelection: function(content,htmlContent) {
            ActivityManager.invoke("OpenNote:ExportActivity", {
                method: "handleContentSelection",
                params: [content,htmlContent]
            });
        },
        
        _bindEvents: function() {
            var self = this;
            $(this.view.view).delegate(".content-type", "click", function() {
                var formtype = $(this).data("formtype");
                self._initContentType(formtype);
                if (formtype) {
                    self._handleForm();
                }
            });

            $(this.view.view).delegate(".form-btn", "click", function(e) {
                e.preventDefault();
                var btnRole = $(this).data("role");
                if (btnRole == "cancel") {
                    self._toggleEditBoard();
                }
                if (btnRole == "save") {
                    self.currentForm.submit();
                }
            });
            /* handle form submit */
            $(this.view.view).delegate(".content-action", "click", function() {
                $(self.editBoard).find(".tabContent").hide();
                var sectionToShow = $(this).data("sectiontoshow");
                $(self.editBoard).find("." + sectionToShow + "Section").eq(0).show();
                self._toggleSearchMode(sectionToShow);
            });

            $(this.defaultContent).bind("focus", $.proxy(this._resizeBoard, this, "edit"));
            // $(this.editSection).bind("click",$.proxy(this._resizeBoard,this,"edit"));
            $("#form-container").bind("click", $.proxy(this._resizeBoard, this, "edit"));
            $(this.contentSection).bind("click", $.proxy(this._resizeBoard, this, "content"));
        },
        /* whe only are interested in subcontents*/
        _handleCurrentContentChange: function(reason, entity, changes) {
            /*last is the new one*/
            var content = this.currentContent.getLastEditedContent();
            var lastReason = this.currentContent.getLastContentChangeAction();
            this.contentList.updateData(content, lastReason);
        },
        
        _toggleEditBoard: function(mode) {
            if (this.editBoardIsVisible || mode == "edit") {
                this.formContainer.empty();
                this.defaultContent.hide();
                this.actionsContainer.hide();
                this.contentFormWrapper.show();
                this.editBoardIsVisible = false;
                return;
            }

            if (!this.editBoardIsVisible || mode == "content") {
                this.defaultContent.show();
                this.actionsContainer.show();
                this.contentFormWrapper.hide();
                this.editBoardIsVisible = true;
            }
        },
        /**
         * Show the edit form for a content
         **/
        _handleForm: function(data) {
            var currentContentConfig = this.currentContentType.getExposedConfig();
            var defaultContent = this.defaultContent.val();
            var form = ContentTypePluginManager.getEditor(currentContentConfig.form);
            if (typeof data == "object" && (data.hasOwnProperty("__entity__"))) {
                data = ContentTypePluginManager.createObjectByJson(data, this.currentContent);
            } else {
                /* create empty content*/
                data = ContentTypePluginManager.createContent(currentContentConfig.entity);
            }
            var mainField = (currentContentConfig.hasOwnProperty("mainField") && typeof currentContentConfig.mainField == "string") ? currentContentConfig.mainField : false;
            if (mainField) {
                if (this.nxtAction != "update") {
                    if (typeof data.set == "function") {
                        data.set(mainField, defaultContent);
                    } else {
                        data[mainField] = defaultContent;
                    }
                }
            }
            /* render form when content is ready */
            var self = this;
            var formRenderPromise = this.currentContentType.beforeFormRender(form, data);
            if(!formRenderPromise || !formRenderPromise.hasOwnProperty("done")) { throw "beforeFormRender should return a promise"; }
            formRenderPromise.done(function (form, data) {
                self.currentForm = form;
                self.currentForm.setData(data);
                self.currentForm.on("submit", $.proxy(self.onSubmitForm, self));
                self._toggleEditBoard("edit");
                self._resizeBoard("edit");
                form.render(self.formContainer);
                $(self.formContainer).append(self.formAction);
            });
        },
        
        /* ... dissocier la création d'un contenu du formulaire ... */
        onSubmitForm: function() {
            this._addNewContent();
        }
        
    });

});
