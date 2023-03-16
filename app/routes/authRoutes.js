module.exports = (router) => {
  const authController = require("../controllers/authController");

  // Route login
  router.post("/api/auth/login", authController.authLogin);
  router.post("/api/auth/login/accuracy", authController.authAccuracy);
};
