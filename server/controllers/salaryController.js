const Salary=require("../models/salary");
const Employee=require("../models/employee");
const Department=require("../models/departement");
// Crée un nouveau salaire
exports.createSalary=async(req,res)=>{
    try{
        const{basicSalary,allowances,deductions,payDate,employee,department}=req.body;
        if(!basicSalary||!payDate||!employee||!department){
            return res.status(400).json({error:"Champs requis manquants"});
        }
       const salary = new Salary({
  basicSalary,
  allowances,
  deductions,
  payDate,
  netSalary: basicSalary + (allowances || 0) - (deductions || 0),
  employee,
  department
});
await salary.save();
// Met à jour la référence du salaire dans l'employé
await Employee.findByIdAndUpdate(employee, { $push: { salaries: salary._id } });
// Met à jour la référence du salaire dans le département
await Department.findByIdAndUpdate(department, { $push: { salaries: salary._id } });
res.status(201).json({success:true,message:"Salaire créé avec succès",data:salary});
}
catch(error){
    console.error("Erreur lors de la création du salaire:",error);
    res.status(500).json({error:"Erreur interne du serveur"});
}
};