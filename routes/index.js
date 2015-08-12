var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var OrderModel = require('../models/vendorOrder');
var VendorInfoModel = require('../models/vendorInfo');
var router = express.Router();


router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

router.get('/menu', function (req, res) {
    res.render('menu', { user : req.user });
});

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.get('/orders', function (req, res) {
    res.render('invoice_list', { user : req.user });
});

router.get('/menus', function (req, res) {
    res.render('menu_list', { user : req.user });
});

router.post('/register', function(req, res, next) {
  console.log(req.body.City);
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }
          console.log("aunthiticate 1");
          storeVendorInfo(req,res,function(req,res){
           console.log("aunthiticate 2");
        passport.authenticate('local')(req, res, function () {

            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
      });
    });
});
function storeVendorInfo(request,response,callback)
{
console.log("storeVendorInfo");
 // var vendorInfo = new VendorInfoModel({
 //        hotel:{name:request.body.name,email:request.body.username},
 //        menu:[{name: "Idly",  price:10},{name: "Dosa",  price:10}],
 //       address:{addressLine1:"String",addressLine2:"String",street:"String", LandMark:"String", areaName:"String",city:"String", zip:"String", latitude:123,longitude:321 },
 //        phone:request.body.phone 
 //      });
 var vendorInfo = new VendorInfoModel({
        hotel:{name:request.body.Name,email:request.body.username},
        menu:[{name: "Idly",  price:10},{name: "Dosa",  price:10}],
       address:{addressLine1:request.body.Address1,addressLine2:request.body.Address2,street:request.body.street, LandMark:request.body.Landmark, areaName:request.body.Areaname,city:request.body.City, zip:request.body.zip, latitude:123,longitude:321 },
        phone:request.body.phone 
      });
      vendorInfo.save( function( err ) {
        if( !err ) {
            console.log( 'storeVendorInfo created' );
            callback(request,response);
            return ;
        } else {
         console.log( 'storeVendorInfo error' );
            console.log( err );
            return response.send('ERROR');
        }
    });
}


router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/orders');
    });
});

router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});



