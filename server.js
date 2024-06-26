const http = require("http");
const { v4: uuidv4 } = require("uuid");
const errHandle = require("./errorHandle");
// const todos = [];
const mongoose = require("mongoose");

// 模組
const Todo = require("./models/todo");
const getTodo = require("./getTodo");
const postTodo = require("./postTodo");
const patchTodo = require("./patchTodo");

mongoose
  .connect("mongodb://127.0.0.1:27017/todolistTeam")
  .then(() => console.log("資料庫連接成功"));

const requestListener = async (req, res) => {
  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  if (req.url == "/todos" && req.method == "GET") {
    // getTodo.js
    getTodo(req, res);
  } else if (req.url == "/todos" && req.method == "POST") {
    // postTodo.js
    req.on("end", (chunk) => {
      postTodo(req, res, body);
    });
  } else if (req.url == "/todos" && req.method == "DELETE") {
    // deleteTodo.js
  } else if (req.url.startsWith("/todos/") && req.method == "DELETE") {
    // deleteTodo.js
  } else if (req.url.startsWith("/todos/") && req.method == "PATCH") {
    req.on("end", () => {
      patchTodo(req, res, body);
    });
  } else if (req.method == "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "false",
        message: "無此網站路由",
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
