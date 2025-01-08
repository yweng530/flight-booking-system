const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
var conn = mysql.createConnection({
 host:"35.188.34.75",
 user: 'root',
 password:'test1234',
 database:'test1',
})
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

conn.connect;

// stored procedure
app.get("/procedure", (req, res)=>{
        let sql = `CALL new_procedure()`;
        conn.query(sql, function(err, results){
                if (err) {
                        console.log(err);
                } else {
                        res.json(results);
                }
        })
});

app.get('/', (req, res)=>{
        res.send("Hello friend")
});

app.post("/insert", (req, res)=>{
        const userID = req.body.UserID;
        const username = req.body.UserName;
        const password = req.body.Password;
        const sqlInsert = "insert into `Passenger` values (?, ?, ?)";
        conn.query(sqlInsert, [userID, username, password], (err, result)=>{
                if(err) {
                        console.log(err);
                } else {
                        res.json(result);
                }
        })
});

app.get('/get', (req, res)=>{
        var sqlGet = "SELECT * FROM Passenger";
        conn.query(sqlGet, function(error, results){
                if (error) {
                        console.log(err);
                }
                else {
                        res.json(results);
                }
        });
})

app.delete("/delete/:userID", (req, res)=>{
        const id = req.params.userID;
        var sqlDelete = "delete from `Passenger` where userID = ?";
        conn.query(sqlDelete, id, (err, result)=>{
                if (err) {
                        console.log(err);
                } else {
                        res.json(result);
                }
        });
});


app.put("/update", (req, res)=>{
        const userID = req.body.userID;
        const password = req.body.password;
        const new_password = req.body.new_password;
        var sqlUpdate = "update `Passenger` set password = ? where userID = ? and password = ?";
        conn.query(sqlUpdate, [new_password, userID, password], (error, result)=> {
                if (error) {
                        console.log(err);
                } else {
                        res.json(result)
                }
        });
});


app.get("/search/:userID", (req, res)=>{
        const userID = req.params.userID;
        var sqlSearch = "select * from `Passenger` where UserID = ?";
        conn.query(sqlSearch, userID, function(error, results){
                if (error) {
                        console.log(err);
                }
                else {
                        res.json(results);
                };
        });
});

// Calculate min ticket price for first class in specific flight which has less than 4 stops
app.get("/minPrice", (req, res)=>{
        var minPriceQuery = "SELECT FlightCode, MIN(TicketPrice) FROM Ticket NATURAL JOIN Flight WHERE TicketClass = 1 AND NumberOfStops < 4 GROUP BY FlightCode LIMIT 15";
        conn.query(minPriceQuery, function(err, results){
                if (err) {
                        console.log(err);
                } else {
                        res.json(results);
                }
        })
});

// find the flight code of the flights and their airline companies, and ArrivalTime, where this flight departs at __ city and arrives at __ city with less than 2 stops.
app.get("/flight", (req, res)=>{
        var flightQuery = "SELECT f.FlightCode, al.Name, ArrivalTime FROM Flight f NATURAL JOIN AirlineCompany al JOIN Airport ap1 ON f.DepartingAirportID = ap1.AirportID JOIN Airport ap2 ON f.ArrivingAirportID = ap2.AirportID WHERE DepartingAirportID IN (SELECT AirportID FROM Airport WHERE City = 'Shanghai') AND ArrivingAirportID IN (SELECT AirportID FROM Airport WHERE City = 'Beijing') AND NumberOfStops < 2 ORDER BY ArrivalTime ASC LIMIT 15";
        conn.query(flightQuery, function(err, results){
                if (err) {
                        console.log(err);
                } else {
                        res.json(results);
                }
        })
});

app.listen(3001, () => {
        console.log("your server is running on port 3001");
      });