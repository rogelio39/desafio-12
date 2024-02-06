import {Schema, model} from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import { cartModel } from './carts.models.js';


const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: false,
        index : true
    },
    age : {
        type: Number 
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
        required: true
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'carts'
    },
    rol:{
        type: String,
        default:'user'
    },
    last_connection: {
        type : Date,
        default: Date.now
    },
    documents:[{
        name: String,
        reference: String
    }]

})


userSchema.plugin(paginate); //implementar el metodo paginate en el schema

userSchema.pre('save', async function(next) {
    if (!this.cart) {
        try {
            const newCart = await cartModel.create({});
            this.cart = newCart._id;
        } catch(error) {
            // Manejar el error adecuadamente, posiblemente lanzando una excepción
            next(error);
        }
    }
    next();
});


userSchema.pre(['save', 'findOneAndUpdate'], function(next) {
    this.last_connection = Date.now();
    next();
});

export const userModel = model('user', userSchema); //userModel seria igual al modelo de mi base de datos.
