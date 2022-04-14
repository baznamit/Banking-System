const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/customersDB")

const itemsSchema = {
  name: String,
  balance: Number
}

const Item = mongoose.model("Item", itemsSchema)

//creation of dummy data of customers.
const item1 = new Item ({
  name: "John",
  balance: 10000.00
})
const item2 = new Item ({
  name: "Steven ",
  balance: 10500.00
})
const item3 = new Item ({
  name: "Susan",
  balance: 19000.00
})
const item4 = new Item ({
  name: "Ruby",
  balance: 500.00
})
const item5 = new Item ({
  name: "Jackson",
  balance: 25000.00
})

const customers = [item1, item2, item3, item4, item5]

app.get('/', (req, res) => {
  Item.find({}, (err,foundItems) => {

    if (foundItems.length === 0) {
      Item.insertMany(customers, (err) => {
        if (err) {
          console.log(err)
        } 
        else {
          console.log("Saved items to database successfully!")
        }
        res.redirect("/")
      })
    }
    else {
      res.render("home", {})
    }
  })
})

app.get("/customers", (req, res) => {
  Item.find({}, (err,foundItems) => {
    res.render("viewCustomer", {listTitle: "All Customers", newListItems: foundItems})
  })
})

app.listen(3000, function() {
    console.log("Server started on port 3000");
});
