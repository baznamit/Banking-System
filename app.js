const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/bankDB")

const itemsSchema = {
  name: String,
  balance: Number
}

const historySchema = {
  sender: String, 
  receiver: String,
  amount: Number
}

const Customer = mongoose.model("Customer", itemsSchema)
const newTransaction = mongoose.model("Transaction", historySchema)

//creation of dummy data of customers.
const item1 = new Customer ({
  name: "Nitya",
  balance: 10000.00
})
const item2 = new Customer ({
  name: "Sanjit",
  balance: 10500.00
})
const item3 = new Customer ({
  name: "Gautam",
  balance: 19000.00
})
const item4 = new Customer ({
  name: "Divya",
  balance: 500.00
})
const item5 = new Customer ({
  name: "Pranay",
  balance: 25000.00
})

const customers = [item1, item2, item3, item4, item5]
const transactions = []

app.get('/', (req, res) => {
  Customer.find({}, (err,foundItems) => {

    if (foundItems.length === 0) {
      Customer.insertMany(customers, (err) => {
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

app.post("/customers", (req, res) => {
  Customer.find({}, (err,foundItems) => {
    res.render("viewCustomer", {listTitle: "All Customers", customerData: foundItems})
  })
})

app.post("/firstCustomer", (req, res) => {
  const cust1Name =  req.body.checkbox
  Customer.find({"name": cust1Name}, (err,foundItems) => {
    res.render("firstCustomer", {listTitle: cust1Name, custInfo: foundItems})
  })
})

app.post("/paymentSuccess", (req, res) => {
  senderName = req.body.cust1
  recieverName = req.body.cust2
  amountPaid = req.body.amount

  const transaction = new newTransaction ({
    sender: senderName,
    receiver: recieverName,
    amount: amountPaid
  })
  transaction.save()
  transactions.push(transaction)
  res.render("paymentSuccess", {})
})

app.get("/transaction-history", (req, res) => {
  newTransaction.find({}, (err,foundItems) => {
    newTransaction.insertMany(transactions, (err) => {
      res.render("history", {listTitle: "Transaction History", history: foundItems})
    })
  })
})

app.listen(3000, function() {
    console.log("Server started on port 3000");
});
