const sequelize = require("../../config/db");
const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Auth = sequelize.define(
  "Auth",
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

const authModel = {
  login: async (email, password) => {
    try {
      const user = await Auth.findOne({ where: { email } });
      if (!user) {
        throw "Email không đúng!";
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw "Mật khẩu không đúng!";
      }

      if (user.isActive === false) {
        throw "Bạn chưa xác thực tài khoản, vui lòng xác thực!";
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      return token;
    } catch (err) {
      return err;
    }
  },

  accuracy: async (email, activationCode) => {
    try {
      const user = await Auth.findOne({ where: { email, activationCode } });
      if (!user) {
        throw "Mã xác thực không đúng, vui lòng nhập lại!";
      }
      return await Auth.update({ isActive: true }, { where: { id: user.id } });
    } catch (err) {
      return err;
    }
  },
};

module.exports = {
  Auth,
  authModel,
};
