(function(window, undefined) {
  if (!window.PAGES_API_TEST) {
    window.PAGES_API_TEST = {};  
  }
  
  var namespace = window.PAGES_API_TEST;

  namespace.PagesHelper = {
    getPagesForUser: function(userID, handler, errorHandler) {
      this.invokeGetApi(
        '/' + userID + '/accounts', 
        handler, 
        errorHandler);
    },

    getPageAccessToken: function(pageID, handler, errorHandler) {
      this.invokeGetApi(
        '/' + pageID + '?fields=access_token',
        handler, 
        errorHandler);
    },

    postStatus: function(pageID, accessToken, message, handler, errorHandler) {
      this.invokePostApi(
        '/' + pageID + '/feed',
        {
          'message': message,
          'access_token': accessToken
        }, 
        handler, 
        errorHandler);
    },

    
    postLink: function(pageID, accessToken, url, message, handler, errorHandler) {
      this.invokePostApi(
        '/' + pageID + '/feed',
        {
          'link': url,
          'message': message,
          'access_token': accessToken
        }, 
        handler, 
        errorHandler);      
    },

    postPhoto: function(pageID, accessToken, photoFile, message, handler, errorHandler) {      
      var formdata = new FormData();
      formdata.append('source', photoFile);
      formdata.append('message', message);
      formdata.append('access_token', accessToken);
      
      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://graph.facebook.com/'+ pageID + '/photos');
    
      xhr.onreadystatechange = function(e) {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            var response = eval('(' + xhr.responseText + ')');
            handler(response);
          } else {
            errorHandler(response);
          }
        }
      };

      xhr.send(formdata);
    },
    
    
    invokeGetApi: function(uri, handler, errorHandler) {
      FB.api(
        uri, 
        this.getResponseFunc(handler, errorHandler));
    },

    invokePostApi: function(uri, data, handler, errorHandler) {
      FB.api(
        uri, 
        'post',
        data,
        this.getResponseFunc(handler, errorHandler));
    },

    getResponseFunc: function(handler, errorHandler) {
      return function(response) {
        if (response && !response.error) {            
          if (response.data) {
            handler(response.data);
          } else {
            handler(response);
          }
        } else if (errorHandler && (!response || response.error)) {
          errorHandler(response); 
        } 
      }
    }

  }


})(window);