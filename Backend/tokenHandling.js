const express = require("express");
const bodyParser = require("body-parser");
let jwt = require("jsonwebtoken");

const SECRET = "8c48078a76768b155b421b210c0761cd";

const checkToken = (request, response, next) => {
    console.log("Request Headers:");
    const headerNames = Object.keys(request.headers);
    headerNames.forEach(name => {
        const value = request.headers[name];
        console.log(name + ": " + value);
    });

    let token = request.headers['authorization'];
    console.log("Checking Token: " + token);
    if (token && token.startsWith('Bearer ')) {
        // Remove 'Bearer' from string
        token = token.slice(7, token.length);
    }

    if (token) {
        jwt.verify(token, SECRET, (err, decoded) => {
           if (err) {
               console.log("Token is not valid");
               return response.json({
                   success: false,
                   message: "Token is not valid"
               });
           } else {
               console.log("Token is valid");
               request.decoded = decoded;
               next();
           }
        });
    } else {
        console.log("Auth token is not supplied");
        return response.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};


function decodeToken(token) {
    return jwt.decode(token, {complete: true}).payload.id.toString();
}



module.exports = {
    checkToken: checkToken,
    secret: SECRET
};
