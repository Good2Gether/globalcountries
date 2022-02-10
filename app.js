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
app.use(body_parser.json({ limit: "50mb" }));


// --VIEW LOCATONS
app.set("views", __dirname + "/public/views");
app.engine("html", require("ejs").renderFile);
app.set("veiw engine", "html");

// ROUTING
// app.get("/", function(request, response){
//     response.render("index.html")
// });

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


app.post("/subject-status", function (request, response) {
    subject_id = request.body.subject_id;
    status = request.body.status;
    subjects[subject_id] = status;
    saveDropboxSingleFile(JSON.stringify(subjects), `subject_status_${starttime}.json`)
    .then(() => console.log(`subjuct status recorded: ${subject_id},${status}`))
    .catch(err => console.log(err));
});

// -- START THE SERVER
// var server = app.listen(3000, function(){
//     console.log("listening to port %d", server.address().port);

// });


app.set('port', (process.env.PORT || 3000));


app.get("/", function (request, response) {
    response.render("index.html");
})
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

app.post("/subject-status", function (request, response) {
    subject_id = request.body.subject_id;
    status = request.body.status;
    subjects[subject_id] = status;
    saveDropboxSingleFile(JSON.stringify(subjects), `subject_status_${starttime}.json`)
    .then(() => console.log(`subjuct status recorded: ${subject_id},${status}`))
    .catch(err => console.log(err));
});


//start the server
app.listen(app.get('port'), function () {
    console.log("listening to port :", (process.env.PORT || 3000));
});
