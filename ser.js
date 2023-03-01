const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const mongoose=require("mongoose");
const _=require("lodash");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');
const options={
    weekday:"long",
    day:"numeric",
    month:"long"
};
const d = new Date();
const dayName = d.toLocaleDateString("en-US",options);

const uri="mongodb+srv://nashish:oCye8OdcZ2sQFZjR@newar.o7knuw0.mongodb.net/List";
mongoose.set('strictQuery',false);
mongoose.connect(uri,{useNewUrlParser:true});
const scheme=mongoose.Schema({
    name:String
});
const data=mongoose.model("data",scheme);

const dataArr=[];


app.listen(3000,function(){
    console.log("Server Started at 3000");
});
app.get("/",function(req,res){
    
    data.find(function(err,obj){
        if(obj.length===0){
            data.insertMany(dataArr,function(err){
                if(err){
                    console.log(err);
                }
            });
        }
        res.render("list",{day:dayName,itemList:obj});
    })

});
app.get("/about",function(req,res){
    res.render("about");
})


const lscheme=mongoose.Schema({
    name:String,
    items:[scheme]
});
const List=mongoose.model("list",lscheme);
app.get("/:name",function(req,res){
    const name=_.capitalize(req.params.name);
    List.findOne({name:name},function(err,obj){
        if(!err){
            if(!obj){
                const itemDo=new List({
                    name:name,
                    items:dataArr
                });
                itemDo.save();
                res.redirect("/"+name);

            } else{
                res.render("list",{day:obj.name,itemList:obj.items});
            }
        }
        
    });
    // res.render("list",{day:name,})

});
app.post("/",function(req,res){
    const kam=req.body.item;
    const page=req.body.list;
    const dot=new data({
        name:kam
    });
    if(page===dayName){
        dot.save();
        res.redirect("/");
    }else{
        List.findOne({name:page},function(err,obj){
            if(!err){
                obj.items.push(dot);
                obj.save();
                res.redirect("/"+page);
            }
        })

    }
    
    
});
app.post("/delete",function(req,res){
    var id=req.body.box;
    var deletePage=req.body.listName;
    if(deletePage===dayName){
        data.deleteOne({_id:id},function(err){
            if(!err){
                res.redirect("/");
            }
        });
        
    }
    else{
        List.findOneAndUpdate({name:deletePage},{$pull:{items:{_id:id}}},function(err,result){
            if(!err){
                res.redirect("/"+deletePage);
            }
        });
        
    }
    
});

