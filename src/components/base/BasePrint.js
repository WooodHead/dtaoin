import React from 'react';

export default class PrintThisComponent extends React.Component {
  constructor(props) {
    super(props);
    this.printThis = this.printThis.bind(this);
  }

  // transform canvas to img,for can't print directly

  setCanvasPrintImg(canvas, imgBox) {
    imgBox.src = canvas.toDataURL('image/png');
  }

  /* setCanvasPrintImg(canvas) {
   if (!$(canvas).siblings('img')) {
   $(`<img src=${canvas.toDataURL("image/png")} class="print-image"/>`).insertAfter(canvas);
   }
   }*/

  printThis(options) {
    let opt;
    opt = $.extend({},
      {
        debug: false,           // show the iframe for debugging
        importCSS: true,        // import parent page css
        importStyle: false,     // import style tags
        printContainer: true,   // print outer container/$.selector
        loadCSS: '',            // load an additional css file - load multiple stylesheets with an array []
        pageTitle: '',          // add title to print page
        removeInline: false,    // remove all inline styles
        printDelay: 333,        // variable print delay
        header: null,           // prefix to html
        footer: null,           // footer to html
        formValues: true,        // preserve input/form values
        doctypeString: '<!DOCTYPE html>', // html doctype
      }, options);
    const $element = options.element;
    // let $element = this instanceof jQuery ? this : $(this);

    const strFrameName = `printThis-${  (new Date()).getTime()}`;

    if (window.location.hostname !== document.domain && navigator.userAgent.match(/msie/i)) {
      // Ugly IE hacks due to IE not inheriting document.domain from parent
      // checks if document.domain is set by comparing the host name against document.domain
      const iframeSrc = `javascript:document.write("<head><script>document.domain=\\"${  document.domain  }\\";</script></head><body></body>")`;
      const printI = document.createElement('iframe');
      printI.name = 'printIframe';
      printI.id = strFrameName;
      printI.className = 'MSIE';
      document.body.appendChild(printI);
      printI.src = iframeSrc;
    } else {
      // other browsers inherit document.domain, and IE works if document.domain is not explicitly set
      const $frame = $(`<iframe id='${  strFrameName  }' name='printIframe' />`);
      $frame.appendTo('body');
    }


    const $iframe = $(`#${  strFrameName}`);
    $iframe.portrait = true;
    // show frame if in debug mode
    if (!opt.debug) $iframe.css({
      position: 'absolute',
      width: '0px',
      height: '0px',
      left: '-600px',
      top: '-600px',
    });


    // $iframe.ready() and $iframe.load were inconsistent between browsers
    setTimeout(function () {
      // Add doctype to fix the style difference between printing and render
      function setDocType($iframe, doctype) {
        let win, doc;
        win = $iframe.get(0);
        win = win.contentWindow || win.contentDocument || win;
        doc = win.document || win.contentDocument || win;
        doc.open();
        doc.write(doctype);
        doc.close();
      }

      if (opt.doctypeString) {
        setDocType($iframe, opt.doctypeString);
      }

      let $doc = $iframe.contents(),
        $head = $doc.find('head'),
        $body = $doc.find('body');

      // add base tag to ensure elements use the parent domain
      $head.append(`<base href="${  document.location.protocol  }//${  document.location.host  }">`);

      // import page stylesheets
      if (opt.importCSS) $('link[rel=stylesheet]').each(function () {
        const href = $(this).attr('href');
        if (href) {
          const media = $(this).attr('media') || 'all';
          $head.append(`<link type='text/css' rel='stylesheet' href='${  href  }' media='${  media  }'>`);
        }
      });

      // import style tags
      if (opt.importStyle) $('style').each(function () {
        $(this).clone().appendTo($head);
        // $head.append($(this));
      });

      // add title of the page
      if (opt.pageTitle) $head.append(`<title>${  opt.pageTitle  }</title>`);

      // import additional stylesheet(s)
      if (opt.loadCSS) {
        if ($.isArray(opt.loadCSS)) {
          jQuery.each(opt.loadCSS, function () {
            // jQuery.each(opt.loadCSS, function (index, value) {
            $head.append(`<link type='text/css' rel='stylesheet' href='${  this  }'>`);
          });
        } else {
          $head.append(`<link type='text/css' rel='stylesheet' href='${  opt.loadCSS  }'>`);
        }
      }

      // print header
      if (opt.header) $body.append(opt.header);

      // grab $.selector as container
      if (opt.printContainer) $body.append(this.outer($element));

      // otherwise just print interior elements of container
      else $element.each(function () {
        $body.append($(this).html());
      });

      // capture form/field values
      if (opt.formValues) {
        // loop through inputs
        const $input = $element.find('input');
        if ($input.length) {
          $input.each(function () {
            let $this = $(this),
              $name = $(this).attr('name'),
              $checker = $this.is(':checkbox') || $this.is(':radio'),
              $iframeInput = $doc.find(`input[name="${  $name  }"]`),
              $value = $this.val();

            // order matters here
            if (!$checker) {
              $iframeInput.val($value);
            } else if ($this.is(':checked')) {
              if ($this.is(':checkbox')) {
                $iframeInput.attr('checked', 'checked');
              } else if ($this.is(':radio')) {
                $doc.find(`input[name="${  $name  }"][value=${  $value  }]`).attr('checked', 'checked');
              }
            }
          });
        }

        // loop through selects
        const $select = $element.find('select');
        if ($select.length) {
          $select.each(function () {
            let $this = $(this),
              $name = $(this).attr('name'),
              $value = $this.val();
            $doc.find(`select[name="${  $name  }"]`).val($value);
          });
        }

        // loop through textareas
        const $textarea = $element.find('textarea');
        if ($textarea.length) {
          $textarea.each(function () {
            let $this = $(this),
              $name = $(this).attr('name'),
              $value = $this.val();
            $doc.find(`textarea[name="${  $name  }"]`).val($value);
          });
        }
      } // end capture form/field values

      // remove inline styles
      if (opt.removeInline) {
        // $.removeAttr available jQuery 1.7+
        if ($.isFunction($.removeAttr)) {
          $doc.find('body *').removeAttr('style');
        } else {
          $doc.find('body *').attr('style', '');
        }
      }

      // print footer
      if (opt.footer) $body.append(opt.footer);

      setTimeout(() => {
        if ($iframe.hasClass('MSIE')) {
          // check if the iframe was created with the ugly hack
          // and perform another ugly hack out of neccessity
          window.frames.printIframe.focus();
          $head.append('<script>  window.print(); </script>');
        } else {
          // proper method
          if (document.queryCommandSupported('print')) {
            $iframe[0].contentWindow.document.execCommand('print', false, null);
          } else {
            $iframe[0].contentWindow.focus();
            $iframe[0].contentWindow.print();
          }
        }

        // remove iframe after print
        if (!opt.debug) {
          setTimeout(() => {
            $iframe.remove();
          }, 1000);
        }
      }, opt.printDelay);
    }, 333);
  }


