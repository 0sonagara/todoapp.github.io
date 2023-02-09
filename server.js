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

const sanitizeHTML = require('sanitize-html')

// mongodb jode connect karva 
// mongodb na cluster ma 'connect' ma 'add different ip address' ma 
// pella khana ma 0.0.0.0/0 -> add ip adress
// navo user banavo built in role readwrite in any database sathe
// connect to your application
// connection string copy karo 
// ema <password> ni jagya e hmna lakhelo password nakho
// navo database ane cluster banavine

const mongodb = require("mongodb")
//const ObjectId = require('mongodb').ObjectID;
const uri = "mongodb+srv://sarouser:saro@cluster0.zhlg7th.mongodb.net/?retryWrites=true&w=majority"
const client = new mongodb.MongoClient(uri)
const database = client.db("todoapp");
const itemCollection = database.collection("items");

// server ne listen karva
app.listen(3333)

// user e form ma submit karelo data access karva mate
app.use(express.json())
app.use(express.urlencoded({extended:false}))
// public naam nu ek folder banayvu chhe, eni files use karva mate
app.use(express.static("public"))
// niche form tag ma action method no matlab.
// <-- action=url, form submit thya pachhi kai url ne call karse /-->
// <-- method=POST kai method thi ee url ne call karse /-->

function passwordProtect(req,res,next){
    res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"')
    if(req.headers.authorization == "Basic bWFqYTphYXZzZQ=="){
        next()
    }
    else{
        res.status(401).send("Authentication Required.")
    }
}
app.use(passwordProtect)
// '/' url ne GET method thi call karso to response aa function pramane avse
app.get('/', function(req,res){
    // itemcollection ma find thai jaay pachhi aa then vaadu function execute thase
    // aama <ul> ni vache map function vaypru chhe, ee items array ni darek item maate <li> vado
    // html code return karse, ee by default string ma convert , thi thay pan apde join lakhine '' salang kari didhu, html maate
    // aama <script> ma javascript no code chalavi sakay
    // axios vaprva maate ek link naykhi github mathi axios ni
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
            <form id="create-form" action="/create-item" method="POST">
                <div class="d-flex align-items-center">
                <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                <button class="btn btn-primary">Add New Item</button>
                </div>
            </form>
            </div>
            
            <ul id="item-list" class="list-group pb-5">
            </ul>
            
        </div>

        <script>
        let itemss = ${JSON.stringify(items)}
        </script>

        <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
        <script src="./browser.js"> </script>
        </body>
        </html>
        `)
    })
})

app.post('/create-item',function(req,res){
    // "items" collection ma {aa object} nu document insert karo
    let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: []})
    itemCollection.insertOne({text: safeText}).then(function(info, err){
        res.json({text: safeText, _id: info.insertedId})
    })
})

app.post('/update-item',function(req,res){
    let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: []})
    itemCollection.findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)},{$set:{text: safeText}}).then(function(){
        res.send("success")
    })
})

app.post('/delete-item',function(req,res){
    itemCollection.deleteOne({_id: new mongodb.ObjectId(req.body.id)}).then(function(){
        res.redirect("/")
    })
})