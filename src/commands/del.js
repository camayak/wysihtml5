wysihtml5.commands.del = {
  exec: function(composer, command) {
    return wysihtml5.commands.formatInline.exec(composer, command, "del");
  },

  state: function(composer, command) {
    return wysihtml5.commands.formatInline.state(composer, command, "del");
  }
};