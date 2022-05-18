const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const showing = req.query.is_showing;
  if (showing) {
    const data = await moviesService.listShowing();
    res.json({ data: data });
  } else {
    const data = await moviesService.list();
    res.json({ data: data });
  }
}

async function read(req, res) {
  const { movieId } = req.params;
  const data = await moviesService.read(movieId);
  res.json({ data: data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(read)],
};
