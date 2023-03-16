const { DataTypes, Op } = require("sequelize");
const sequelize = require("../../config/db");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
require("dotenv").config();

const User = sequelize.define(
  "User",
  {
    // Các trường trong bảng
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activationCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    // Tên bảng trong cơ sở dữ liệu
    tableName: "users",
    // Không sử dụng các timestamp mặc định (createdAt, updatedAt)
    timestamps: false,
  }
);

// Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
User.beforeCreate(async (user, options) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

// Đồng bộ model với cơ sở dữ liệu
sequelize.sync();

// Tạo một đối tượng Transporter để gửi email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  // Disable SSL/TLS
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

const usersModel = {
  getAll: () => {
    try {
      return User.findAll();
    } catch (err) {
      return err;
    }
  },

  getById: async (id) => {
    try {
      return await User.findOne({ where: { id: id } });
    } catch (err) {
      return err;
    }
  },

  create: async (name, email, password, activationCode, isActive) => {
    try {
      return await User.create({
        name,
        email,
        password,
        activationCode,
        isActive,
      });
    } catch (err) {
      return err;
    }
  },

  // Xây dựng hàm gửi email
  sendActivationCode: async (email, activationCode) => {
    // Tạo một đối tượng email với các thuộc tính tương ứng
    const message = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Mã kích hoạt tài khoản",
      text: `Mã kích hoạt của bạn là: ${activationCode}`,
    };

    // Gửi email
    return await transporter.sendMail(message);
  },

  // Hàm check email đã tồn tại chưa
  checkEmail: async (email) => {
    return await User.count({ where: { email: { [Op.eq]: email } } });
  },

  update: async ({ name, email, password }, id) => {
    try {
      await User.update({ name, email, password }, { where: { id: id } });
      return await User.findOne({ where: { id: id } });
    } catch (err) {
      return err;
    }
  },

  delete: async (ids) => {
    try {
      return await User.destroy({ where: { id: { [Op.in]: ids } } });
    } catch (err) {
      return err;
    }
  },
};

module.exports = {
  User,
  usersModel,
};

// -----------------------------------------------------------------------
// users.getAll = (callback) => {
//   db.query("SELECT * FROM users", (err, results) => {
//     if (err) {
//       callback({
//         success: false,
//         statusCode: 400,
//         statusValue: err,
//         data: null,
//       });
//     } else {
//       callback({
//         success: true,
//         statusCode: 200,
//         statusValue: "Lấy dữ liêu thành công!",
//         data: results,
//       });
//     }
//   });
// };

// users.getById = (params, callback) => {
//   db.query(`SELECT * FROM users WHERE id = ${params}`, (err, results) => {
//     if (err) {
//       callback({
//         success: false,
//         statusCode: 400,
//         statusValue: err,
//         data: null,
//       });
//     } else {
//       callback({
//         success: true,
//         statusCode: 200,
//         statusValue: "Lấy dữ liệu thành công! " + err,
//         data: results,
//       });
//     }
//   });
// };

// users.create = (data, callback) => {
//   db.query(
//     `INSERT INTO users (name, email, password) VALUES ('${data.name}', '${data.email}', '${data.password}')`,
//     (err) => {
//       if (err) {
//         callback({
//           success: false,
//           statusCode: 400,
//           statusValue: err,
//           data: null,
//         });
//       } else {
//         callback({
//           success: false,
//           statusCode: 200,
//           statusValue: "Thêm user thành công!",
//           data: data,
//         });
//       }
//     }
//   );
// };

// users.update = (data, callback) => {
//   db.query(
//     `UPDATE users SET name = '${data.body.name}', email = '${data.body.email}', password = '${data.body.password}' WHERE id = ${data.id} `,
//     (err, results) => {
//       if (err) {
//         callback({
//           success: false,
//           statusCode: 400,
//           statusValue: err,
//           data: null,
//         });
//       } else {
//         callback({
//           success: true,
//           statusCode: 200,
//           statusValue: "cập nhật user thành công!",
//           data: data,
//         });
//       }
//     }
//   );
// };

// users.delete = (params, callback) => {
//   db.query(`DELETE FROM users WHERE id = ${params}`, (err) => {
//     if (err) {
//       callback({
//         success: false,
//         statusCode: 400,
//         statusValue: err,
//       });
//     } else {
//       callback({
//         success: true,
//         statusCode: 200,
//         statusValue: "Xóa user thành công!",
//       });
//     }
//   });
// };
