const Admin = require("../models/admin");

exports.getAdmin = async (req, res) => {
  try {
    // Retrieve all admins from the database
    const admins = await Admin.find();

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
exports.createAdmin = async (req, res) => {
  try {
    // Create a new admin using the request body
    const newAdmin = await Admin.create(req.body);

    res.status(201).json({
      success: true,
      data: newAdmin,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Bad request",
      error: error.message,
    });
  }
};
exports.updateAdmin = async (req, res) => {
  try {
    // Find the admin by ID and update it with the request body
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate against schema
      }
    );

    if (!updatedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      data: updatedAdmin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
exports.deleteAdmin = async (req, res) => {
  try {
    // Find the admin by ID and delete it
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);

    if (!deletedAdmin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
// Count admins by permission level
exports.countAdminsByPermission = async (req, res) => {
  try {
    const { permissionLevel } = req.params;

    // Validate permissionLevel value
    const validLevels = ["super_admin", "hr_admin", "department_manager"];
    if (!validLevels.includes(permissionLevel)) {
      return res.status(400).json({
        success: false,
        message: "Invalid permission level",
      });
    }

    // Count documents
    const count = await Admin.countDocuments({ permissionLevel });

    res.status(200).json({
      success: true,
      permissionLevel,
      count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Count all admins grouped by permission
exports.countAllAdminsGrouped = async (req, res) => {
  try {
    const counts = await Admin.aggregate([
      {
        $group: {
          _id: "$permissionLevel",
          total: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      counts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
exports.countAdminsByContinent = async (req, res) => {
  try {
    // Récupérer tous les administrateurs depuis la base de données
    const admins = await Admin.find({});

    // Définir les pays par continent
    const continents = {
      africa: [
        "Tunisia",
        "Morocco",
        "Egypt",
        "Libya",
        "Algeria",
        "South Africa",
        "Nigeria",
        "Kenya",
      ],
      america: [
        "USA",
        "Mexico",
        "Canada",
        "Brazil",
        "Argentina",
        "Chile",
        "Colombia",
      ],
      europe: [
        "UK",
        "Germany",
        "Russia",
        "France",
        "Spain",
        "Italy",
        "Ukraine",
        "Poland",
      ],
      asia: [
        "China",
        "Japan",
        "India",
        "South Korea",
        "Singapore",
        "Thailand",
        "Vietnam",
        "Malaysia",
      ],
      oceania: ["Australia", "New Zealand", "Fiji", "Papua New Guinea"],
    };

    // Initialiser les compteurs
    const counts = {
      africa: 0,
      america: 0,
      europe: 0,
      asia: 0,
      oceania: 0,
      other: 0,
    };

    // Compter les administrateurs par continent
    admins.forEach((admin) => {
      const country = admin.address.country;

      if (continents.africa.includes(country)) {
        counts.africa++;
      } else if (continents.america.includes(country)) {
        counts.america++;
      } else if (continents.europe.includes(country)) {
        counts.europe++;
      } else if (continents.asia.includes(country)) {
        counts.asia++;
      } else if (continents.oceania.includes(country)) {
        counts.oceania++;
      } else {
        counts.other++;
      }
    });

    res.status(200).json({
      success: true,
      data: counts,
    });
  } catch (error) {
    console.error("Error counting admins by continent:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
