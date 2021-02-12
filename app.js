const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const {request} = require("http");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post('/', function (req, res) {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    var data = {
        members: [{
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }

        ]

    };

    const jsonData = JSON.stringify(data);
    const url = "https://us1.api.mailchimp.com/3.0/lists/listid" //add list id in list idea section
    const options = {
        method: "POST",
        auth: yourAPIKey
    }

    const request = https.request(url, options, function (response) {
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }else{
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);

    request.end();

    // console.log(firstName, lastName, email);
});

app.post("/failure", function(req, res){
    res.redirect('/')
});

app.listen(process.env.PORT || 3000, function () {
    console.log("server listening on PORT: 3000");
});
