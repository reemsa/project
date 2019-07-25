var mysql = require('mysql');
var express = require('express');
var app = express();
var body_parser = require('body-parser');
var prmpt = require('prompt');
prmpt.start();
app.use(body_parser.json());
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    name: 'root',
    database: 'finalproject',
    port: 3306
});
function create_db_schema(mysqlConnection) {
    mysqlConnection.connect(function (err) {
        console.log("done");
        if (err)
            throw err;
        else {
            ask();
            function display(p, tax_rate) {
                var price = p.price + (p.price * tax_rate);
                tax_rate = tax_rate * 100;
                console.log("Product price reported as $ " + p.price.toFixed(2) + " before tax and $" + price.toFixed(2) + " after " + tax_rate.toFixed(2) + "% tax ");
                ask();
            }
            function ask() {
                prmpt.get(['name', 'tax'], function (err, result) {
                    var name = result.name;
                    var tax = result.tax / 100;
                    if (isNaN(tax)) {
                        console.log("tax  must be numbers try again");
                        ask();
                    }
                    else {
                        mysqlConnection.query('SELECT * FROM `product` WHERE `Name` = ?', [result.name], function (err, rows, fields) {
                            if (!err) {
                                if (rows[0] != undefined) {
                                    console.log(rows[0].Name);
                                    console.log(rows[0].Price);
                                    console.log(rows[0].UPC);
                                    var book = {
                                        Name: rows[0].Name,
                                        UPC: rows[0].UPC,
                                        price: rows[0].Price
                                    };
                                    display(book, tax);
                                }
                                else {
                                    console.log("product not exist do you want to insert it ");
                                    prmpt.get(['yes_no'], function (err, result) {
                                        if (result.yes_no == "yes") {
                                            prmpt.get(['UPC', 'Price'], function (err, result) {
                                                mysqlConnection.query("INSERT INTO product (Name,UPC,Price) VALUES (?,?,?)", [name, result.UPC, result.Price], function (err, rows, fields) {
                                                    if (!err) {
                                                        var book = {
                                                            Name: name,
                                                            UPC: parseInt(result.UPC),
                                                            price: parseInt(result.Price)
                                                        };
                                                        display(book, tax);
                                                    }
                                                    else
                                                        console.log("insert =" + err);
                                                });
                                            });
                                        }
                                        else {
                                            ask();
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        }
    });
}
create_db_schema(mysqlConnection);
