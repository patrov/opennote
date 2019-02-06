
define(["Kimo/core", "OpenNote.models", "OpenNote.forms", "OpenNote.ContentTypePluginMng"], function(Kimo, M, F, ContentTypePluginManager) {

    Kimo.ActivityManager.createActivity("ExportActivity", {
        appname: "OpenNote",
        exportList : new Kimo.SmartList({
            idKey: "uid",
            onInit: function() {
            },
            onChange: function() {
                $("#exportCompteur").html(this.getSize());
            },
            onDelete: function() {
                $("#exportCompteur").html(this.getSize());
            }
        }),
      
        events: {
            ".exportItem click": "showDelAction",
            ".doExport-btn click": "exportContents",
            ".del-btn click": "delExportTask"
        },
        
        testShow : function(){
            alert("inside test show export activity");
        },
        
        showDelAction: function() {
            console.log(arguments);
        },
        
        delExportTask: function() {
            alert("-- radical --");
        },
        
        initView: function() {
            var a = {
                name: "readlist-export-view",
                title: "Export view",
                contentEl: $("#export-view-tpl").html()
            };
            this.setContentView(a);
        },
        
        onCreate: function(params) {
            this.dataContainer = this.view.view.find("#export-list-ctn");
            this.dataList = this.createDataList();
            this.bindEvents();
        },
        
        listAction: function(params){
            this.dataList.reset();
            this.dataList.setData(this.exportList.toArray(true));
            this.dataList.render(this.dataContainer);
        },   
        
        onStop: function(){
            if(this.dataList){
                this.dataList.reset();     
            }   
        },
        
        onResume: function() {},
        
        createDataList: function() {
            
            var itemRenderer = function(data) {
                var renderer = Mustache.render($("#export-item-tpl").html(), data);
                return renderer;
            }
            
            var dataList = new Kimo.DataView({
                data: [],
                appendToTop: true,
                selectorCls: "",
                itemCls: "export-item",
                height: "580px",
                loadingMsg: $("<p>Loading...</p>"),
                emptyMsg: $("<p>nothing to show</p>"),
                buttons: [{
                    ico: "fa fa-download", 
                    text: "Exporter", 
                    onclick: $.proxy(this.showExportDialog, this)
                }],
                itemRenderer: itemRenderer
            });
            return dataList;
        },
        
        getExportForm: function() {
            if (this.exportForm)
                return this.exportForm;
            this.exportForm = Kimo.FormManager.createForm("ContentExport", {
                buttons: [{
                    text: "Exporter", 
                    type: "submit"
                }],
                data: {},
                map: {
                    title: {
                        label: "Choisissez un titre",
                        type: "text"
                    },
                    format: {
                        label: "Format de l'export",
                        renderType: "select",
                        type: "list",
                        dataSource: {
                            epub: "epub", 
                            pdf: "pdf"
                        }
                    }
                }
            });

            this.exportForm.setValidator(function() {
                return true;
            });

            var self = this;
            this.exportForm.on("submit", function(data) {
                $("#export-list-ctn").hide();
                var itemRender = Mustache.render($("#export-task-item-tpl").html(), data.data.rawData);
                console.log("sd",data.data.rawData);
                $("#export-task-container").append(itemRender);
                self.exportDialog.modal("hide");
                $.ajax({
                    dtaType: 'jsonp',
                    data: {},
                    url: "localhost:8080/hibernateTest/webresources/export/create"
                }).done();
            });
            return this.exportForm;
        },
        handleExportProgression: function() {

        },
        showExportDialog: function() {
            this.exportDialog = $($("#generic-dialog-tpl").html());
            var formCtn = $("<div class='form-ctn'></div>").clone();
            this.getExportForm().render(formCtn);
            $("#content-modal").remove();
            $("body").append(this.exportDialog);
            this.exportDialog.find(".modal-body").html($(formCtn));
            this.exportDialog.find(".modal-title").text("Exporter");
            /* hide footer buttons */
            this.exportDialog.find(".modal-footer").hide();
            this.exportDialog.modal();
        },
        
        bindEvents: function() {

        },
        
        public_handleContentSelection: function(content, htmlContent) {
            ($(htmlContent).hasClass("toExport")) ? $(htmlContent).removeClass("toExport") : $(htmlContent).addClass("toExport");
            var action = ($(htmlContent).hasClass("toExport")) ? "add" : "del";
            var btnClass = (action === "add") ? "fa fa-check-square-o export-btn" : "fa fa-square-o export-btn";
            /*...strange but...who cares :)*/
            $(htmlContent).find(".export-btn").removeClass().addClass(btnClass);
            if (action === "add") {
                this.exportList.set(content.uid, content);
            }
            if (action === "del") {
                this.exportList.deleteItemById(content.uid);
            }
        }
      

    });

});