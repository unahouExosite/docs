(function ($) {
  $(document).ready(
    function(){
      $('.header ul a').on('click', function(event) {
        event.preventDefault();
        var href = $(this).attr('href');
        href = href.replace('#', '');
        var file = '';
        Flatdoc.run({
          fetcher: Flatdoc.file(href + '.md')
        });
      })
    }
  )
})(window.jQuery)
