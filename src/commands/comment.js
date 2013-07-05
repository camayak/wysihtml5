(function(wysihtml5) {
  var NODE_NAME    = "Q",
      CLASS_NAME  = "inline-comment",
      REG_EXP     = /inline-comment/g;
  
  wysihtml5.commands.comment = {
    
    exec: function(composer, command) {
      var in_comment = this.state(composer, command);
      if (in_comment) {
        // If we're in the comment, instead of trying to insert an un-comment section (which
        // ends up looking like a nested comment), select everything first, then it will do
        // a proper un-commenting
        composer.selection.selectNode(in_comment);
      }
      return wysihtml5.commands.formatInline.exec(composer, command, NODE_NAME, CLASS_NAME, REG_EXP);
    },

    // state: function(composer, command) {
    //   return wysihtml5.commands.formatInline.state(composer, command, NODE_NAME, CLASS_NAME, REG_EXP);
    // }
    state: function(composer, command) {
      var selectedNode = composer.selection.getSelectedNode(),
          in_node = wysihtml5.dom.getParentElement(selectedNode, { nodeName: NODE_NAME, className: CLASS_NAME, classRegExp: REG_EXP });
      return in_node;
    }
  };
})(wysihtml5);