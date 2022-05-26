const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const app = express()
const _ = require('lodash')
app.set('view engine', 'ejs')

//Telling to app that all static files are held in public directory
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

let journals = []

app.get("/",(req,res)=>{
    res.render("home",{journals : journals} )
})
app.get("/about",(req,res) => {
    res.render("about")
})
app.get("/contact", (req, res) => {
    res.render("contact")
})
app.get("/post/:topic",(req,res) => {
    const requestedTitle = _.lowerCase(req.params.topic)
    journals.forEach(function(journal){
        const storedTitle = _.lowerCase(journal.title)
        if(storedTitle === requestedTitle){
            res.render("posts",{
                title : journal.title,
                writeup : journal.writeup
            })
        }
    })

})
app.get("/compose", (req, res) => {
    res.render("compose")
})
app.post("/compose",(req,res) => {
    const journal = {
        title : req.body.title,
        writeup : req.body.writeup
    }
    journals.push(journal)
    res.redirect("/")

})


app.listen(3000,function(){
    console.log("Server started at port 3000")
})

