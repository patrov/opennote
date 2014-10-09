<script id="biblio-tpl" type="text/mustache">
 <div class="biblio-template">   
 <div id="edit-form-tpl">
     <div> 
        <div class="row" style="margin-left: 0px">
            <div class="span6">{{{title}}}</div>
            <div class="span6">{{{author}}}</div>
        </div>
       <div class="row" style="margin-left: 0px">
           <div class="span4">{{{publisher}}}</div>
           <div class="span4">{{{pubYear}}}</div>
           <div class="span4">{{{place}}}</div>
       </div>
         {{{tags}}}
      </div>
</div>

  <div id="list-tpl">
    <div>
    {{#.}}
        <p>
            <i class='fa fa-list-alt fa-2x'></i> 
            <span><i>{{author}}</i></span>, <span>{{title}}</span> <span><strong>{{publisher}}</strong> - {{pubYear}}</span>
        </p>
    {{/.}}
    </div>
  </div>    
      
      <div>
      
</script>
