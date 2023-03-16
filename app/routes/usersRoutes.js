module.exports = (router) => {
  const usersController = require("../controllers/usersController");
  const authenticateToken = require("../middlewares/authenticateToken");

  // Route lấy danh sách người dùng
  router.get("/api/users", authenticateToken, usersController.getAllUsers);

  // Route lấy thông tin người dùng
  router.get("/api/user/:id", authenticateToken, usersController.getByIdUser);

  // Route tạo người dùng mới
  router.post("/api/user", usersController.createUser);

  // Route cập nhật thông tin người dùng
  router.put("/api/user/:id", authenticateToken, usersController.updateUser);

  // Route xoá người dùng
  router.delete(
    "/api/user?:ids",
    authenticateToken,
    usersController.deleteUser
  );
};
