const bcrypt = require("bcryptjs");
async function generateHashedPassword(password) {
  //   await bcrypt.genSalt(10, async (err, salt) => {
  //     if (err) {
  //       console.log(err);
  //     }

  //     await bcrypt.hash(password, salt, (err, hashedPassword) => {
  //       if (err) {
  //         console.log(err);
  //         }

  //       return hashedPassword;
  //     });
  //   });
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (err) {
    console.log(err);
  }
}
module.exports = generateHashedPassword;