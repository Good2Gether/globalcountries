// --LOAD MODULESS 
var express = require("express"),
    mymods = require("./scripts/mymods.js"),
    body_parser = require("body-parser");

var saveDropbox = mymods.saveDropbox;

// --INSTANTIATE THE APP
var app = express();

// --STATCI MIDDLEWARE
app.use(express.static(__dirname + '/public'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/dist", express.static(__dirname + '/dist'));
app.use("/scripts", express.static(__dirname + '/scripts'));


// --VIEW LOCATONS
app.set("views", __dirname + "/public/views");
app.engine("html", require("ejs").renderFile);
app.set("veiw engine", "html");

// ROUTING
app.get("/", function(request, response){
    response.render("index.html")
});

app.post("/data", function (request, response) {
    //convert json to csv
    request.setTimeout(0);
    // DATA_CSV = json2csv(request.body);
    data = request.body;
    id = data[0].subject;
    // id = row[1].split(",")[Id_index];
    id = id.replace(/'/g, "");
    var currentdate = new Date();
    filename = Number(currentdate) + ".json";
    foldername = id;
    data = JSON.stringify(data);
    saveDropbox(data, filename, foldername).catch(err => console.log(err))
}
);
// -- START THE SERVER
var server = app.listen(3000, function(){
    console.log("listening to port %d", server.address().port);

});