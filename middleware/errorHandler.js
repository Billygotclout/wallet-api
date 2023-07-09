const { constants } = require("../utils/constants");

const errorHandler = (err, req, res, next) => {
  const statusCode = res.status ? res.status : 500;
  switch (statusCode) {
    case constants.NOT_FOUND:
      res.status(404);
      throw new Error("not found");
    case constants.VALIDATION_ERROR:
      res.status(400);
      throw new Error("Validation error");
    case constants.SERVER_ERROR:
      res.status(500);
      throw new Error("Server Error");
    case constants.UNAUTHORISED:
      res.status(401);
      throw new Error("Unauthorized User");
    case constants.FORBIDDEN:
      res.status(403);
      throw new Error("Forbidden");

    default:
      console.log("All good, No errors!");
      break;
  }
};

module.exports = errorHandler;
