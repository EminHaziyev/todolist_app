const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');

const mongoose = require("mongoose");
mongoose.connect("<YOUR MONGODB CONNECTION URL>" , {useNewUrlParser: true});

const tododbSchema = {
    item: String
};



const listSchema = {
    name: String,
    items: [tododbSchema]
}

const Item = mongoose.model("Item" , tododbSchema);
const List = mongoose.model("List" , listSchema);

const tododefaul = new Item({
    item: "default todo text"
})








app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));





app.get("/" , (req,res) => {

    List.find().then((data) => {
        res.render('home' , {newListItems: data});
        
    })
        

})

app.post("/open" , (req,res) => {
    res.redirect("/" + req.body.ad);
})
app.get("/:customListName" , async (req,res) =>{
    const customListName  = req.params.customListName;

    const data = await List.findOne({
        name: customListName
    });
    if(!data){
        const list = new List({
            name: customListName,
            items: tododefaul
        });
        list.save();
        res.redirect("/"+customListName);
        
    }
    else{
        res.render("list" , {listTitle:  data.name , newListItems: data.items});

    }


    
})

app.post("/doc/newdoc" , (req,res) => {
    res.redirect("/" + req.body.newdoc);
})


app.post("/", async(req,res) => {
    const listItem = req.body.list;
    
    const item = new Item({
        item: req.body.newItem
    })

    const data = await List.findOne({
        name: listItem
    });
    data.items.push(item);
    data.save();
    res.redirect("/"+listItem);

    
})

app.post("/delete" , async(req,res) => {

    const listName = req.body.listName;
    await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: req.body.checkbox}}});
    res.redirect("/" + listName);
    
})



app.listen(3000, () => {
    console.log("3000-de server isleyir");
});