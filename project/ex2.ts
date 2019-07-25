const mysql = require('mysql')
const express = require('express')
var app = express()
const body_parser = require('body-parser')
let prmpt = require('prompt');
let alltax
let alldiscount
let productname
prmpt.start();
interface product{
    Name: string
    UPC: number
    price: number
}
function display(p: product, tax_rate: number, discount:number) {
    let price = (p.price-(p.price*discount) )+ (p.price * tax_rate)
    tax_rate = tax_rate * 100
    discount=discount*100
    console.log(`Product price reported as $ ${p.price.toFixed(2)} before tax and $${price.toFixed(2)} after ${tax_rate.toFixed(2)}% tax and ${discount.toFixed(2)}$ discount`)
    ask()
}
function ask() {
        console.log("if you want to change all tax rate and discount rate enter 1 if you want to get product price enter 2")
        prmpt.get(['one_two'], function (err, result) {
            if (result.one_two == "1") {
                console.log("enter new value of tax rate and discount rate")
                prmpt.get(['tax','discount'], function (err, result) {
                    alltax = result.tax / 100
                    alldiscount=result.discount/100
                    console.log("tax and discount rate changed")
                    prmpt.get(['name'], function (err, result) {
                        productname = result.name
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
                                    display(book,alltax,alldiscount)
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
                                                        display(book,alltax,alldiscount)
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
                      })
                  })
            }
            else {
                prmpt.get(['name'], function (err, result) {
                    productname = result.name
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
                                display(book,alltax,alldiscount)
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
                                                    display(book,alltax,alldiscount)
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
                  })
            }
         
          })
       
}
function first(){
    prmpt.get(['tax','discount'], function (err, result) {
        alltax = result.tax / 100
        alldiscount=result.discount/100
            if (isNaN(alltax)||isNaN(alldiscount)) {
                console.log("tax  must be numbers try again")
                first()
        }
            else {
                ask()    
        }
            
      })
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
            first()           
        }
      });
}



create_db_schema(mysqlConnection) 
