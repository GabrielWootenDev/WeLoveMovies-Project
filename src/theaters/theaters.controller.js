const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const theatersService = require("./theaters.service");

//list uses theatersService.list to retrieve all theater data, then responds with that data as json;
async function list(req, res) {
  const data = await theatersService.list();
  res.json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
};
