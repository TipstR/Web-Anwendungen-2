const express = require("express");
const bodyParser = require("body-parser");
let jwt = require("jsonwebtoken");

const SECRET = "8c48078a76768b155b421b210c0761cd";

const checkToken = (request, response, next) => {
    console.log(request.header.toString())
    let token = request.header('Authorization');
    console.log("Checking Token: " + token);
    if (token && token.startsWith('Bearer ')) {
        // Remove 'Bearer' from string
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, SECRET, (err, decoded) => {
           if (err) {
               return response.json({
                   success: false,
                   message: "Token is not valid"
               });
           } else {
               request.decoded = decoded;
               next();
           }
        });
    } else {
        return response.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};



module.exports = {
    secret: SECRET,
    checkToken: checkToken
};