  // $.selector container
  outer() {
    // outer(dom) {
    return $($('<div></div>').html(this.clone())).html();
  }

  render() {
    return <div></div>;
  }

  /*
   * {
   debug: false,           // show the iframe for debugging
   importCSS: true,        // import parent page css
   importStyle: false,     // import style tags
   printContainer: true,   // print outer container/$.selector
   loadCSS: "",            // load an additional css file - load multiple stylesheets with an array []
   pageTitle: "",          // add title to print page
   removeInline: false,    // remove all inline styles
   printDelay: 333,        // variable print delay
   header: null,           // prefix to html
   formValues: true,        // preserve input/form values
   doctypeString: '<!DOCTYPE html>' // html doctype
   };*/

}


// 2nd way
/* let contents = $(printInfo).html();
 let frame1 = $('<iframe />');
 frame1[0].name = "frame1";
 frame1.css({"position": "absolute", "top": "-1000000px"});
 $("body").append(frame1);
 let frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
 frameDoc.document.open();
 //Create a new HTML document.
 frameDoc.document.write('<html><head><title>DIV Contents</title>');
 frameDoc.document.write('</head><body>');
 //Append the external CSS file.
 //frameDoc.document.write('<link href="style.css" rel="stylesheet" type="text/css" />');
 //Append the DIV contents.
 frameDoc.document.write(contents);
 frameDoc.document.write('</body></html>');
 frameDoc.document.close();
 setTimeout(function () {
 window.frames["frame1"].focus();
 window.frames["frame1"].print();
 frame1.remove();
 }, 500);*/
