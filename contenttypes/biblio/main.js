/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Kimo.require.config({
    paths:{
        "biblio-tpl": "apps/opennote/contenttypes/biblio/templates/biblio.tpl",
        "list-tpl": "apps/opennote/contenttypes/biblio/templates/list.tpl"
    }
});
define("biblio.type", ["OpenNote.ContentTypePluginMng", "Kimo/core", "text!biblio-tpl", "OpenNote.TemplateManager"], function(ContentypeManager, Kimo, BiblioTpl, TplMng){
    
    var biblioTpl = $(BiblioTpl);
    $("body").append(biblioTpl);
    var formTpl = $($("#biblio-tpl").html()).find("#edit-form-tpl").html();
    var listTpl = $($("#biblio-tpl").html()).find("#list-tpl").html();
    
    ContentypeManager.registerContentType("BiblioType",{         
        _init: function() {
            /* bind events here */
            this.ctnKey = this.name+":"+this.getUid();
        },
        
        /*Quoi faire avant de rendre le formulaire */
        /*beforeFormRender: function (form, biblio) {
            console.log("strange");
            return new $.Deferred().promise();
        },*/
        
        cleanFormData: function(data){
            $.each(data, function (i, dataItem) {
                console.log("strange", dataItem);
            })
        },
        
        /* after the main content has been saved to the database */
        onEntitySave: function(entity){
            var self = this;
            var biblioItems = entity.get("contents");
            var subContents = [];
            $.each(biblioItems, function (type, formInfos) {
                var subEntity = ContentypeManager.createContent("BiblioItem",formInfos.data.data)
                subEntity.set("container", entity.getCtnKey());
                subContents.push(subEntity.toJson());
            });
            /* Save biblioItem here */
            Kimo.Utils.makeRestRequest("/cnamOpennote/webservices/contents/subcontents",
            {
                type: "POST",
                data: {
                    data: JSON.stringify(subContents)
                }
            });
            
            
        },
       
        createModels: function(){
            this.createEntity("BiblioItem",{
                defaults: {
                    author: "",
                    title: "",
                    publisher: "",
                    pubYear:"",
                    place :"",
                    tags: "",
                    "__entity__": "BiblioItem",
                    "__indexation__": ["author","container","title","tags:csv"]  //mettre à jour l'indexation
                },
                checkData: function(){
                    return true;
                }
            });
            
            /* Entity biblio */
            this.createEntity("Biblio", {
                defaults: {
                    contents: [],
                    "__indexation__": ["container"]
                },
                getCtnKey: function() {
                    return this.name + ":" + this.getUid();
                },
                checkData: function(){
                    return true;
                },
                init: function(){
                    this.contentData = new Kimo.SmartList({});
                    console.log("init:Strange");
                },
                loadContents: function(){
                    var self = this;
                    var def = new $.Deferred();
                    var dataPromise = Kimo.Utils.makeRestRequest("/cnamOpennote/webservices/contents/subcontents",
                    {
                        type: "GET",
                        data: {
                            container : this.getCtnKey()
                        }
                    });
                    dataPromise.done(function(response){
                        console.log("response", response.result);
                        self.contentData = response.result;
                        def.resolve(response.result);
                    }).fail(function(reason){
                        def.reject(reason);
                    });
                    return def.promise();
                }
            });
        },
        
        createForms: function(){
            var ItemForm = Kimo.FormManager.createForm("BiblioItemForm", {
                data: { },
                action: "/radical/blaze",
                method: "GET",
                id: "465s-sdcfqs-dc",
                mainWrapper: "<div>",
                map: {
                    title: {
                        label: "Titre",
                        type: "text",
                        placeholder: "Titre"
                    },
                    author: {
                        label: "Auteur",
                        type: "text",
                        placeholder: "Auteur"
                    },
                    pubYear: {
                        label: "Année",
                        type: "text",
                        placeholder: "Année de publication"
                    },
                    publisher: {
                        label: "Editeur",
                        type: "text",
                        placeholder: "Editeur"
                    },
                    place: {
                        label: "Lieu",
                        type: "text",
                        placeholder:"Lieu de publication"
                    },
                    tags: {
                        label: "Tag",
                        type: "text",
                        placeholder:"Mot clé séparé par une virgule"
                    } 
                },
                
                beforeRender: function(fieldMaps,fields){
                    fieldMaps.title = $(fieldMaps.title).wrap("<field>").parent().html();
                    fieldMaps.author = $(fieldMaps.author).wrap("<field>").parent().html();
                    fieldMaps.publisher = $(fieldMaps.publisher).wrap("<field>").parent().html();
                    fieldMaps.place = $(fieldMaps.place).wrap("<field>").parent().html();
                    fieldMaps.tags = $(fieldMaps.tags).wrap("<field>").parent().html();
                    fieldMaps.pubYear = $(fieldMaps.pubYear).wrap("<field>").parent().html();
                    var form = $(Mustache.render(formTpl,fieldMaps));
                    return form;
                },
                
                validator: function(data){
                    var errors = [];
                    var isValid = true;
                    if ($.trim(data.author) == "") {
                        isValid = false;
                        errors.push({
                            field: "author",
                            message: ""
                        });
                    }
                    
                    if ($.trim(data.title) == "") {
                        isValid = false;
                        errors.push({
                            field: "title",
                            message: ""
                        });
                    }
                    
                    if ($.trim(data.tags) == "") {
                        isValid = false;
                        errors.push({
                            field: "tags",
                            message: ""
                        });
                    }
                    this.handleError(errors);
                    return isValid;
                } 
            });
            
            /* create */
            this.createForm("BiblioForm", {
                data: {},
                form : ["BiblioItemForm"],
                map: {
                    contents : {
                        label: "Ajouter une entrée",
                        type: "form-choice",
                        chooserRenderer: function() {
                            var formInfos = [{
                                label: "Bibliographie",
                                name: "BiblioItemForm"
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
                        
                        beforeSubFormRender: function(form, formData) {
                            var entity = ContentypeManager.createContent("BiblioItem",formData.data);
                            form.setData(entity);
                        }
                    }
                },
               
                validator: function (data){
                    /* handle subform */
                    var isValid = false;
                    var subForms = this.getField("contents").getSubForms();
                    $.each(subForms, function(key, form) {
                        isValid = form.validate();
                    });
                    return isValid;
                }
            });
            
        },
        
        getContentTemplate: function(){
            return listTpl;
        },
        
        render: function(data, context){
            var biblioEntity = ContentypeManager.createObjectByJson(data),
            /*templateChange according to context*/
            contentHandler = TplMng.render("list-tpl", {
                dataLoader : $.proxy(biblioEntity.loadContents, biblioEntity)
            });
            return contentHandler;
        },
        
        getExposedConfig: function() {
            return {
                title: "Bibliographie",
                entity: "Biblio",
                //mainField: "title",
                ico: "fa fa-list-alt",
                form: "BiblioForm"
            }
        }
    }); 
}, function(e){
    console.log(e);
});
