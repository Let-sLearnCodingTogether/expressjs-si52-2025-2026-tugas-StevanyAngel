const Application = require("../models/Application.js");

// @desc    Buat lamaran baru
// @route   POST /api/applications
// @access  Private
exports.createApplication = async (req, res) => {
  try {
    const { companyName, position, applyDate, status, notes } = req.body;

    // Validasi input
    if (!companyName || !position) {
      return res.status(400).json({
        success: false,
        message: "Nama perusahaan dan posisi harus diisi",
      });
    }

    const application = await Application.create({
      companyName,
      position,
      applyDate,
      status: status || "Applied",
      notes,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Lamaran berhasil ditambahkan",
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get semua lamaran user yang sedang login
// @route   GET /api/applications
// @access  Private
exports.getApplications = async (req, res) => {
  try {
    // Query parameters untuk filter
    const { status, companyName } = req.query;

    let query = { user: req.user._id };

    // Filter berdasarkan status jika ada
    if (status) {
      query.status = status;
    }

    // Filter berdasarkan nama perusahaan jika ada
    if (companyName) {
      query.companyName = { $regex: companyName, $options: "i" };
    }

    const applications = await Application.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get satu lamaran berdasarkan ID
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Lamaran tidak ditemukan",
      });
    }

    // Pastikan user hanya bisa akses lamaran miliknya sendiri
    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses ke lamaran ini",
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update lamaran
// @route   PUT /api/applications/:id
// @access  Private
exports.updateApplication = async (req, res) => {
  try {
    let application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Lamaran tidak ditemukan",
      });
    }

    // Pastikan user hanya bisa update lamaran miliknya sendiri
    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk mengubah lamaran ini",
      });
    }

    application = await Application.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Lamaran berhasil diupdate",
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Hapus lamaran
// @route   DELETE /api/applications/:id
// @access  Private
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Lamaran tidak ditemukan",
      });
    }

    // Pastikan user hanya bisa hapus lamaran miliknya sendiri
    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Anda tidak memiliki akses untuk menghapus lamaran ini",
      });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lamaran berhasil dihapus",
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get statistik lamaran
// @route   GET /api/applications/stats
// @access  Private
exports.getStats = async (req, res) => {
  try {
    const stats = await Application.aggregate([
      {
        $match: { user: req.user._id },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Application.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
