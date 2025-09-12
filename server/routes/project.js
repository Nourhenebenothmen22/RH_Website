const express=require('express');
const router=express.Router();
const {assignProject,getAllProjects,getProjectById,updateProject}=require('../controllers/projectController');
router.post('/',assignProject);
router.get('/',getAllProjects);
router.get('/:id',getProjectById);
router.put('/:id',updateProject);
module.exports=router;