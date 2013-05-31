(function(wysihtml5) {
  var REG_EXP = /comment/g,
      NODE_NAME = "q",
      CLASS_NAME = "comment",
      foo
  
  wysihtml5.commands.comment = {
    exec: function(composer, command) {
      // Fetch the comment tag if we're in one.
      var comment_tag = this.state(composer, command, NODE_NAME, CLASS_NAME, REG_EXP);
      // Select the entire comment tag
      if (comment_tag) {
          composer.selection.selectNode(comment_tag[0]);
      }
      foo = wysihtml5.commands.formatInline.exec(composer, command, NODE_NAME, CLASS_NAME, REG_EXP);
      // If a range has been selected, place the cursor afterwards so that additional typing is outside
      // the node
      return foo
    },

    state: function(composer, command) {
      return wysihtml5.commands.formatInline.state(composer, command, NODE_NAME, CLASS_NAME, REG_EXP);
    },

    value: function() {
      return undef;
    }
  };
})(wysihtml5);