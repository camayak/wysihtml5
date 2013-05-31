(function(wysihtml5) {
  var dom         = wysihtml5.dom,
      NODE_NAME   = "SPAN",
      CLASS_NAME  = "oembed";

  /**
   * Check whether given node is a text node and whether it's empty
   */
  function _isBlankTextNode(node) {
    return node.nodeType === wysihtml5.TEXT_NODE && !wysihtml5.lang.string(node.data).trim();
  }

  /**
   * Returns previous sibling node that is not a blank text node
   */
  function _getPreviousSiblingThatIsNotBlank(node) {
    var previousSibling = node.previousSibling;
    while (previousSibling && _isBlankTextNode(previousSibling)) {
      previousSibling = previousSibling.previousSibling;
    }
    return previousSibling;
  }

  /**
   * Returns next sibling node that is not a blank text node
   */
  function _getNextSiblingThatIsNotBlank(node) {
    var nextSibling = node.nextSibling;
    while (nextSibling && _isBlankTextNode(nextSibling)) {
      nextSibling = nextSibling.nextSibling;
    }
    return nextSibling;
  }

  /**
   * Adds line breaks before and after the given node if the previous and next siblings
   * aren't already causing a visual line break (block element or <br>)
   */
  function _addLineBreakBeforeAndAfter(node) {
    var doc             = node.ownerDocument,
        nextSibling     = _getNextSiblingThatIsNotBlank(node),
        previousSibling = _getPreviousSiblingThatIsNotBlank(node);

    if (nextSibling && !_isLineBreakOrBlockElement(nextSibling)) {
      node.parentNode.insertBefore(doc.createElement("br"), nextSibling);
    }
    if (previousSibling && !_isLineBreakOrBlockElement(previousSibling)) {
      node.parentNode.insertBefore(doc.createElement("br"), node);
    }
  }

  function _isLineBreak(node) {
    return node.nodeName === "BR";
  }

  /**
   * Checks whether the elment causes a visual line break
   * (<br> or block elements)
   */
  function _isLineBreakOrBlockElement(element) {
    if (_isLineBreak(element)) {
      return true;
    }

    if (dom.getStyle("display").from(element) === "block") {
      return true;
    }

    return false;
  }
  wysihtml5.commands.insertOEmbed = {
    // exec usually behaves like a toggle
    // if the format is applied then undo it (and vica versa)
    exec: function(composer, command, param) {
      var embed   = this.state(composer, command, param),
          doc     = composer.doc,
          dialog,
          embed_data_url_attr,
          embed_url,
          textNode,
          i,
          parent;

      if (embed) {
        /* The user has the embed selected and has clicked
            the toolbar icon.

            We show the dialog, populated with the current embed url
        */
        // The Embed url
        // embed_data_url_attr = embed.attributes.getNamedItem('data-camayak-embed-url')
        // Reference to dialog
        // dialog = composer.commands.editor.toolbar.commandMapping[command+":null"].dialog
        // dialog.show(embed), dialog.hide()
        // if (embed_data_url_attr) {
        //   embed_url = embed_data_url_attr.value;
        //   dialog.show(embed);
        // } else {
        //   return;
        // }
        // embed already selected, set the caret before it and delete it
        composer.selection.setBefore(embed);
        parent = embed.parentNode;
        parent.removeChild(embed);
        // firefox and ie sometimes don't remove the image handles, even though the image got removed
        wysihtml5.quirks.redraw(composer.element);
        return;
      } else {
        // apply code here (eg. insert <foo>)
        // dialog.show();
        embed = doc.createElement(NODE_NAME);
        // <span data-camayak-embed-url="<%= url %>" data-camayak-embed-width="<%= width %>" class="oembed" contenteditable="false"><%= url %></span>

        for (i in param) {
          if (i === "className") {
            i = "class";
          }
          if (i === "data-camayak-embed-url") {
            // set the contents of the span to the url
            embed.appendChild( doc.createTextNode(param[i]) );
          }
          embed.setAttribute(i, param[i]);
        }
        embed.setAttribute("class","oembed");
        embed.setAttribute("contenteditable","false");

        composer.selection.insertNode(embed);

        // Insert a line break afterwards and beforewards when there are siblings
        // that are not of type line break or block element
        _addLineBreakBeforeAndAfter(embed);
        
        if (wysihtml5.browser.hasProblemsSettingCaretAfterImg()) {
          textNode = doc.createTextNode(wysihtml5.INVISIBLE_SPACE);
          composer.selection.insertNode(textNode);
          composer.selection.setAfter(textNode);
        } else {
          composer.selection.setAfter(embed);
        }
        return;
      }
    },

    // usually returns a truthy value when the command is applied to the current selection
    // a falsy when the current selection isn't formatted with <foo>
    state: function(composer, command) {
       var doc = composer.doc,
          selectedNode,
          text,
          spansInSelection;

      if (!wysihtml5.dom.hasElementWithTagName(doc, NODE_NAME)) {
        return false;
      }

      selectedNode = composer.selection.getSelectedNode();
      if (!selectedNode) {
        return false;
      }

      if (selectedNode.nodeName === NODE_NAME) {
        // This works perfectly in IE
        return selectedNode;
      }

      if (selectedNode.nodeType !== wysihtml5.ELEMENT_NODE) {
        return false;
      }

      text = composer.selection.getText();
      text = wysihtml5.lang.string(text).trim();
      if (text) {
        return false;
      }

      spansInSelection = composer.selection.getNodes(wysihtml5.ELEMENT_NODE, function(node) {
        return node.nodeName === NODE_NAME;
      });

      if (spansInSelection.length !== 1) {
        return false;
      }

      return spansInSelection[0];
    },

    // ignore this for now (it's currently not used)
    value: function() {
    }
  };
})(wysihtml5);