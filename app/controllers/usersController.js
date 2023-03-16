const { usersModel } = require("../models/usersModels");
const { generateActivationCode } = require("../../utils/index");

const usersController = {
  getAllUsers: async (req, res) => {
    try {
      const data = await usersModel.getAll();
      return res.json({
        success: true,
        statusCode: 200,
        statusValue: "Lấy dữ liệu thành công!",
        data,
      });
    } catch (err) {
      return res.json({
        success: false,
        statusCode: 500,
        statusValue: err,
        data: null,
      });
    }
  },

  getByIdUser: async (req, res) => {
    const id = req.params.id;
    try {
      const data = await usersModel.getById(id);
      return res.json({
        success: true,
        statusCode: 200,
        statusValue: "Lấy dữ liệu thành công!",
        data,
      });
    } catch (err) {
      return res.json({
        success: false,
        statusCode: 500,
        statusValue: err,
        data: null,
      });
    }
  },

  createUser: async (req, res, next) => {
    const { name, email, password } = req.body;
    const activationCode = generateActivationCode();
    const isActive = false;

    // Kiểm tra khi người dùng nhập thiếu các trường
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Hãy nhập đầy đủ các trường!" });
    }

    // Kiểm tra email đã được đăng ký chưa
    const checkEmail = await usersModel.checkEmail(email);
    if (checkEmail > 0) {
      return res.status(600).json({
        success: false,
        statusCode: 600,
        statusValue: "Email đã được đăng ký, vui lòng chọn email khác!",
      });
    }

    try {
      const data = await usersModel.create(
        name,
        email,
        password,
        activationCode,
        isActive
      );

      // Gửi email kèm mã kích hoạt tới địa chỉ email của người dùng
      const resSendCode = await usersModel.sendActivationCode(
        data.email,
        data.activationCode
      );

      // Trả về thông báo thành công
      return res.json({
        success: true,
        statusCode: 200,
        statusValue: `Đăng ký thành công. Vui lòng kiểm tra email ${resSendCode.accepted} để kích hoạt tài khoản!`,
        data,
      });
    } catch (err) {
      return res.json({
        success: false,
        statusCode: 500,
        statusValue: err,
        data: null,
      });
    }
  },

  updateUser: async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    try {
      const data = await usersModel.update(body, id);
      return res.json({
        success: true,
        statusCode: 200,
        statusValue: "Cập nhật dữ liệu thành công!",
        data,
      });
    } catch (err) {
      return res.json({
        success: false,
        statusCode: 500,
        statusValue: "Thêm dữ liệu thất bại!",
        data: null,
      });
    }
  },

  deleteUser: async (req, res) => {
    const ids = req.query.ids.split(",").map((id) => parseInt(id));

    try {
      const data = await usersModel.delete(ids);
      if (data === 0) {
        return res.json({
          statusValue: "Id không tồn tại!",
        });
      } else {
        return res.json({
          success: true,
          statusCode: 200,
          statusValue: "Xóa dữ liệu thành công!",
          data: `Đã xóa thành công ${data} user!`,
        });
      }
    } catch (err) {
      return res.json({
        success: false,
        statusCode: 500,
        statusValue: "Xóa dữ liệu thất bại!",
      });
    }
  },
};

module.exports = usersController;

// exports.getUser = (req, res) => {
//   const id = req.params.id;
//   users.getById(id, (response) => {
//     res.send(response);
//   });
// };

// exports.createUser = (req, res) => {
//   const data = req.body;
//   users.create(data, (response) => {
//     res.send(response);
//   });
// };

// exports.updateUser = (req, res) => {
//   const data = {
//     id: req.params.id,
//     body: req.body,
//   };
//   users.update(data, (response) => {
//     res.send(response);
//   });
// };

// exports.deleteUser = (req, res) => {
//   const id = req.params.id;
//   users.delete(id, (response) => {
//     res.send(response);
//   });
// };
