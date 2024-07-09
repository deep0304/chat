async function userExistForLogin(req, res, next) {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    if (!email || !password || !username) {
      return res.status(400).send("Please fill all required fields");
    }
    const user = await Users.findOne({ email: email });
    if (user) {
      return next(user);
    } else {
      return res.send("Please register and then login")
    }
  }
  
module.exports = userExistForLogin;