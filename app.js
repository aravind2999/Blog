const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const ejs = require("ejs")
const app = express()
const _ = require('lodash')
app.set('view engine', 'ejs')
mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true })
//Telling to app that all static files are held in public directory
app.use(express.static("public"))

app.use(bodyParser.urlencoded({extended:true}))

const blogSchema = {
    title : String,
    writeup : String
}
const Blog = mongoose.model("Blog",blogSchema)

// let journals = []

const b1 = new Blog({
    title : "Deafult",
    writeup : "Hello, this is only a default blog. Please proceed to compose the new blogs and show your creativity in writing"
})
const defaultBlog = [b1]

app.get("/",(req,res)=>{
    Blog.find({},function(err,foundBlogs){
        if(foundBlogs.length === 0){
            Blog.insertMany(defaultBlog, function(err){
                if(err){
                    console.log(err)
                }
                else{
                    console.log("Successfull")
                }
            })
            res.redirect("/")
        }
        else{
            res.render("home", { journals: foundBlogs })
        }
        
    })

    
})
app.get("/about",(req,res) => {
    res.render("about")
})
app.get("/contact", (req, res) => {
    res.render("contact")
})
//Express route parameters => Dynamic Routing
app.get("/post/:topic",(req,res) => {
    const requestedTitle = _.lowerCase(req.params.topic)
    Blog.find({}, function (err, foundBlogs){
        if(foundBlogs.length === 0){
            console.log(err)
        }
        else{
            foundBlogs.forEach(function (journal) {
                const storedTitle = _.lowerCase(journal.title)
                if (storedTitle === requestedTitle) {
                    res.render("posts", {
                        title: journal.title,
                        writeup: journal.writeup
                    })
                }
            })
        }

    })


})
app.get("/compose", (req, res) => {
    res.render("compose")
})
app.post("/compose",(req,res) => {
    const journal = new Blog({
        title : req.body.title,
        writeup : req.body.writeup
    })
    // journals.push(journal)
    journal.save()
    res.redirect("/")

})


app.listen(3000,function(){
    console.log("Server started at port 3000")
})

