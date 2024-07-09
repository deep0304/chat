const bcrypt = require("bcryptjs");
  const email = "ghost@gmail.com";
  const password = "myscretpassword";
// bcrypt.genSalt(10, (err, salt) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(salt);
//     bcrypt.hash(`{email:${email},password:${password}}`, salt, (err, hashedPassword) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(hashedPassword);
//       }
//     });
//   }
// });
bcrypt.compare(`{email:${email},password:${password}}`,"$2a$10$ieEkHDs7YZKXY0ycKq4Y4uoaiJPYd1Pf62KVYKmS4C/1VWeWVXtji",(err,res)=>{
    if(res == true){
        console.log("matched");
    }
    else{
        console.log("not matched");
    }
})
