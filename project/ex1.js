var mysql = require('mysql');
var express = require('express');
var app = express();
var body_parser = require('body-parser');
var prmpt = require('prompt');
var alltax;
var productname;
prmpt.start();
function display(p, tax_rate) {
    var price = p.price + (p.price * tax_rate);
    tax_rate = tax_rate * 100;
    console.log("Product price reported as $ " + p.price.toFixed(2) + " before tax and $" + price.toFixed(2) + " after " + tax_rate.toFixed(2) + "% tax ");
    ask();
}
function ask() {
    console.log("if you want to change all tax rate enter 1 if you want to get product price enter 2");
    prmpt.get(['one_two'], function (err, result) {
        if (result.one_two == "1") {
            console.log("enter new value of tax rate");
            prmpt.get(['tax'], function (err, result) {
                alltax = result.tax / 100;
                console.log("tax rate changed");
                prmpt.get(['name'], function (err, result) {
                    productname = result.name;
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
                                display(book, alltax);
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
                                                    display(book, alltax);
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
                });
            });
        }
        else {
            prmpt.get(['name'], function (err, result) {
                productname = result.name;
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
                            display(book, alltax);
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
                                                display(book, alltax);
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
            });
        }
    });
}
function first() {
    prmpt.get(['tax'], function (err, result) {
        alltax = result.tax / 100;
        if (isNaN(alltax)) {
            console.log("tax  must be numbers try again");
            first();
        }
        else {
            ask();
        }
    });
}
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
            first();
        }
    });
}
create_db_schema(mysqlConnection);
