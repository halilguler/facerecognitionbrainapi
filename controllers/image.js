const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "c46477bf141b4b098dd5fb54ef5bc628"
});

const handleApiCall = (req, res) => {
  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input).then(data=>{
    res.json(data);
  }).catch(err=>res.status(404).json('error!'));
};


const handleImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(404).json("No such value"));
};
module.exports = {
    handleImage,
    handleApiCall
}