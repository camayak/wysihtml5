(function(wysihtml5) {
  var NODE_NAME = "SPAN";
  var CLASS_NAME = "oembed";

  wysihtml5.commands.insertOEmbed = {
    // exec usually behaves like a toggle
    // if the format is applied then undo it (and vica versa)
    exec: function(composer, command, param) {
      if (this.state(composer, command, param) {
        // undo code here
        console.log("Edit this, baby");
      } else {
        // apply code here (eg. insert <foo>)
        console.log("Insert this, baby");
      }
    },

    // usually returns a truthy value when the command is applied to the current selection
    // a falsy when the current selection isn't formatted with <foo>
    state: function(composer, command) {
      return wysihtml5.commands.formatInline.state(composer, command, NODE_NAME, CLASS_NAME);
    },

    // ignore this for now (it's currently not used)
    value: function() {
    }
  };
})(wysihtml5);