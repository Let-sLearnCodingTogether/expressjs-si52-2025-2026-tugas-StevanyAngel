const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const protect = async (req, res, next) => {
  let token;

  // Cek apakah ada token di header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Ambil token dari header
      token = req.headers.authorization.split(" ")[1];

      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ambil data user dari database dan simpan di req.user
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: "Token tidak valid atau sudah kadaluarsa",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Tidak ada token, akses ditolak",
    });
  }
};

module.exports = { protect };
