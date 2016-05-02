wysihtml5.commands.strike = {
  exec: function(composer, command) {
    return wysihtml5.commands.formatInline.exec(composer, command, "s");
  },

  state: function(composer, command) {
    return wysihtml5.commands.formatInline.state(composer, command, "s");
  }
};