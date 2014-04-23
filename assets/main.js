(function ($) {
  $(document).ready(
    function(){
      $('.header ul a').on('click', function(event) {
        var href = $(this).attr('href');
        // don't touch absolute addresses
        if (href.indexOf('http') == 0) {
          return;
        }
        event.preventDefault();
        href = href.replace('#', '');
        var file = '';
        Flatdoc.run({
          fetcher: Flatdoc.file(href + '.md')
        });
      });
      $(document).on('flatdoc:ready', function() {
        // make content links work in flatdoc
        $('.content a').on('click', function(event) {
          var href = $(this).attr('href');
          if (href.indexOf('http') != 0) {
            event.preventDefault();
            // don't touch anchor links
            if (href.indexOf('#') != 0) {
              if (href.indexOf('/') === href.length - 1) {
                Flatdoc.run({
                  fetcher: Flatdoc.file(href + 'README.md')
                });
              }
            } 
          }
        });
      });
  });
})(window.jQuery)
