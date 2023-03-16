const { authModel } = require("../models/authModel");

const authController = {
  authLogin: async (req, res) => {
    const { email, password } = req.body;
    try {
      const data = await authModel.login(email, password);
      res.json({
        success: true,
        statusCode: 200,
        statusValue: "Đăng nhập thành công!",
        token: data,
      });
    } catch (err) {
      res.json({
        success: false,
        statusCode: 500,
        statusValue: "Đăng nhập thất bại!",
        token: null,
      });
    }
  },

  authAccuracy: async (req, res) => {
    const { email, activationCode } = req.body;
    try {
      if (!email || !activationCode) {
        throw "Nhập thiếu yêu cầu!";
      }
      const data = await authModel.accuracy(email, activationCode);
      res.json({
        success: true,
        statusCode: 200,
        statusValue: "Xác thực tài khoản thành công!",
      });
    } catch (err) {
      res.json({
        success: false,
        statusCode: 500,
        statusValue: err,
      });
    }
  },
};

module.exports = authController;
