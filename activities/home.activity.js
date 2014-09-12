define(["Kimo/core","ReadList.ContentTypePluginMng"], function(Kimo,ContentTypePluginManager) {
        
    Kimo.ActivityManager.createActivity("HomeActivity", {
        appname: "ReadList",
        initView: function() {
            var view = $("<div id='edit'></div>").clone()
            var a = {
                name: "readlist-edit-view",
                title: "Form view",
                contentEl: view
            };
            //var template = this.getContent("/bundles/kooklistmain/js/apps/readlist/templates/editcontent.tpl");
            //$(template).appendTo("body"); //clean html see http://bugs.jquery.com/ticket/13223
            this.setContentView(a);
        },
        onCreate: function(params) {
            this.repository = ReadList.models.bookRepository;
            this.listPromise = this._createDataList();
        },
            
        onStop: function() {
            if(this.listView) this.listView.reset();
        },
            
        onResume: function() {},
            
        _bindEvents: function() {
            var self = this;
            this.repository.on("change", $.proxy(this._handleRepoChange, this));
            this.listView.on("mouseOnItem", function(e) {
                var ico = ($(e.data).hasClass("toExport")) ? "fa-check-square-o export-btn" : "fa-square-o export-btn";
                var exportActions = {
                    ico: ico,
                    click: $.proxy(self.handleContentSelection, self, {
                        uid: e.dataItem._cid,
                        __entity__: "Book",
                        content: e.dataItem.title
                    }, e.data),
                    title: "Selectionner un contenu"
                };
                this.updateItemActions(e.data, [exportActions]);
                return true;
            });
        },
        
        /* Controller Actions */
        showHomeAction: function(params) {
            var self = this;
            this.listPromise.done(function(response){
                self.listView.reset();
                var frag = document.createDocumentFragment();
                var content = $("<div id='list'/>");
                self.listView.render(content);
                frag.appendChild($(content).get(0));
                self.view.setContent($(frag));
            }).fail(function(t){
                console.log("error in showHomeAction");
            });  
        },
        
        handleContentSelection: function(content, htmlContent) {
            Kimo.ActivityManager.invoke("ReadList:ExportActivity", {
                method: "handleContentSelection",
                params: [content, htmlContent]
            });
        },
        _handleRepoChange: function(reason, entity) {
            var self = this;
            var data = entity.toJson(true);
            data["_cid"] = entity.getCid();
            self.listView.updateData(data, reason);
        },
        _createOrEditDocument: function() {
            var selectedDocument = this.listView.selected;
            selectedDocument = this.listView.getDataByHtml(selectedDocument);
            this.navigateTo("content:edit", {}, {
                "{id}": selectedDocument.uid
            });
        },
        _createNewDocument: function() {
            this.navigateTo("content:create", {});//fix last route
        },
        
        _showEditionBoard: function() {
            var selectedDocument = this.listView.selected;
            if (!selectedDocument)
                return;
            selectedDocument = this.repository.findByCid($(selectedDocument).attr("id"));
            if (!selectedDocument)
                return;
               console.log("ici");
               console.log("selected",selectedDocument);
            ContentTypePluginManager.setMainContent(selectedDocument);
            this.navigateTo("contentboard:show", {
                selectedDocument: selectedDocument
            }, {
                "{id}": selectedDocument.getUid()
            });
        },
        _deleteDocument: function(e) {
            if (confirm("Selected item(s) will be deleted")) {
                var cid = $(this.listView.selected).attr("id");
                if (cid) {
                    this.repository.removeByCid(cid);
                }
            }
        },
        
        _handleDataList: function(def,data){
            var self = this;
            var allData = [];
            
            data.forEach(function(data, key) {
                var dataItem = data.toJson(true);
                dataItem["_cid"] = data.getCid();
                allData.push(dataItem);
            });

            var itemRender = function(entity) {
                var templateItem = '<div id="{{_cid}}" data-uid="{{_cid}}" class="item"><h3 class="title" data-field-name=""><i class="fa fa-file-text-o fa-1x"></i> {{title}}</h3><span class="author">{{author}}</span><span>, {{publisher}} <em>{{place}}</em> {{year}}</span></div>';
               return Mustache.render(templateItem, entity);
            }
            
            this.listView = new Kimo.DataView({
                data: allData, 
                appendToTop: true,
                itemRenderer: itemRender,
                menu: {
                    position: "left",
                    item: []
                },
                buttons: [
                {
                    text: "Importer un document",
                    onclick: $.proxy(this.showDocImporterForm, this),
                    ico: "ico-plus"
                },
                {
                    text: "Nouveau Document",
                    onclick: $.proxy(this._createNewDocument, this),
                    ico: "icon-plus"
                },
                {
                    text: "Effacer",
                    onclick: $.proxy(this._deleteDocument, this),
                    ico: "icon-remove"
                },
                {
                    text: "Editer",
                    onclick: $.proxy(this._createOrEditDocument, this),
                    ico: "icon-pencil"
                },
                {
                    text: "Voir",
                    onclick: $.proxy(this._showEditionBoard, this),
                    ico: "ico-pencil"
                }
                ]
            });
            def.resolve(this.listView);
            this._bindEvents();
        },
        
        _createDataList: function() {
            var def = new $.Deferred();
            this.repository.getAll({
                start: 0,
                limit: 10
            }).done($.proxy(this._handleDataList,this,def));
            return def.promise();
        },
        
        
        showDocImporterForm: function() {
            this.navigateTo("DocumentImportActivity", {});
        }
    });
  
})
