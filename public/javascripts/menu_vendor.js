
function menu_vendor(param)
{
  
   console.log("vendor.js  -0--");
    var url = "/vendor/menu/";
    url = url + param;
    console.log(url);
    $.get(url,
      postData,
      function(data, textStatus, jqXHR)
      {
       console.log("vl 1")
        var trHTML = '';
        $.each(data, function (i, item) {

           if(item.customer != null)
              trHTML += '<tr><td>' + item.name + '</td><td>' + item.price + '</td></tr>' ;
        
         //    trHTML +='/tr';  
        });
        $('#t02').append(trHTML);
          //data - JSON object from server.
      },"json").fail(function(jqXHR, textStatus, errorThrown) 
          {
    console.log(textStatus);
    console.log(errorThrown); 
      });
  //  });
}
