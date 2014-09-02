var ReadList = ReadList || {};
define("ReadList.forms", ["Kimo.FormManager"], function(FormManager) {

    ReadList.forms = (function() {
        var typeList = {
            "book": "Livre",
            "article": "Article"
        };
        var priorityList = {
            "": "",
            "top": "Pour Hier!",
            "hight": "As soon as you can!",
            "medium": "Lè ou gen tan!",
            "low": "Not that important!"
        };

        var bookImportForm = Kimo.FormManager.createForm("BookImport", {
            data: {},
            map: {
                search: {
                    label: "Trouver un livre",
                    type: "datalist",
                    placeholder: "Titre / auteur / ISBN",
                    searchHandler: function(term) {
                        return $.ajax({
                            url: "https://www.googleapis.com/books/v1/volumes",
                            data: {q: "intitle:"+term, key: "AIzaSyCy1Bwq88PBbwehzKZv7_f7xZ7dMhhAa8w"},
                            dataType: "jsonp"});
                    },
                    
                    itemRenderer: function(data) {
                        data.volumeInfo.authors = data.volumeInfo.authors.join(", ");
                        var item = Mustache.render($("#book-suggestion-tpl").html(), data);
                        return $(item);
                    }
                }},
            buttons: [{text: "Exporter", type: "submit"}]

        });

        var bookForm = Kimo.FormManager.createForm("BookForm", {
            data: {},
            plugins: [{name: "dynfield"}, {name: "collapsible"}],
            buttons: [{
                    text: "Enregistrer",
                    type: "submit",
                    click: function() {
                    }
                },
                {
                    text: "Annuler",
                    click: function() {
                    }
                }],
            map: {
                title: {
                    label: "Titre du document",
                    type: "text",
                    placeholder: "titre du document",
                    collapsible: true
                },
                subtitle: {
                    label: "Sous-titre du document",
                    type: "text",
                    placeholder: " sous-titre du document"
                },
                author: {
                    label: "Auteur",
                    type: "text",
                    placeholder: "Auteur du document",
                    dynfield: {max: 3}
                },
                publisher: {
                    label: "Editeur",
                    type: "text",
                    placeholder: "Editeur du document"
                },
                place: {
                    label: "Lieu de publication",
                    type: "text",
                    placeholder: "Lieu de publication"
                },
                year: {
                    label: "Année de publication",
                    type: "text",
                    placeholder: "Lieu de publication",
                    collapsible: true
                },
                pages: {
                    label: "Page",
                    type: "text",
                    placeholder: "Nombre de page",
                    collapsible: true
                },
                tags: {
                    label: "Mots-clés",
                    type: "text",
                    placeholder: "Séparé les mots-clés par des virgules",
                    collapsible: true
                }
            }


        });

        var testForm = Kimo.FormManager.createForm("StepForm", {
            data: {},
            templatename: "dark",
            map: {
                start: {
                    label: "Page debut",
                    type: "text",
                    placeholder: "De la page ..."
                },
                end: {
                    label: "Page fin",
                    type: "text",
                    placeholder: "A la page ..."
                },
                steps: {
                    label: "Note",
                    type: "textarea",
                    placeholder: "Note sur le passage"
                }
            }
        });

        var BiblioForm = FormManager.createForm("NoteForm", {
            data: {},
            map: {
                content: {
                    label: "Note libre",
                    placeholder: "Ajouter une note sur la section",
                    type: "textarea"
                },
                tags: {
                    label: "Mot clés",
                    placeholder: "mot-clé séparé par une virgule",
                    type: "text"
                }
            }
        });

        /* améliorer l'api */
        var QuoteForm = FormManager.createForm("QuoteForm", {
            data: {},
            map: {
                page: {
                    label: "Page",
                    type: "text",
                    placeholder: "Page de la citation"
                },
                content: {
                    label: "Contenu de la citation",
                    placeholder: "Corps de la citatiion",
                    type: "textarea",
                    config: {makdown:true}
                },
                comment: {
                    label: "Ajouter un commentaire",
                    placeholder: "Commen de la citatiion",
                    type: "textarea"
                },
                tags: {
                    label: "Mot clés",
                    placeholder: "mot-clé séparé par une virgule",
                    type: "text"
                }
            }
        });

        var booklistForm = FormManager.createForm("ReadList", {
            data: {},
            map: {
                start: {
                    label: "Page début",
                    type: "text",
                    placeholder: "titre du document",
                    validate: [],
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
                    label: "Résumer du passage",
                    placeholder: "Résumé de la sequence",
                    type: "textarea"
                },
                steps: {
                    label: "Ajouter des sous-contenus",
                    deletable: true, //a form element can be deleted
                    sortable: true, // a form element can be dragged
                    markup: "", //more style
                    forms: ["QuoteForm", "NoteForm", "Link", "mediaForm", "PersoForm"], //render as you go proposer un choix des forms
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

        return {
            mainForm: booklistForm,
            bookImportForm: bookImportForm,
            bookForm: bookForm
        }
    })();

});
