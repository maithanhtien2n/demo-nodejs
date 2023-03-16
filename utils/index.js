const generateActivationCode = () => {
  const codeLength = 6; // Độ dài của mã kích hoạt
  const possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; // Các ký tự có thể được sử dụng

  let activationCode = "";

  // Tạo chuỗi ngẫu nhiên bằng cách chọn các ký tự từ possibleChars
  for (let i = 0; i < codeLength; i++) {
    activationCode += possibleChars.charAt(
      Math.floor(Math.random() * possibleChars.length)
    );
  }

  return activationCode;
};

module.exports = {
  generateActivationCode,
};
