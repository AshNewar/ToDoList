const express=require("express");
const bodyParser=require("body-parser");
const app=express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
var items=[];
var item="";
app.listen(3000,function(){
    console.log("started");
});
app.get("/",function(req,res){
    var day=new Date();
    var option={
        weekday:"long",
        day:"numeric",
        month:"short"
    }
    var dayName=day.toLocaleDateString("en-US",option);
    res.render("list2",{day:dayName,itemList:items});

});
app.post("/",function(req,res){
    item=req.body.item;
    items.push(item);
    res.redirect("/");
})