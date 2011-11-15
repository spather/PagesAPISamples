(function(window, undefined) {
  if (!window.PAGES_API_TEST) {
    window.PAGES_API_TEST = {};  
  }
  
  var namespace = window.PAGES_API_TEST;
  
  namespace.ViewController = {

    pagesHelper: namespace.PagesHelper,
    
    createPagesList: function(userID) {
      this.pagesHelper.getPagesForUser(userID, function(data) {
        $('#pages-list').empty();

        $.each(data, function(index, value) {
          if (value.category !== 'Application') {
            var link = $('<a />')
              .addClass('page-link')
              .attr('href', '#')
              .attr('id', value.id)
              .text(value.name);

            var li = $('<li />');
            li.append(link);

            $('#pages-list').append(li);
            
            $('#' + value.id)
              .click(namespace.ViewController.onSelectedPage);
          }
        });
      });    
    },

    onSelectedPage: function(eventObject) {
      var vc = namespace.ViewController; 

      vc.pageName = eventObject.target.text;
      vc.pageID = eventObject.target.id;
      vc.pageID = '172013249547827'; // PREVENT STUPIDITY. Always post to test page. TODO
    
      // Get the page's access token.
      vc.pagesHelper.getPageAccessToken(
        vc.pageID,
        function(data) {
          vc.pageAccessToken = data.access_token;

          $('.post-section-wrapper').removeClass('hidden');
          
          $('div.post-section-wrapper-title span#title-message')
            .text('Posting to ' + vc.pageName + ' with access token ' 
                  + vc.pageAccessToken);
        });
    },
  
    setupButtonHandlers: function() {
      var vc = namespace.ViewController;

      $('#post-status-button').click(function() {
        var message = $('#post-status-message-input').val();
        vc.pagesHelper.postStatus(
          vc.pageID,
          vc.pageAccessToken,
          message,
          vc.displaySuccessResponse,
          vc.displayErrorResponse);
      });
  
      $('#post-link-button').click(function() {
        var url = $('#post-link-url-input').val();
        var message = $('#post-link-message-input').val();
        
        vc.pagesHelper.postLink(
          vc.pageID,
          vc.pageAccessToken,
          url,
          message,
          vc.displaySuccessResponse,
          vc.displayErrorResponse);        
      });
  
      $('#post-photo-button').click(function() {        
        var message = $('#post-photo-message-input').val();
        var file = $('#post-photo-file-input').get(0).files[0];
        
        vc.pagesHelper.postPhoto(
          vc.pageID,
          vc.pageAccessToken,
          file,
          message,
          vc.displaySuccessResponse,
          vc.displayErrorResponse);
      });
    },
    
    displaySuccessResponse: function(response) {
      $('#id-result-message')
        .text('New post id is ' + response.id);
    },

    displayErrorResponse: function(response) {
      $('#id-result-message')
        .text('An error occurred: ' + response.error);
    },
  }
})(window);