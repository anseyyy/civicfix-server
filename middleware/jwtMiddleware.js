const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
  console.log("Inside jwtMiddleware");
  // Get token from header
  const token = req.headers["authorization"]?.split(" ")[1];

  if (token) {
    try {
      const jwtResponse = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
      console.log("JWT Verified:", jwtResponse);
      req.payload = jwtResponse.userId;
      next();
    } catch (err) {
      console.error("JWT Verification Failed:", err.message);
      res.status(401).json({ error: "Authorization failed. Please login." });
    }
  } else {
    res.status(401).json({ error: "Authorization failed. Missing token." });
  }
};

module.exports = jwtMiddleware;
