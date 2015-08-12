var mongoose = require('mongoose');
//Schema
var OrderSchema = new mongoose.Schema({
	hotel:{name:String,email: String},
    menu:{        name: String,        no_of_order:Number    },
    customer:{        name: String,        phone: Number,        email: String,        
        address:{addressLine1:String,addressLine2:String,street:String, LandMark:String, areaName:String,city:String, zip:String, latitude:Number,longitude:Number }
    }
});

//Model
var OrderModel = mongoose.model( 'Order', OrderSchema );

module.exports = OrderModel;