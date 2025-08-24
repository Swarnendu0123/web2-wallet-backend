const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");



const app = express();
const port = 8000;


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// ------------------------------------------------------------

const wallets = {};


// Create a wallet
app.post("/wallet/create", (req, res) => {
    const { password } = req.body;

    const id = uuidv4();


    if (wallets[id]) {
        return res.status(400).json({ message: "Wallet already exists" });
    }

    wallets[id] = {
        password,
        balance: 0,
    };

    console.log(wallets);

    res.status(201).json({ message: "Wallet created successfully", id });
});


// Get wallet details
app.post("/wallet/details/:id", (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    
    if (!wallets[id]) {
        return res.status(400).json({ message: "Wallet not found" });
    }

    if (wallets[id].password !== password) {
        return res.status(400).json({ message: "Invalid password" });
    }
    
    res.status(200).json({ message: "Wallet details fetched successfully", wallet: wallets[id] });
});


// Deposit
app.post("/wallet/deposit/:id", (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    if (!wallets[id]) {
        return res.status(400).json({ message: "Wallet not found" });
    }

    wallets[id].balance += amount;

    console.log(wallets);

    res.status(200).json({ message: "Deposit successful", wallet: wallets[id] });
})


// Transfer
app.post("/payment/transfer", (req, res) => {
    const { fromId, password, amount, toId } = req.body;
    
    if (!wallets[fromId]) {
        return res.status(400).json({ message: "From wallet not found" });
    }
    
    if (wallets[fromId].password !== password) {
        return res.status(400).json({ message: "Invalid password" });
    }

    if (!wallets[toId]) {
        return res.status(400).json({ message: "To wallet not found" });
    }
    
    if (wallets[fromId].balance < amount) {
        return res.status(400).json({ message: "Insufficient balance" });
    }

    wallets[fromId].balance -= amount;
    wallets[toId].balance += amount;

    console.log(wallets);

    res.status(200).json({ message: "Transfer successful", wallet: wallets[fromId] });
})




// ------------------------------------------------------------

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

