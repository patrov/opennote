
/*
 * click sur note
 * var contentMng = ContentTypePluginManager.initialize("Quote");
 * var editor = contentMng.getEditor();
 * this.editorBoard.append(editor);
 * var data = editor.getData(); 
 **/
define(["Kimo/core", "ReadList.config"], function(Kimo, AppConfig) {
    
    var  ContentTypePluginManager = (function(){
        var _contentTypes = {};
        var _instances = {};
        var _isPluginsLoaded = false;
        var _entities = new Kimo.SmartList({
            idKey:"_cid"
        });
        var _entitiesMap = {};
        var _pluginsConf = [];
        var _formModal = null;
        var _mainContent = null;
    
        var AbstractContentType = {
        
            _initialize: function(){
                this.uid = getContentUid();
                this._init();
                this.createForms();
            },
        
            createPromise: function(){
                var dfd = new $.Deferred();
                dfd.resolve.apply(this,arguments);
                return dfd.promise();
            },
        
            createEntity: function(name,config){
                try {
                    config["name"] = name; 
                    /* every contents should have a container and a type*/
                    config.defaults["container"] = "";
                    config.defaults["uid"] = null; //use defaut id key
                    config.defaults["__contentType__"] = this.getName();

                    if (!config.hasOwnProperty("getPath")) {
                        config.getPath = function() {
                            console.log(AppConfig["CONTENT_PATH"])
                            return AppConfig["CONTENT_PATH"]
                        }
                    }
                    /* histoire */
                    if (config.hasOwnProperty("getIndexationInfos")){
                        console.log("config",config.getIndexationInfos());
                    }
                    
                    var entity = Kimo.ModelManager.createEntity(config);
                    _entitiesMap[name] = entity;
                }
                catch (e) {
                    throw 'EntityNotFound error:' + e; 
                }
            },
        
            onBeforeEntitySave : function(entity){
                var dfd = new $.Deferred();
                dfd.resolve(entity);
                return dfd.promise();
            },
        
            onEntitySave: function(){
                var dfd = new $.Deferred();
                dfd.resolve([]);
                return dfd.promise();
            },
        
            beforeFormRender :function(form,entity){
                var dfd = new $.Deferred();
                dfd.resolve(form,entity);
                return dfd.promise();
            },
        
            createForm: function(name,config){
                Kimo.FormManager.createForm(name,config);  
            },
        
            createActions : function(actions){
            
            },
        
            exposeConfig : function(){
                console.log("implement exposeConfig");  
            },
        
            getUid: function(){
                return this.uid;  
            },
        
            getName : function(){
                if(typeof this.name!="string") throw "ContentTypeCantBeFound";
                return this.name;
            }
        };
    
        var getContentUid = (function() {
            var compteur = 0;
            var prefix = "content_";
            return function(){
                compteur = compteur + 1;
                return prefix + compteur;
            }
        })();
   
        var publicApi = {
        
            setMainContent: function(content) {
                _mainContent = content; 
            },
        
            getMainContent: function() {
                if (!_mainContent) { return }
                return _mainContent.getCtnKey();
            },
        
            getEditor : function(formName) {
                try {
                    return Kimo.FormManager.getFormInstance(formName);
                } catch(e){
                    console.log(e);
                }
            },
        
            showModal: function(content,config) {  
                config = config || {};
                _formModal = $($("#generic-dialog-tpl").html());
                $("#content-modal").remove();
                $("body").append(_formModal);
                $(_formModal).find(".modal-body").html($(content));
                $(_formModal).modal(config);
                return _formModal;
            },
            /*handle data*/
            createContent: function(entityType, data){
                try{
                    var entity = (data && data.hasOwnProperty("_cid")) ? _entities.get(data._cid) : null;
                    data = data || {};
                    if(!entity){
                        entity = new _entitiesMap[entityType](data);
                        _entities.set(entity.getCid(),entity);
                    } else{
                        entity.set(data,true); 
                    }
                    return entity; 
                }catch(e){
                    throw 'ErrorWhileCreatingContent['+e+"']";   
                }
            },
       
            initialize : function(contentTypeName,config){
                try{
                    config = config || {};
                    var plugin = new _contentTypes[contentTypeName](config); 
                    _instances[plugin.getUid()] = plugin;
                    return plugin;
                }catch(e){
                    throw "NoContentTypeFound ["+e+"]";
                }
            },
        
            getContentType : function(key){
                return _instances[key]; 
            },
        
            getAvailableContentConf : function(){
                return _pluginsConf; 
            },
        
            createObjectByJson: function(jsonData, mainNode){
                try{
                    var result = this.createContent(jsonData.__entity__, jsonData); //keep reference 
                    var onChange = function(reason){
                        if (mainNode) { mainNode.handleContent(result,reason,mainNode.get("__contentType__"),true); }
                    } 
                    if(typeof mainNode=="object"){
                        result.detach("change",onChange).on("change",onChange);
                    }
                }catch(e){
                    console.log(e);
                    throw "ErrorWhileCreatingEntity";
                }
                return result;
            },
        
        
            registerContentType: function(name,defConfig){
                /* Abstract with interface */
                var properties = {};
                properties.name = name;
                //var protectedMethods = {};
                var methods = {};
            
                if(!name) throw "ContentTypeMustHaveAName";
                /* Mock */
                $.each(defConfig, function(key,value){
                    if(typeof value=="function"){
                        methods[key] = value;
                    }else{
                        properties[key] = value;
                    } 
                });
                /* handle available conf */
                if(typeof methods.getExposedConfig=="function"){
                    var config = methods.getExposedConfig.call(this);
                    if(!config.name) config.name = name;
                    _pluginsConf.push(config);
                }
                /* handle form and models */
                if(typeof methods.createModels=="function"){
                    AbstractContentType.name = name;
                    methods.createModels.call(AbstractContentType);
                }
            
                if(typeof methods.createForms=="function"){
                    methods.createForms.call(AbstractContentType);
                }
                /* ContentPluginConstructor */
                var ContentTypeContructor = function(userSettings){
                    $.extend(true,this,properties);
                    $.extend(true,this._settings,userSettings);
                    this._initialize();     
                }
            
                /*copyAbtract*/
                var AbstractClone = $.extend(true,{},AbstractContentType);
                ContentTypeContructor.prototype = $.extend(true, AbstractClone, methods);
                _contentTypes[name] = ContentTypeContructor;
            },
            
            initPlugins: function(){
                var def = new $.Deferred(); 
                $.ajax({
                    url: appPath+"/apps/readlist/contenttypes/config.json",
                    dataType:"json"
                }).done(function(response){
                    var pluginPath = response.path;
                    var plugins = [];
                    var pluginsName = [];
                    $.each(response.plugins,function(i,name){
                        var completePath = appPath+pluginPath+"/"+name+"/main.js";
                        plugins.push(completePath);   
                        pluginsName.push(name+".type");
                    });
                    if(!plugins.length){
                        def.resolve();
                    }else{
                        Kimo.Utils.requireWithPromise(plugins).done(function(response){
                            Kimo.Utils.requireWithPromise(pluginsName).done(function(t){
                                /* all plugins are loaded */
                                def.resolve();
                            });
                        }); 
                    }
                    
                }).fail(function(){
                    def.reject();
                });
                
                return def.promise();
            }
        }
        return publicApi;
    })();
    return ContentTypePluginManager;
});