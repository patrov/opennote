var ReadList = ReadList || {};
define(["Kimo/core"], function(Kimo) {
    var ModelManager = require("Kimo.ModelManager");
   
    /* Use the rest service */

    ReadList.models = (function() {


        const nodeEntity = ModelManager.createEntity({
            
            name: "Node",
            defaults: {
                isRoot: false,
                type: "Node",
                data: null,
                properties: null
            },
            
            getPath: () => {},

            loadContents: function() {
                return new Promise((done) => {
                    done([])
                })
            },

            getCtnKey: function() {
                return this.name + ":" + this.uid;   
            }
        })

        const NodeRepository = ModelManager.createRepository({
            
            repositoryName: "NodeRepository",
            model: nodeEntity,
        })

        var documentEntity = ModelManager.createEntity({
            name: "Book",
  
            constraint: {
                title: ["int", "notempty"]
            },
            
            defaults: {
                title: "",
                subtitle: "",
                author: "",
                publisher: "",
                place: "",
                year: "",
                pages: "",
                contents: [],
                tags: "",
                cover: null,//path
                extra: {},
                "__indexation__" : ["title","subtitle","author:cs","pages","publisher","place","year","tags:csv"]
            },
            
            lastEditedContent: null,
            lastContentsAction: null,
            init: function() {
                this.set("")
                this.isReady = false;
                /* load paginate */
                this._cidUidMap = {};
                this.contentList = new Kimo.SmartList({
                    idKey: '_cid',
                    generateKey: true,
                    onInit: $.proxy(this.onContainerInit, this),
                    onChange: $.proxy(this.onContainerChange, this),
                    onDelete: $.proxy(this.onContainerChange, this)
                });
            },
            
            getPath: function(){
                return "/cnamOpennote/webservices/books";
            },
            
            onContainerInit: function(data) {
                if (this.contentList) {
                    var contents = this.contentList.toArray(true);
                    this.set("contents", contents, true);//notifie the data list
                }
            },
            
            loadContents: function(start, limit, order) {
                start = 1;
                limit = 10;
                order = "updatedAt";
                var promise = Kimo.Utils.makeRestRequest("/cnamOpennote/webservices/contents/subcontents",
                {
                    type: "GET",
                    data: {container:this.getCtnKey(), order:order, start:start, limit:limit }
                });
                promise.done($.proxy(this.initSubContents, this)).fail($.proxy(this.handleError, this));
                return promise;
            },
            
            initSubContents: function(response) {
                if (this.contentList) {
                    this.contentList.setData(response.result);
                }
            },
            
            checkData: function() {
                return false;
            },
            
            getCtnKey: function() {
                return this.name + ":" + this.uid;
            },
            /**
             *Extends data
             **/
            extendsContent: function(data, silent) {
                var items = this.contentList.addData(data, silent);
                this.set("contents", items);
            },
            
            /* return the last edited content */
            getLastEditedContent: function() {
                return this.lastEditedContent;
            },
            
            getLastContentChangeAction: function() {
                return this.lastContentsAction;
            },
            
            onContainerChange: function(list, listname, editedItem) {
                this.lastEditedContent = editedItem;
                var contents = this.contentList.toArray(true);
                this.set("contents", contents);//notifie the data list
            },
            
            toJson: function() {
                var json = this.super().toJson();//add more method there
                /*handle all dynfields here*/
                var author = this.getAuthor();
                if(Kimo.jquery.isPlainObject(author)) {
                    var results = [];
                    Kimo.jquery.each(author,function(key,author) {
                        results.push(author);
                    });

                    json.author = results.join(", ");
                }
                return json;
            },
            
            _checkContent: function(content, contentType) {
                if (typeof content !== "object" || content.constructor.name !== "Entity")
                    throw "ContentIsNotValid";
                if (!content.checkData()) {
                    throw "ContentDataIsNotValid";
                }
                var contentJson = content.toJson();
                /* save uid */
                if (!content.isNew()) {
                    /* update content */
                    this.contentList.replaceItem(content);
                    //this._cidUidMap[content.uid] = content
                }
                contentJson["_cid"] = content.getCid();
                this._cidUidMap[content.uid] = content.getCid();
                return contentJson;
            },

            createContent: function(content, silent) {
                this.contentList.set(content["_cid"], content, silent);
            },

            updateContent: function(content, silent) {
                this.contentList.set(content["_cid"], content, silent);
            },

            deleteContent: function(content, silent) {
                this.contentList.deleteItem(content, silent);
            },

            getContentByCid: function(cid) {
                return this.contentList.get(cid);
            },

            getContentByUid: function() {

            },

            handleContent: function(content, action, contentType, silent) {
                silent = (typeof silent == "boolean") ? silent : false;
                var availableActions = ["create", "update", "delete"];
                if ($.inArray(action, availableActions) == -1) { return };
                var contentData = this._checkContent(content, contentType);
                this.lastContentsAction = (action == "delete") ? "remove" : action;
                this.lastEditedContent = contentData;
                if (contentData) {
                this[action + "Content"].call(this, contentData, silent);
                }
            }
        });

        var BookRepository = ModelManager.createRepository({
            repositoryName: "BookRepository", //modifier chan
            route: "",
            model: documentEntity, //user string or prefix
            getPath: function() {
                return "/cnamOpennote/webservices/contents";
            }
        })

     
        /* public Api */
        return {
            DocumentItem: documentEntity,
            Node: nodeEntity,
            bookRepository: new BookRepository,
            NodeRepository: new NodeRepository
        }
    })();
    return ReadList.models;
});