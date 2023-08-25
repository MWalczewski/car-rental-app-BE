const fs = require("fs");
const bodyParser = require("body-parser");
const jsonServer = require("json-server");
const jwt = require("jsonwebtoken");

const server = jsonServer.create();
const userdb = JSON.parse(fs.readFileSync("./users.json", "utf-8"));

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(jsonServer.defaults());

const SECRET_KEY = "72676376";

const expiresIn = "1h";

function createToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
}

function isLoginAuthenticated({ username, password }) {
  return (
    userdb.users.findIndex(
      (user) => user.username === username && user.password === password
    ) !== -1
  );
}

// Registration logic
// function isRegisterAuthenticated({ username }) {
//   return userdb.users.findIndex((user) => user.username === username) !== -1;
// }

// server.post("/api/auth/register", (req, res) => {
//   const { username, password } = req.body;
//   if (isRegisterAuthenticated({ username })) {
//     const status = 401;
//     const message = "Email already exist";
//     res.status(status).json({ status, message });
//     return;
//   }

//   fs.readFile("./users.json", (err, data) => {
//     if (err) {
//       const status = 401;
//       const message = err;
//       res.status(status).json({ status, message });
//       return;
//     }
//     data = JSON.parse(data.toString());

//     let last_item_id = data.users[data.users.length - 1].id;

//     data.users.push({
//       id: last_item_id + 1,
//       username: username,
//       password: password,
//     });
//     let writeData = fs.writeFile(
//       "./users.json",
//       JSON.stringify(data),
//       (err, result) => {
//         if (err) {
//           const status = 401;
//           const message = err;
//           res.status(status).json({ status, message });
//           return;
//         }
//       }
//     );
//   });
//   const access_token = createToken({ username, password });
//   res.status(200).json({ access_token });
// });

server.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (!isLoginAuthenticated({ username, password })) {
    const status = 401;
    const message = "Incorrect Username or Password";
    res.status(status).json({ status, message });
    return;
  }
  const access_token = createToken({ username, password });
  res.status(200).json({ access_token });
});

server.listen(5000, () => {
  console.log("Running fake api json server");
});
