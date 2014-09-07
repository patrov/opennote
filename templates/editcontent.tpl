<section id="template">
    
<script id="data-wrapper" type="text/html">
    <div id="mainboard-form-view" class="container-fluid">
        <div class="row-fluid">
            <div class="span5 edit-zone"></div>
            <div class="span7 data-container">
                <div class="header"></div>
                <div class="data-view-ctn"></div>
            </div>
        </div>
    </div>
</script>


<script id="search-result-tpl" type="text/mustache">
    <div class="results-ctn">
        <p>Recherche : <strong>{{term}}</strong> - {{nbResults}} contenu(s) trouvé(s)</p>
        <div class="media-list">
            {{#contents}}
              <div class="media">
                    <a href="#" class="pull-left">
                        <img data-src="holder.js/64x64" class="media-object" alt="64x64" style="width: 45px; height: 45px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABZklEQVR4nO2UMY7DIBQFc/+j/I6Oho6Okp4jcIW/xQoL47hI7GS02leM5CTO1zDYPHrv/p950AI0CkAL0CgALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AI0C0AI0twQws41SyuH3Wqubmeec0ZkfCRBC8JSS9949peRm5q21wz2vyH5i5kcCjF2otZ7ek3P2GONOdvxvLDLnvM15dyYSoJTiZrbJrOKtte27VXbe2TnGlZlYgLPHNcboKaVNepWd3/O7ZiIBxg6Nz6WU7bq1dio7FjcWe8fMrwZY39dZdn6EZ2KMu/+Ow2zMuDLz6wF6/z2Nh8DY0fWeZ7sVQvAQwuH6ykwkQO/7d/nZ6b3Kzqf+vMvzYl6diQb4yygALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AI0C0AI0CkAL0CgALUCjALQAzQ/MPx+NOPVszAAAAABJRU5ErkJggg=="/>
                    </a>
                    <div class="media-body">
                      <h4 class="media-heading">{{__entity__}}</h4>
                      <p>{{content}}</p>
                    </div>
                </div> 
            {{/contents}}
        </div>
    </div>
</script>

<script id="search-result-wrapper-tpl" type="text/html"> 
    <div id="searchEngine-wrapper" style="margin-top:50px"> 
        <div class="row-fluid">
            <div class="resultCtn span8"></div>
        </div>
   </div>
</script>

<script id="user-view-tpl" type="text/html">
    <div class="row-fluid">
        <div class="span4">
           <div style="max-width: 340px; padding: 8px 0;" class="well">
              <ul class="nav nav-list">
                <li class="nav-header">List header</li>
                <li class="active"><a href="#">Home</a></li>
                <li><a href="#">Library</a></li>
                <li><a href="#">Applications</a></li>
                <li class="nav-header">Another list header</li>
                <li><a href="#" data-action="export:test">Profile</a></li>
                <li><a href="#">Settings</a></li>
                <li class="divider"></li>
                <li><a href="#">Help</a></li>
              </ul>
            </div>
        </div>
        <div class="span8">
            <h2>User Configuration</h2>
        </div>
    </div>
</script>

<script id="export-view-tpl" type="text/html">
    <div class="row-fluid">
        <div class="span10">
            <h2>Exporter des contenus </h2>
            <div id="export-task-container"></div>
            <div id="export-list-ctn"></div>
        </div>
    </div>
</script>

<script id="import-document-view-tpl" type="text/html">
    <div class="row-fluid">
        <div class="span10">
            <h2>Importer un document</h2>
            <div id="form-ctn"></div>
            <div class="media-list">
                <div class="media">
                    <a href="#" class="pull-left">
                        <img data-src="holder.js/64x64" class="media-object" alt="64x64" style="width: 45px; height: 45px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABZklEQVR4nO2UMY7DIBQFc/+j/I6Oho6Okp4jcIW/xQoL47hI7GS02leM5CTO1zDYPHrv/p950AI0CkAL0CgALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AI0C0AI0twQws41SyuH3Wqubmeec0ZkfCRBC8JSS9949peRm5q21wz2vyH5i5kcCjF2otZ7ek3P2GONOdvxvLDLnvM15dyYSoJTiZrbJrOKtte27VXbe2TnGlZlYgLPHNcboKaVNepWd3/O7ZiIBxg6Nz6WU7bq1dio7FjcWe8fMrwZY39dZdn6EZ2KMu/+Ow2zMuDLz6wF6/z2Nh8DY0fWeZ7sVQvAQwuH6ykwkQO/7d/nZ6b3Kzqf+vMvzYl6diQb4yygALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AI0C0AI0CkAL0CgALUCjALQAzQ/MPx+NOPVszAAAAABJRU5ErkJggg=="/>
                    </a>
                    <div class="media-body">
                      <h4 class="media-heading">Il don't get it</h4>
                      <p>This is the way of doing things</p>
                    </div>
                </div> 
            </div>
        </div>
    </div>
</script>

<script id="book-suggestion-tpl" type="text/html">
    <div class="media book-suggestion-item">
        <a href="#" class="pull-left">
            <img data-src="holder.js/64x64" class="media-object" alt="64x64" style="width: 45px; height: 45px;" src="{{volumeInfo.imageLinks.thumbnail}}"/>
        </a>
        <div class="media-body">
          <h4 class="media-heading"> {{volumeInfo.title}}</h4>
          <p>{{volumeInfo.authors}}</p>
          <p>publié chez {{publisher}} en {{volumeInfo.publishedDate}}</p>
          <p>{{pageCount}}</p>
        </div>
    </div> 
</script>

<script id="export-task-item-tpl" type="text/html">
        <p class="export-task-item span10">
            <span class="export-title">{{title}}</span>
            <span class="export-progress">{{progress}}</span>
            <span class="format"><strong>{{format}}</strong></span>
            <span><a class="del-btn" href="javascript:;">Annuler</a></span>
        </p>
</script>

<script id="export-item-tpl" type="text/html">
    <div class="media">
        <a href="#" class="pull-left">
          <img data-src="holder.js/64x64" class="media-object" alt="64x64" style="width: 45px; height: 45px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABZklEQVR4nO2UMY7DIBQFc/+j/I6Oho6Okp4jcIW/xQoL47hI7GS02leM5CTO1zDYPHrv/p950AI0CkAL0CgALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AI0C0AI0twQws41SyuH3Wqubmeec0ZkfCRBC8JSS9949peRm5q21wz2vyH5i5kcCjF2otZ7ek3P2GONOdvxvLDLnvM15dyYSoJTiZrbJrOKtte27VXbe2TnGlZlYgLPHNcboKaVNepWd3/O7ZiIBxg6Nz6WU7bq1dio7FjcWe8fMrwZY39dZdn6EZ2KMu/+Ow2zMuDLz6wF6/z2Nh8DY0fWeZ7sVQvAQwuH6ykwkQO/7d/nZ6b3Kzqf+vMvzYl6diQb4yygALUCjALQAjQLQAjQKQAvQKAAtQKMAtACNAtACNApAC9AoAC1AowC0AI0C0AI0CkAL0CgALUCjALQAzQ/MPx+NOPVszAAAAABJRU5ErkJggg=="/>
        </a>
        <div class="media-body">
          <h4 class="media-heading">{{__entity__}}</h4>
          <p>{{content}}</p>
        </div>
  </div> 
</script>


<script id="generic-dialog-tpl" type="text/html">
  <div id="content-modal" class="modal hide fade">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
        <h3 class="modal-title">Modal header</h3>
    </div>
    <div class="modal-body">
        <p>One fine body…</p>
    </div>
    <div class="modal-footer">
        <a data-action="close" href="javascript:;" class="btn action-btn">Close</a>
        <a data-action="save" href="javascript:;" class="btn action-btn btn-primary">Save changes</a>
    </div>
</div>
</script>
<script id="content-type-list-tpl" type="text/html">
    <div class="toolbar btn-group">
        <button class="action btn btn-link btn-small pull-right"><i class="icon-plus"></i> Nouveau Document</button>
        <button class="action btn btn-link btn-small pull-right"><i class="icon-remove"></i> Effacer</button>
        <button class="action btn btn-link btn-small pull-right"><i class="icon-pencil"></i> Editer</button>
        <button class="action btn btn-link btn-small pull-right"><i class="ico-pencil"></i> Voir</button>
    </div>
</script>

<!-- quote template-->
<script data-style="simple" id="content-quote-tpl" type="text/mustache">
    <div class="content-item quote-item">
        <p><span><i class="fa fa-quote-left fa-2x"></i></span> <span> <strong>Page {{page}}</strong></span></p>
        <p class="main-content">{{content}}</p>
        <span class="page fa fa-bookmark"> <strong>Page {{page}}</strong></span>
        <div class="commentContainer"><p>{{comment}}</p></div>
        <div class="tag-container"><i class="fa fa-tags"></i> {{tags}}</div>
    </div>
</script>

<script id="content-book-tpl" type="text/mustache">
    <p><strong>{{author}}</strong>, <em>{{title}}</em>, {{publisher}}, {{place}} {{year}}</p>
</script>

<script data-style="simple" id="content-note-tpl" type="text/mustache">
    <div class="content-item note-item">
        <p><span><i class="fa fa-pencil-square-o fa-2x"></i></span></p>
        <p class="main-content">{{content}}</p>
        <div class="tag-container"><i class="fa fa-tags"></i> {{tags}}</div>
    </div>
</script>


<script id="content-tpl" type="text/html">
    <div class="content-item">
        <p>What do you think?</p>
        <p>There is no come back.</p>
    </div>
</script>

<script id="list-tpl" type="text/html">
    <p>this is my title</p>
    <p>let me test this</p>
</script>

<script id="formBtn-tpl" type="text/html">
    <p><input type="submit" data-role="save" class="form-btn btn-link" value="Enregistrer"/><input type="button" data-role="cancel" class="form-btn btn-link" value="Annuler"/></p>
</script>

<script id="step-content-tpl" type="text/html">
     <div class="step-content-item">
         <p><span><i class="fa fa-list fa-2x"></i></span> page <span>{{start}}</span> - <span>{{end}}</span></p>
         <p class="main-content">{{summary}}</p>
         <p class="steps-stat"></p>
         <div class="item-container"></div>
     </div>
</script>

<script type="text/html" id="step-stats-tpl">
    <a data-action="showAll" class="contentBtn" href="javascript:;"><i class="fa fa-angle-double-right"></i> Tous ({{all}})</a> 
    <a data-action="showNote" class="contentBtn" href="javascript:;"><i class="fa fa-angle-right"></i> Note ({{nbNote}})</a>
    <a data-action="showQuote" class="contentBtn" href="javascript:;"><i class="fa fa-angle-right"></i> Quote ({{nbQuote}})</a>
</script>

<script id="step-content-note-tpl" type="text/html">
    <div class="noteContainer">
        <p><i> Note ({{count}})</i></p>
        {{#notes}}
                <div class="step-item">{{content}}</div>
        {{/notes}}
    </div>
</script>

<script id="step-content-quote-tpl" type="text/html">
    <div class="step-item">{{content}}</div>
</script>



<script id="content-suggestion-tpl" type="text/html">
    <div class="content-suggestion">
        <p><strong>Contenus similaires</strong></p>
        {{#.}}
        <p><strong>{{__entity__}}</strong></p>
        <p>{{content}}</p>
        {{/.}}
    </div>
</script>

<script id="edit-board-tpl" type="text/html">
    <div id="edit-board">
        <div id="board-wrapper">
            
            <ul class="nav nav-pills">
                <li class="disabled">
                    <a data-sectiontoshow="edit" class="content-action edit-btn" href="#">Créer/éditer</a>
                </li>
                 <li>
                    <a data-sectiontoshow="suggestion" class="content-action showsuggestion-btn" href="#"><i class="fa fa-lightbulb-o"> Suggestion</i></a>
                </li>
            </ul>
            
            <div class="tabContent contentSection">
                <textarea id="main-text-container" placeholder="Put the main content here"></textarea>
                <div id="actionContainer">
                    {{#.}}
                        <span class="content-type" title="{{title}}" data-formtype="{{name}}"><i class="{{ico}} fa-2x"></i></span>   
                    {{/.}}
                </div>
                <div id="contents-form-container" style="display:none" class="nano"><form id="form-container" class="nano-content"></form></div>
            </div>  
                
            <div class="tabContent searchSection" style="display:none">Search content</div>
            <div class="tabContent suggestionSection" style="display:none">
                <div id="suggestionCtn" style="position:relative; top:50px; text-align: left"></div>
            </div>
    </div>
 </div>
</script>
</section>
