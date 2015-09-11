wysihtml5.commands.ins = {
  exec: function(composer, command) {
    return wysihtml5.commands.formatInline.exec(composer, command, "ins");
  },

  state: function(composer, command) {
    return wysihtml5.commands.formatInline.state(composer, command, "ins");
  }
};