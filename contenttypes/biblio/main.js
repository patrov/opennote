/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Kimo.require.config({
    paths:{
        "biblio-tpl": "apps/readlist/contenttypes/biblio/templates/biblio.tpl" 
    }
});
define("biblio.type",["ReadList.ContentTypePluginMng","Kimo/core","text!biblio-tpl"],function(ContentypeManager,Kimo,BiblioTpl){
    
    var biblioTpl = $(BiblioTpl);
    $("body").append(biblioTpl);
    var formTpl = $($("#biblio-tpl").html()).find("#edit-form-tpl").html();
    var listTpl = $($("#biblio-tpl").html()).find("#list-tpl").html();
    
    ContentypeManager.registerContentType("BiblioType",{         
        _init: function() {
        /* bind events here */
        },
        onEntitySave: function(entity){
            var biblioItems = entity.get("contents");
            var subContents = [];
            $.each(biblioItems, function (type, formInfos) {
                var subEntity = ($.isPlainObject(formInfos.data)) ? ContentypeManager.createObjectByJson(formInfos.data) : formInfos.data;
                if (subEntity.hasChanged()) {
                    subContents.push(subEntity.toJson());
                    subEntity.set("container", entity.getCtnKey());
                }
            });
            console.log("subContents", subContents);
            /* Save biblioItem here */
            var promise = Kimo.Utils.makeRestRequest("/cnamOpennote/webservices/contents/subcontents",
            {
                type: "PUT",
                data: {
                    container: 
                }
            });
            
            
        },
        getCtnKey: function() {
            return this.name + ":" + this.getUid();
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
                checkData: function(){
                    return true;
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
                        
                        beforeSubFormRender: function (form, data) {
                            if (!$.isEmptyObject(data)){
                                return;
                            }
                            var entity = ContentypeManager.createContent("BiblioItem");
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
});
