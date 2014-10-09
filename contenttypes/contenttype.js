define(["Kimo/core","ReadList.ContentTypePluginMng"], function(Kimo,ContentTypePluginManager) {
    
  ContentTypePluginManager.registerContentType("NoteType", {
        _settings: {},
        
        events: {},
        
        _init: function() {
        },
        
        onItemSelected: function(item) {

        },
        
        onItemHover: function(item) {

        },
        
        onItemOut: function(item) {

        },
        exposeItemActions: function() {
        },
        
        createModels: function() {


            this.createEntity("Note", {
                defaults: {
                    content: "",
                    tags: "",
                    "__indexation__":["content","container","tags:csv"]
                },
                
                checkData: function() {
                    var result = true;
                    if ($.trim(this.getContent()) == "")
                        result = false;
                    return result;
                }
            });
        },
        
        createForms: function() {
            this.createForm("NoteForm", {
                map: {
                    content: {
                        label: "Contenu",
                        type: "textarea",
                        placeholder: "Contenu du bloc",
                        id: "note"
                    },
                    tags: {
                        label: "Mots-clés",
                        type: "text",
                        placeholder: "mots-clés séparés par une virgule"
                    }
                },
                validator: function(data) {
                    var isValid = true;
                    var errors = [];
                    if (data.content == "") {
                        isValid = false;
                        errors.push({
                            field: "content",
                            message: "Content can't be null"
                        });
                    }
                    if (data.tags.length == 0) {
                        isValid = false;
                        errors.push({
                            field: "tags",
                            message: "Tag field can't be null"
                        });
                    }
                    if (!isValid) {
                        this.handleError(errors);
                    }
                    return isValid;
                }
            });
        },
        
        getContentTemplate: function() {
            var template = $("#content-note-tpl").html();
            return template;
        },
		
        getExposedConfig: function() {
            return {
                title: "Note",
                entity: "Note",
                mainField: "content",
                ico: "fa fa-pencil-square-o",
                form: "NoteForm"
            }
        }

    });


    /* quote */
   ContentTypePluginManager.registerContentType("QuoteType", {
        _settings: {},
        events: {},
        _init: function() {

        },
        createModels: function() {
            this.createEntity("Quote", {
                defaults: {
                    page: "",
                    context: "",
                    source: "",
                    content: "",
                    comment: "",
                    tags: "",
                    "__indexation__":["page","context","container","source","content","comment","tags:csv"]
                },
                checkData: function() {
                    var result = true;
                    if ($.trim(this.getPage()) == "")
                        result = false;
                    if ($.trim(this.getSource()) == "")
                        result = false;
                    if ($.trim(this.getContent()) == "")
                        result = false;
                    if ($.trim(this.getComment()) == "")
                        result = false;
                    if (result == "false") {
                        
                    }
                    return result;
                }
            })
        },
        createForms: function() {
            this.createForm("QuoteForm", {
                data: {},
                map: {
                    page: {
                        label: "Page",
                        type: "text",
                        placeholder: "Page de la citation"
                    },
                    content: {
                        label: "Contenu de la citation",
                        placeholder: "Corps de la citation",
                        type: "textarea"
                    },
                    comment: {
                        label: "Ajouter un commentaire",
                        placeholder: "Commen de la citation",
                        type: "textarea",
                        collapsible: true
                    },
                    tags: {
                        label: "Mot clés",
                        placeholder: "mots-clés séparés par une virgule",
                        type: "text"
                    }
                },
                validator: function(data) {
                    var isValid = true;
                    var errors = [];
                    if ($.trim(data.page) == "") {
                        isValid = false;
                        errors.push({
                            field: "page",
                            message: ""
                        })
                    }
                    if ($.trim(data.content) == "") {
                        isValid = false;
                        errors.push({
                            field: "content",
                            message: ""
                        })
                    }
                    if (data.tags.length == 0) {
                        isValid = false;
                        errors.push({
                            field: "tags",
                            message: ""
                        })
                    }
                    this.handleError(errors);
                    return isValid;
                }
            })
        },
        
        onBeforeEntitySave: function(entity) {
            entity.set("source", ContentTypePluginManager.getMainContent());
            return this.createPromise(entity);
        },
        
        getContentTemplate: function() {
            return $("#content-quote-tpl").html();
        },
        
        getExposedConfig: function() {
            return {
                title: "Quote",
                entity: "Quote",
                ico: "fa fa-quote-left",
                mainField: "content",
                form: "QuoteForm"
            }
        }

    });

    /* video */
   ContentTypePluginManager.registerContentType("VideoType", {
        _settings: {},
        events: {
            "itemSelected": "callback",
            "beforeEdit": "",
            "beforeRender": ""
        },
        _init: function() {
            console.log("inside init video");
        },
        createModels: function() {

            this.createEntity("Video", {
                defaults: {
                    title: "",
                    embed: "",
                    tags: [],
                    "__indexation__":["title","tags:csv","container"]
                },
                scheduleDownload: function() {
                    this.addToDownloadQueue(this);
                },
                checkData: function() {
                    return true;
                }
            });
        },
        createForms: function() {
            this.createForm("VideoForm", {
                validator: function(data) {
                    var errors = [];
                    var isValid = true;
                    if ($.trim(data.title) == "") {
                        isValid = false;
                        errors.push({
                            field: "title",
                            message: ""
                        });
                    }
                    if ($.trim(data.embed) == "") {
                        isValid = false;
                        errors.push({
                            field: "embed",
                            message: ""
                        });
                    }
                    if (data.tags.length == "") {
                        isValid = false;
                        errors.push({
                            field: "tags",
                            message: ""
                        });
                    }
                    this.handleError(errors);
                    return isValid;
                },
                data: {},
                map: {
                    title: {
                        label: "Titre",
                        type: "text"
                    },
                    embed: {
                        label: "Video",
                        type: "text"
                    },
                    tags: {
                        label: "Mot-clé",
                        type: "text"
                    }
                }
            });

        },
        
        getContentTemplate: function(name) {
            var tpl = "<div><p><span><i class='fa fa-play-circle fa-2x'></i></span></p><p>{{title}}</p><div>{{{embed}}}</div><div class='tag-container'><i class='fa fa-tags'></i> {{tags}}</div></div>";
            return tpl;
        },
        onSave: function() {
            var data = {};
            this.currentContent.add(data);
        },
        getExposedConfig: function() {
            return {
                title: "Video",
                entity: "Video",
                mainField: "embed",
                ico: "fa fa-play-circle",
                form: "VideoForm"
            }
        }

    });

    /*
     *possibilite de mettre un contenu en exerger
     *
     **/
    ContentTypePluginManager.registerContentType("StepsType", {
        _settings: {},
        events: {
            "itemSelected": "callback",
            "beforeEdit": "",
            "beforeRender": "",
            "entity:save": ""
        },
        _init: function() {
            this.loadingPromise = null;
            this.isLoading = false;
            this.isLoaded = false;
            this.contentIsLoaded = false;
            this.formEntityMap = {
                NoteForm: 'Note',
                QuoteForm: 'Quote'
            }
            this.entityFormMap = {
                'Note': "NoteForm",
                'Quote': "QuoteForm"
            };
        },
        _handleItemEvents: function(item, currentContent) {
            $(item).undelegate("click").delegate(".contentBtn", "click", function() {
                var currentAction = $(this).attr("data-action");
                if ($(this).hasClass("deployed")) {
                    $(this).removeClass("deployed");
                    $(this).find("i").removeClass().addClass("fa fa-angle-right");
                } else {
                    currentContent.showStepContents(item, currentAction); //load step //
                    $(this).addClass("deployed");
                    $(this).find("i").removeClass().addClass("fa fa-angle-down");
                }
            });
        },
        
        onItemSelected: function(item, entity) {
            this.currentEntity = entity;
            this.currentEntity._setStepRender(item);
            this.currentItem = item;
            entity.updateStepStats();
            this._handleItemEvents(item, entity);
        },
        
        beforeFormRender: function(form, entity) {
            var dfd = new $.Deferred();
            var render_form = dfd.promise();
            if (this.isLoaded) {//?
                dfd.resolve(form, entity);
                return render_form;
            }
            var promise = entity.loadSteps(); //load steps
            promise.done(function() {
                dfd.resolve(form, entity);
            }).fail(function() {
                console.log("error in BeforeFormRender");
            });
            return render_form;
        },
        createModels: function() {

            this.createEntity("Step", {
                defaults: {
                    start: "",
                    end: "",
                    summary: "",
                    steps: {} //[{name:note,u id:78637863dsf},{name:book,uid}] ref to steps
                },
                initEntityView: function() {

                    Kimo.registerEntityView({
                        name: "StepItem",
                        events: {
                            "root mouseenter": "showContentActions",
                            "root mouseleave": "hideActions",
                            ".editAction click": "editContent",
                            ".deleteAction click": "deleteContent"
                        },
                        templatesMap: {
                            Note: "#content-note-tpl",
                            Quote: "#content-quote-tpl"
                        },
                        _showItemActions: function(item) {
                            var actions = $('<p class="actionCtn">\n\
                                        <input type="button" value="Editer" class="btn editAction form-btn btn-link" data-role="edit"/>\n\
                                        <input type="button" value="Effacer" class="btn deleteAction form-btn btn-link" data-role="delete"/>\n\
                                       </p>').clone();

                            $(item).find(".actionCtn").remove();
                            $(item).css("position", "relative");
                            $(actions).css("position", "absolute");
                            $(actions).css({
                                "top": "10px",
                                "right": "5px"
                            });
                            $(item).append($(actions));
                        },
                        init: function() {
                            var type = this.entity.name;
                            this.itemTemplate = $(this.templatesMap[type]).html();
                            this.root = $(Mustache.render(this.itemTemplate, this.entity.toJson()));
                            this.formName = this.entity.name + "Form";
                            this.entity.on("save", $.proxy(this.handleChange, this)); //not change but save
                            this.entity.on("remove", $.proxy(this.destroy, this));
                        },
                        deleteContent: function() {
                            if (confirm("This content will be deleted")) {
                                this.root.remove();
                                this.entity.remove();
                                this.container.deleteItem(this.entity);
                            }
                        },
                        editContent: function() {
                            var self = this;
                            var noteForm = ContentTypePluginManager.getEditor(this.formName);
                            noteForm.setData(this.entity);
                            var modal = ContentTypePluginManager.showModal(noteForm.render(), {
                                title: "Editer"
                            });
                            $(modal).delegate(".action-btn", "click", function() {
                                var actionType = $(this).attr("data-action");
                                if (actionType == "save") {
                                    self.entity.save();
                                    $(modal).modal("hide");
                                } else {
                                    $(modal).modal("hide");
                                }
                            });
                        },
                        hideActions: function() {
                            $(this.root).find(".actionCtn").remove();
                        },
                        showContentActions: function() {
                            this._showItemActions(this.root);
                        },
                        handleChange: function(reason, entity) {
                            var newData = $(Mustache.render(this.itemTemplate, this.entity.toJson()));
                            $(this.root).html($(newData).html());
                        },
                        render: function() {
                            return this.root;
                        },
                        destroy: function() {
                            $(this.root).remove();
                        }
                    })
                }
                ,
                init: function() {
                    this.initEntityView();
                    this.container = null;
                    this.isLoaded = false;
                    this.rawResponse = null;
                    var self = this;
                    this.stepsList = new Kimo.SmartList({
                        idKey: "uid",
                        onChange: $.proxy(this._renderContents, this),
                        onDelete: function(ctn, name, item) {
                            if (item.name = "Quote") {
                                self.quotesList.deleteItem(item);
                            }
                            if (item.name == "Note") {
                                self.notesList.deleteItem(item);
                            }
                            self.updateSteps();
                            self.updateStepStats();
                        }
                    });
                    this.notesList = new Kimo.SmartList({
                        idKey: "uid"
                    });
                    this.quotesList = new Kimo.SmartList({
                        idKey: "uid"
                    });
                },
                _setStepRender: function(render) {
                    this.container = render;
                },
                _renderContents: function(list) {
                    var fragment = document.createDocumentFragment();
                    var self = this;
                    $.each(list, function(i, entity) {
                        var contentView = Kimo.createEntityView("StepItem", {
                            entity: entity,
                            container: self.stepsList
                        });
                        var content = contentView.render();
                        fragment.appendChild(content.get(0));
                    });
                    return $(fragment);
                },
                getCtnKey: function() {
                    return this.name + ":" + this.getUid();
                },
                onError: function() {
                    console.log("Error while loading");
                },
                
                updateStepStats: function() {
                    var self = this;
                    var stats = {};
                    this.loadSteps().then(function() {
                        stats.all = self.stepsList.getSize();
                        stats.nbNote = self.notesList.getSize();
                        stats.nbQuote = self.quotesList.getSize();
                        var statsRender = Mustache.render($("#step-stats-tpl").html(), stats);
                        $(self.container).find(".steps-stat").html(statsRender);
                    });
                },
                showStepContents: function(container, action) {
                    var self = this;
                    container = $(container).find(".item-container");
                    this.loadSteps().then(function(response) {
                        if (action == "showAll") {
                            var contents = self.stepsList.toArray(true);
                            $(container).html(self._renderContents(contents));
                        }
                        if (action == "showNote") {
                            var notes = self.notesList.toArray(true);
                            $(container).html(self._renderContents(notes));
                        }
                        if (action == "showQuote") {
                            var quotes = self.quotesList.toArray(true);
                            $(container).html(self._renderContents(quotes));
                        }
                    });
                },
                _handleNewSteps: function(jsonData) {
                    var subEntity = ($.isPlainObject(jsonData)) ? ContentTypePluginManager.createObjectByJson(jsonData) : jsonData;
                    this.stepsList.set(subEntity.uid, subEntity);

                    if (subEntity.name == "Note") {
                        this.notesList.set(subEntity.getUid(), subEntity);
                    }

                    if (subEntity.name == "Quote") {
                        this.quotesList.set(subEntity.getUid(), subEntity);
                    }
                    return subEntity;
                },
                loadSteps: function(container, start, limit) {
                    if (this.isLoaded) {
                        var dfd = new $.Deferred();
                        dfd.resolve(this.rawResponse);
                        return dfd.promise();
                    }
                    this.container = container;
                    var promise = Kimo.Utils.makeRestRequest("/cnamOpennote/webservices/contents/subcontents",
                    {
                        type: "GET",
                        data: {
                            container:this.getCtnKey()
                            }
                    });
                    
                    
                    promise.done($.proxy(this.initSteps, this)).fail($.proxy(this.onError, this));
                    return promise;
                },
                updateSteps: function(data) {
                    data = data || this.stepsList.toArray(true);
                    var self = this;
                    var contents = {};
                    var key = "form_";
                    $.each(data, function(i, result) {
                        i = i + 1;
                        var subEntity = self._handleNewSteps(result);
                        var value = {};
                        value.type = subEntity.name + "Form";
                        value.data = subEntity;
                        contents[key + i] = value;
                    });
                    this.set("steps", contents);
                },
                initSteps: function(response) {
                    this.isLoaded = true;
                    var steps = response.result;
                    var key = "form_";
                    this.updateSteps(steps);
                },
                
                checkData: function() {
                    return true;
                }

            });
        },
        createForms: function() {
            var self = this;
            this.createForm("StepForm", {
                data: {},
                jsonData: false,
                validator: function(data) {
                    var isValid = true;
                    var errors = [];
                    if ($.trim(data.start) == "") {
                        isValid = false;
                        errors.push({
                            field: "start",
                            message: ""
                        });
                    }
                    if ($.trim(data.end) == "") {
                        isValid = false;
                        errors.push({
                            field: "end",
                            message: ""
                        });
                    }
                    var subForms = this.getField("steps").getSubForms();
                    $.each(subForms, function(key, form) {
                        form.validate();
                    });

                    this.handleError(errors);
                    return isValid;
                },
                map: {
                    start: {
                        label: "Page début",
                        type: "text",
                        placeholder: "titre du document",
                        validate: [], //handle validator
                        filters: {},
                        maxentry: 4, //plugins
                        hide: true //afficher masquer le champ
                    },
                    end: {
                        label: "Page fin",
                        type: "text",
                        placeholder: "titre du document",
                        validate: [],
                        filters: {},
                        maxentry: 4, //plugins
                        hide: true //afficher masquer le champ
                    },
                    summary: {
                        label: "Résumé du passage",
                        placeholder: "Résumé de la sequence",
                        type: "textarea"
                    },
                    steps: {
                        label: "Ajouter des sous-contenus",
                        deletable: true, //a form element can be deleted
                        sortable: true, // a form element can be dragged
                        markup: "", //more style
                        forms: ["QuoteForm", "NoteForm", "LinkForm", "MediaForm", "PersoForm"],
                        beforeSubFormRender: function(form, data) {
                            if (!$.isEmptyObject(data))
                                return;
                            var entityName = self.formEntityMap[form.name];
                            if (entityName) {
                                var entity = ContentTypePluginManager.createContent(entityName);
                                form.setData(entity);
                            }
                        },
                        onDeleteSubform: function(entity) {
                            if (!entity.isNew()) {
                                entity.remove(); //add to a toDelete group
                            }
                        },
                        chooserRenderer: function() {
                            var formInfos = [{
                                label: "Note",
                                name: "NoteForm"
                            }, {
                                label: "Quote",
                                name: "QuoteForm"
                            }];
                            var container = document.createDocumentFragment();
                            $.each(formInfos, function(i, form) {
                                var formLink = $("<a/>");
                                formLink.attr("href", "javascript:;");
                                formLink.addClass("form-chooser-btn");
                                formLink.attr("data-form", form.name);
                                formLink.text(" " + form.label);
                                container.appendChild($(formLink).get(0));
                            });
                            return $(container);
                        },
                        type: "form-choice"
                    }
                }
            });
        },
        afterRender: function (item) {

        },
        
        onEntitySave: function(entity) {
            var steps = entity.get("steps");
            var subContents = [];
            $.each(steps, function(key, formInfos) {
                var subContent = formInfos.data;
                if (subContent.hasChanged()) {
                    subContent.set("container", entity.getCtnKey());
                    if (subContent.name == "Quote") {
                        subContent.set("source", ContentTypePluginManager.getMainContent());
                    }
                    subContents.push(subContent.toJson());
                }
            });
            entity.updateStepStats();
            makeRequest("ws_data.batchAction", {
                params: {
                    action: "createOrUpdate",
                    "data": subContents
                }
            }).done(function(response) {
                var result = response.result;
                if ($.isArray(result)) {
                    $.each(result, function(i, result) {
                        entity._handleNewSteps(result);
                    });
                }

            });
        },
        onEntityEdit: function() {
            console.log("sdsd");
        },
        onEntityDelete: function() {
            console.log("radical blaze");
        },
        getContentTemplate: function(name) {
            var tpl = $("#step-content-tpl").html();
            return tpl;
        },
        getExposedConfig: function() {
            return {
                title: "Steps",
                entity: "Step",
                mainField: "summary",
                ico: "fa fa-list",
                form: "StepForm"
            }

        }





    });


});
