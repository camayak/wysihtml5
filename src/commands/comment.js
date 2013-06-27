(function(wysihtml5) {
  var REGEXP  = /inline-comment/g,
      CLASS   = "inline-comment",
      NODE    = "Q";

  wysihtml5.commands.comment = {
    exec: function(composer, command) {
      // Fetch the comment tag if we're in one.
      var comment_tag = this.state(composer, command);
      if (comment_tag) {
        var range       = composer.selection.getRange(),
            container   = range.endContainer,
            len         = container.length,
            elementToSetCaretAfter,
            whitespace;


        /*  This chunk of code works if we've selected a bunch of text
            and are making it a comment.  But, it doesn't work if we click
            the button and start typing, then click the button again.
            
            If we're click-button-type-comment-click-button, what's the 

        */
        if (range.collapsed && range.endOffset === len) {
          //wysihtml5.commands.formatInline.exec(composer, command, NODE, CLASS, REGEXP);
          // The range is collapsed (nothing selected), and the cursor is at the
          //  end of the text node.  We want to move the cursor AFTER the comment_tag
          // If the comment tag does not have a following sibling, its probably
          //   the last item in the body.  If so, we should add an "invisible"
          //   text node after it.
          elementToSetCaretAfter = comment_tag;
          if (!comment_tag.nextElementSibling) {
            composer.selection.setAfter(comment_tag);
            whitespace = composer.doc.createTextNode(wysihtml5.INVISIBLE_SPACE);
            wysihtml5.dom.insert(whitespace).after(comment_tag);
            elementToSetCaretAfter = whitespace;
          }
          composer.selection.setAfter(elementToSetCaretAfter);
        } else {
          // Create a new text node with contents from the comment
          var text_node = composer.doc.createTextNode(comment_tag.textContent);
          // Replace the whole comment span with the new text node
          comment_tag.parentNode.replaceChild(text_node, comment_tag);
          composer.selection.selectNode(text_node);
        }

      } else {
        var inner_span      = composer.doc.createElement("span"),
            toggle          = composer.doc.createElement("span"),
            doc             = composer.doc,
            tempClass       = "_wysihtml5-temp-" + (+new Date()),
            tempClassRegExp = /non-matching-class/g,
            i               = 0,
            length,
            text_span,
            text_spans    ;
        // Create the toggle
        toggle.setAttribute("class","inline-comment-control");
        toggle.setAttribute("contenteditable","false");
        // Create the inner comment span
        inner_span.setAttribute("class","comment");
        inner_span.setAttribute("contenteditable","true");
        inner_span.setAttribute("tabindex","1");
        // Wrap the inner comment span with another span
        wysihtml5.commands.formatInline.exec(composer, command, NODE, CLASS, REGEXP);
        // wysihtml5.commands.formatInline.exec(composer, command, NODE, tempClass, tempClassRegExp);
        // text_spans = doc.querySelectorAll(NODE + "." + tempClass);
        // length = text_spans.length;
        // for (; i<length; i++) {
        //   text_span = text_spans[i];
        //   text_span.removeAttribute("class");
        //   text_span.setAttribute("class",CLASS);
        //   // text_span.setAttribute("contenteditable","false");
        // }
        composer.selection.surround(inner_span);
        wysihtml5.dom.insert(toggle).after(inner_span);        
      }
    },

    state: function(composer, command) {
      var selectedNode = composer.selection.getSelectedNode(),
          in_node = wysihtml5.dom.getParentElement(selectedNode, { nodeName: NODE, className: CLASS, classRegExp: REGEXP });
      return in_node;
    }
  };
})(wysihtml5);