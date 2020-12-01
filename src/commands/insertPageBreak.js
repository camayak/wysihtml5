(function(wysihtml5) {
  var PAGE_BREAK = "<hr class=\"page-break\">";
  
  wysihtml5.commands.insertPageBreak = {
    exec: function(composer, command) {
      if (composer.commands.support(command)) {
        composer.doc.execCommand(command, false, null);
        if (!wysihtml5.browser.autoScrollsToCaret()) {
          composer.selection.scrollIntoView();
        }
      } else {
        composer.commands.exec("insertHTML", PAGE_BREAK);
      }
    },

    state: function() {
      return false;
    }
  };
})(wysihtml5);