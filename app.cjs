// jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fname;
    const LastName = req.body.Lname;
    const email = req.body.email

    const data = {
        members: [
            {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: LastName
           }
    }]
    }
    const jsondata =JSON.stringify(data);
    // gets us data from other website, https.get used when we want data from external resourse
    const url = "https://us21.api.mailchimp.com/3.0/lists/62f9646491"
    const options = {
        method: "POST",
        auth: "prachi:456a190377227d034212e1f6b8fe7c28-us21"
    }
    const request = https.request(url,options, function(response){

    if (response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
    }
    else{
        res.sendFile(__dirname + "/failure.html");
    }
        response.on("data" , function(data){
            console.log(JSON.parse(data));
        })

    })
    request.write(jsondata);
    request.end()

})
app.post("/failure", function(req , res){   
    res.redirect("/")
})

app.listen(4000, function(){
    console.log("server running on port 4000");
});

// API key: 456a190377227d034212e1f6b8fe7c28-us21
//list id:  62f9646491