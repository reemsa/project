const mysql = require('mysql')
const express = require('express')
var app = express()
const body_parser = require('body-parser')
let prmpt = require('prompt');
prmpt.start();
interface product{
    Name: string
    UPC: number
    price: number
}
app.use(body_parser.json())
var mysqlConnection =  mysql.createConnection({
    host: 'localhost',
    name: 'root',
    database: 'finalproject',
    port:3306
})
function create_db_schema(mysqlConnection) {
    mysqlConnection.connect((err) => {
        console.log("done")
        if (err) throw err;
        else {
            ask()
            function display(p: product, tax_rate: number, discount: number) {
                if (discount == 0) {
                    let price =p.price+ (p.price * tax_rate)
                    tax_rate=tax_rate*100
                    console.log(`Product price reported as $ ${p.price.toFixed(2)} before tax and $${price.toFixed(2)} after ${tax_rate.toFixed(2)}% tax `)  
                }
                else {
                    let price = (p.price-(p.price*discount) )+ (p.price * tax_rate)
                tax_rate=tax_rate*100
                console.log(`Product price reported as $ ${p.price.toFixed(2)} before tax and $${price.toFixed(2)} after ${tax_rate.toFixed(2)}% tax and ${(p.price*discount).toFixed(2)}$ discount`)
                }
                ask()
            }
            function ask() {
                prmpt.get(['name', 'tax', 'discount'], function (err, result) {
                let name = result.name
                let tax = result.tax/100
                let discount = result.discount / 100
                    if (isNaN(tax)||isNaN(discount)) {
                        console.log("tax and discount must be numbers try again")
                        ask()
                    }
                    else {
                        mysqlConnection.query('SELECT * FROM `product` WHERE `Name` = ?', [result.name], (err, rows, fields) => {
                            if (!err) {
                                if (rows[0] != undefined) {
                                    console.log(rows[0].Name)
                                    console.log(rows[0].Price)
                                    console.log(rows[0].UPC) 
                                    let book: product = {
                                        Name: rows[0].Name,
                                        UPC: rows[0].UPC,
                                        price: rows[0].Price                              
                                    }
                                    display(book,tax,discount)
                                }
                                else
                                {
                                    console.log("product not exist do you want to insert it ");
                                    prmpt.get(['yes_no'], function (err, result) {
                                        if (result.yes_no == "yes") {
                                            prmpt.get(['UPC', 'Price'], function (err, result) {
                                                mysqlConnection.query(`INSERT INTO product (Name,UPC,Price) VALUES (?,?,?)`, [name,result.UPC,result.Price], (err, rows, fields) => {
                                                    if (!err) {
                                                        let book: product = {
                                                            Name: name,
                                                            UPC: parseInt(result.UPC),
                                                            price: parseInt(result.Price)                              
                                                        }
                                                        display(book,tax,discount)
                                                    }
                                           
                                                    else
                                                        console.log("insert ="+err);
                                                })
                                              })
                                        } 
                                        else {
                                            ask()
                                        }
                                      })
                              
                                 }
                            } 
                           
                        })
                    }
              })}
        }
      });
}



create_db_schema(mysqlConnection) 
