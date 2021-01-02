const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const lodash = require("lodash");
const e = require("express");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine" , "ejs" );

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser : true , useUnifiedTopology : true });

const wikiScheme = {
    title:String,
    content:String
};

const Articles = mongoose.model("article" , wikiScheme);

app.route("/articles")//This is called express route chaning when a specific operation(GET,POST,etc) need to be 
//done on a single route this method of channing event handlers can be done to stop repeatation of writing the
//route again and again.
   .get((req,res)=>{
    Articles.find((err,dataFound)=>{
        if (err) {
            console.log(err);
        }
        else{
            res.send(dataFound)
        }
    })
})
    .post((req,res)=>{
    
        const newArticle = new Articles({
            title:req.body.articleTitle,
            content:req.body.content
        });
    
        newArticle.save((err)=>{
            if (err) {
                res.send(err);
            }
            else{
                res.send("Succesfully added your article.")
            }
        })
    })
    .delete( (req,res)=>{
            Articles.deleteMany((err)=>{
                if (err) {
                    res.send(err);
                }
                else{
                    res.send("Succesfully deleted all the articles");
                }
            });
        });
   
//handling a request to get a specific article

app.route("/articles/:articleName")
.get((req,res)=>{

   Articles.find({ title : req.params.articleName },(err,dataFound)=>{
       if(dataFound.length !== 0 ){
        res.send(dataFound);
       }     
       else{
           res.send("No articles were found 😔")
       }
   });
})
.put((req,res)=>{
    const articleToUpdate = req.params.articleName;
    const titleChange = req.body.title;
    const contentChange = req.body.content;
    Articles.update(
        { title : articleToUpdate },//this specifies the document to be changed
        { title : titleChange , content : contentChange },//the update you want to make to the document selected
        { overwrite:true },//this tells that the document should be completly overwritten
        (err)=>{
        if (err) {
            res.send(err);
        }
        else{
            res.send("Succesfully updated the article");
        }
    })
})
.patch((req,res)=>{
    Articles.update({title:req.params.articleName},{ $set : req.body },(err)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send("Succesfully updated the fields")
        }
    })
})
.delete((req,res)=>{
    Articles.deleteOne({ title : req.params.articleName },(err)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send("Succesfully deleted the paticular article")
        }
    })
})

app.listen(3000,()=>{
    console.log("Succesfully hosted the files on port 3000");
});