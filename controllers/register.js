const handleRegister = (req,res,db,bcrypt) => {
  const { email, password, name } = req.body;
  if(!email || !password || !name){
    return res.status(404).json('error!');
  }
  const hash = bcrypt.hashSync(password,10);
  console.log(hash);
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return db("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(404).json("unable to join"));
};

module.exports = {
    handleRegister:handleRegister
}
