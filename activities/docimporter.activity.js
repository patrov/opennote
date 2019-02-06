/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


define(["Kimo/core", "OpenNote.models", "OpenNote.forms", "OpenNote.ContentTypePluginMng"], function(Kimo, M, F, ContentTypePluginManager) {

    Kimo.ActivityManager.createActivity("DocumentImportActivity", {
        appname: "OpenNote",
        initView: function() {
            var a = {
                name: "readlist-docimport-view",
                title: "Import a document",
                contentEl: $("#import-document-view-tpl").html()
            };
            this.setContentView(a);
        },
        
        onCreate: function(){
            /* getParameters */
            this.importForm = OpenNote.forms.bookImportForm;
        },
        
        showFormAction: function(){
            this.importForm.render(this.view.view.find("#form-ctn"));
            this.bindEvents();
        },
        
        bindEvents: function(){
            this.importForm.setValidator(function(){
                return true;
            });
            this.importForm.on("submit",$.proxy(this.handleForm, this));
        },
        
        handleForm: function(formData){
            var bookInfos = formData.data.rawData.search;
            this.navigateTo('content:create',{data:bookInfos, mode:"export"},null);
        },
        
        onResume: function(){
            
        }

    });


});
