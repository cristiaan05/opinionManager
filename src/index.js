'use strict'
const mongoose= require("mongoose");
const app= require("./app");

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/opinionManager',{useNewUrlParser:true}).then(()=>{
    console.log('Successfully connection with database.');

    app.set('port', process.env.PORT || 3000);
    app.listen(app.get('port'),()=>{
        console.log(`Server runs on port:'${app.get('port')}'`);
    })
}).catch(err => console.log(err));