router.get( '/vendor/city/:id', function( request, response ) {
    return VendorInfoModel.find({ 'address.city':request.params.id},function( err, vendor ) {
        if( !err ) {
            return response.send( vendor );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});

router.get( '/vendor/account/all', function( request, response ) {
    return VendorInfoModel.find(function( err, order ) {
        if( !err ) {
            return response.send( order );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});
router.get( '/vendor/account/:id', function( request, response ) {
  // OrderModel.findById( request.params.id, function( err, book ) 
     console.log("dasd");
  console.log(request.params.id);
   // return OrderModel.find({ customer:{email:'daya@gmail.com'}},function( err, order ) {
     return VendorInfoModel.find({ 'hotel.email':request.params.id},function( err, order ) {
        if( !err ) {
            return response.send( order );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
 // });
});

router.get( '/vendor/list/:id', function( request, response ) {
  // OrderModel.findById( request.params.id, function( err, book ) 
     console.log("dasd");
  console.log(request.params.id);
   // return OrderModel.find({ customer:{email:'daya@gmail.com'}},function( err, order ) {
     return OrderModel.find({ 'hotel.email':request.params.id},function( err, order ) {
        if( !err ) {
            return response.send( order );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
 // });
});
router.get( '/vendor/list/all', function( request, response ) {
    return OrderModel.find(function( err, order ) {
        if( !err ) {
            return response.send( order );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
});

router.post( '/vendor/list', function( request, response ) {

console.log(request.body);

console.log( request.body.hotel.name);
    var order = new OrderModel({
        hotel:{name:request.body.hotel.name,email:request.body.hotel.email},
        customer: {name: request.body.customer.name, email: request.body.customer.email, phone: request.body.customer.phone,  Address: "daya"},
        menu:{name: request.body.menu.name, no_of_order: request.body.menu.no_of_order }       });
 
    console.log(request.body);
    order.save( function( err ) {
        if( !err ) {
            console.log( 'created' );
            return response.send( order );
        } else {
         console.log( 'error' );
            console.log( err );
            return response.send('ERROR');
        }
    });
});

router.get( '/vendor/order/summary', function( req, res ) {
   OrderModel.aggregate(
   {$group:{_id: '$menu.name',total:{$sum :'$menu.no_of_order'}}},
      function (err, summary) {
        console.log("k1");
        if(err){
  console.log("k12");
            return res.send(500, { error: err }); 
        }

        if(summary) {
              console.log("k13");
            return res.send(summary);
        } else {
              console.log("k14");
            res.send(500, { error: 'couldnt find expenses' }); 
        }
          console.log("k15");
    }
    )
});

router.get( '/vendor/order/summary/:id', function( request, res ) {
   OrderModel.aggregate(
   [
    {$match: { 'hotel.email': request.params.id } },
    {$group:{_id: '$menu.name',total:{$sum :'$menu.no_of_order'}}}
   ],
      function (err, summary) {
        console.log("k1");
        if(err){
  console.log("k12");
            return res.send(500, { error: err }); 
        }

        if(summary) {
              console.log("k13");
            return res.send(summary);
        } else {
              console.log("k14");
            res.send(500, { error: 'couldnt find expenses' }); 
        }
          console.log("k15");
    }
    )
});

router.post( '/vendor/list2', function( request, response ) {

    // var order = new OrderModel({
    //     customer: {name: request.body.name, email: request.body.email, phone: request.body.phone,  Address: "daya"},
    //     menu:{name: request.body.menu, no_of_order: request.body.no_of_order }       });
     var order = new OrderModel({
        customer: {name: "daya", email: "daya@gmail.com", phone: 1234,  Address: "daya"},
        menu:{name:" request.body.menu", no_of_order: 123 }       });

    console.log(request.body);
    order.save( function( err ) {
        if( !err ) {
            console.log( 'created' );
            return response.send( order );
        } else {
         console.log( 'error' );
            console.log( err );
            return response.send('ERROR');
        }
    });
});
//Delete a book
router.delete( '/vendor/list', function( request, response ) {
  //  ExampleModel.findById( request.params.id, function( err, book ) {
        return OrderModel.remove( {},function( err ) {
            if( !err ) {
                console.log( 'Book removed' );
                return response.send( '' );
            } else {
                console.log( err );
                return response.send('ERROR');
            }
        });
    //});
});
// //Delete a book
// app.delete( '/api/books/:id', function( request, response ) {
//     ExampleModel.findById( request.params.id, function( err, book ) {
//         return book.remove( function( err ) {
//             if( !err ) {
//                 console.log( 'Book removed' );
//                 return response.send( '' );
//             } else {
//                 console.log( err );
//                 return response.send('ERROR');
//             }
//         });
//     });
// });

module.exports = router;



// router.get( '/vendor/list2', function( request, response ) {
//     var data1 =[  
//    {  
//       "customer":{  
//          "name":"dayasudhan",
//          "email":"dayasudhan@gmail.com",
//          "phone":"123456"
//       }
//    },
//    {  
//       "customer":{  
//          "name":"devrajkg",
//          "email":"daya@gmail.com",
//          "phone":"123456"
//       }
//    }
// ];
// response.send(data1);
// });

router.post( '/vendor/menu/:id', function( request, response ) {
  // OrderModel.findById( request.params.id, function( err, book ) 
     console.log("post /vendor/menu/");
     console.log(request.body);
  console.log(request.params.id);
   // return OrderModel.find({ customer:{email:'daya@gmail.com'}},function( err, order ) {
     return VendorInfoModel.update({ 'hotel.email':request.params.id},{ $addToSet: {menu: {$each:[{name: request.body.fooditem,  price:request.body.foodprice}] }}},function( err, order ) {
        if( !err ) {
            console.log("no error");
            console.log(order);
            return response.send( order );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
 // });
});

router.get( '/vendor/menu/:id', function( request, response ) {
  // OrderModel.findById( request.params.id, function( err, book ) 
     console.log("get /vendor/menu/");
  console.log(request.params.id);
   // return OrderModel.find({ customer:{email:'daya@gmail.com'}},function( err, order ) {
     return VendorInfoModel.find({ 'hotel.email':request.params.id},function( err, vendorinfo ) {
        if( !err ) {
             console.log("no error");
            console.log(vendorinfo[0].phone);
            return response.send( vendorinfo[0].menu );
        } else {
            console.log( err );
            return response.send('ERROR');
        }
    });
 // });
});

//unregister a book
router.delete( '/vendor/unregister/:id', function( request, response ) {
  //  ExampleModel.findById( request.params.id, function( err, book ) {
        return VendorInfoModel.remove( { 'hotel.email':request.params.id},function( err ) {
            if( !err ) {
                console.log( 'Book removed' );
                return response.send( '' );
            } else {
                console.log( err );
                return response.send('ERROR');
            }
        });
    //});
});

//Delete a menu item
router.delete( '/vendor/menu/item/:id', function( request, response ) {
  //  ExampleModel.findById( request.params.id, function( err, book ) {
        return VendorInfoModel.update( { 'hotel.email':request.params.id},{ $pull: {menu: {"name": request.body.fooditem }}},function( err ) {
            if( !err ) {
                console.log( 'Book removed' );
                return response.send( '' );
            } else {
                console.log( err );
                return response.send('ERROR');
            }
        });
    //});
});