// npm init -y
// npm install express

// npm install nodemon
// package.json ma scripts ma add karo
// "watch": "nodemon server"
// terminal ma npm run watch

// npm install mongodb

//express ne node ma vaprva mate
let express = require('express')
// let mongodb = require("mongodb");

// express ni madad thi "app" naam nu server banavva
let app = express()

// mongodb jode connect karva 
// mongodb na cluster ma 'connect' ma 'add different ip address' ma 
// pella khana ma 0.0.0.0/0 -> add ip adress
// navo user banavo built in role readwrite in any database sathe
// connect to your application
// connection string copy karo 
// ema <password> ni jagya e hmna lakhelo password nakho
// navo database ane cluster banavine

const {MongoClient} = require('mongodb')
const uri = "mongodb+srv://sarouser:saro@cluster0.zhlg7th.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(uri)
const database = client.db("todoapp");
const itemCollection = database.collection("items");

// server ne listen karva
app.listen(3333)

// user e form ma submit karelo data access karva mate
app.use(express.urlencoded({extended:false}))

// niche form tag ma action method no matlab.
// <-- action=url, form submit thya pachhi kai url ne call karse /-->
// <-- methin=POST kai method thi ee url ne call karse /-->

// '/' url ne GET method thi call karso to response aa function pramane avse
app.get('/',function(req,res){
    itemCollection.find().toArray().then(function(items,err){
        res.send(`
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple To-Do App</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
        </head>
        <body>
        <div class="container">
            <h1 class="display-4 text-center py-1">To-Do App</h1>
            
            <div class="jumbotron p-3 shadow-sm">
            <form action="/create-item" method="POST">
                <div class="d-flex align-items-center">
                <input name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                <button class="btn btn-primary">Add New Item</button>
                </div>
            </form>
            </div>
            
            <ul class="list-group pb-5">
                ${items.map(function(item){
                    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                    <span class="item-text">${item.text}</span>
                    <div>
                    <button class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                    <button class="delete-me btn btn-danger btn-sm">Delete</button>
                    </div>
                    </li>`
                }).join('')}
            </ul>
            
        </div>
        
        </body>
        </html>
        `)
    })
})

app.post('/create-item',function(req,res){
    // "items" collection ma {aa object} nu document insert karo
    itemCollection.insertOne({text: req.body.item}).then(function(){
        res.redirect('/')
    })
})
