const Employee = require("../models/employee");
const Project = require("../models/Project");

/**
 * Create and assign a new project to an employee
 * POST /projects
 * Body: { name, description, employee }
 */
exports.assignProject = async (req, res) => {
    try {
        const { name, description, employee } = req.body; // Destructurer employee
        if (!name || !description || !employee) { // Vérifier aussi employee
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Créer le projet avec l'employee
        const project = new Project({ name, description, employee }); // Ajouter employee
        await project.save();

        // Mettre à jour l'employé
        await Employee.findByIdAndUpdate(
            employee, // Utiliser la variable employee
            { $push: { projects: project._id } }
        );

        res.status(201).json({
            success: true,
            message: "Project assigned successfully",
            data: project
        });
    } catch (error) {
        console.error("Error while assigning project:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get all projects
 * GET /projects
 */
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate("employee");
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        console.error("Error while fetching projects:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Get a single project by ID
 * GET /projects/:id
 */
exports.getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id).populate("employee");
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error("Error while fetching project:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Remove a project by ID
 * DELETE /projects/:id
 */
exports.removeProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        // Remove project reference from employee
        await Employee.findByIdAndUpdate(
            project.employee,
            { $pull: { projects: project._id } }
        );

        res.status(200).json({ success: true, message: "Project removed successfully" });
    } catch (error) {
        console.error("Error while removing project:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * Update a project
 * PUT /projects/:id
 * Body: { name, description }
 */
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const project = await Project.findByIdAndUpdate(
            id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: project
        });
    } catch (error) {
        console.error("Error while updating project:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
