
import Employee from "../models/employee.model.js"
import Department from "../models/department.model.js"
import { sequelize } from "../config/connection.config.js";
import { Op } from "sequelize";

const departmentController = {
    addDepartment: async (req, res) => {
        const {name,status}=req.body;

        try{
            const existingDepartment = await Department.findOne({
                where:{name}
            })
            if(existingDepartment){
                return res.status(400).json({
                    message:"This Department Is Already Exist",
                })
            }
            const department = await  Department.create({
                name,
                status
            })
            return res.status(200).json({
                message:"Department Created Successfully",
                data:department
            })
        } catch (err) {
            res.status(500).json({ message: 'Error adding Department' ,err});
        }
    },

    getDepartmentWiseHighestSalary: async (req, res) => {
      try {
        const highestSalaries = await Employee.findAll({
          attributes: [
            [sequelize.fn("MAX", sequelize.col("salary")), "highestSalary"],
            "department_id",
          ],
          include: [{ model: Department, as: "department" }],
          group: ["department_id"],
        });
    
        res.status(200).json({
          status: true,
          message: "Department-wise highest salaries retrieved successfully",
          data: highestSalaries,
        });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    },

    getSalaryRangeEmployeeCount: async (req, res) => {
      try {
        // Get dynamic salary range from the request query
        const { salaryRangeFrom, salaryRangeTo } = req.query;
        
        // Validate input ranges
        if (!salaryRangeFrom || !salaryRangeTo) {
          return res.status(400).json({
            status: false,
            message: "Please provide both salaryRangeFrom and salaryRangeTo.",
          });
        }
    
        // Convert the salary range values to integers
        const from = parseInt(salaryRangeFrom);
        const to = parseInt(salaryRangeTo);
    
        if (isNaN(from) || isNaN(to)) {
          return res.status(400).json({
            status: false,
            message: "Invalid salary range values. Please provide valid numbers.",
          });
        }
    
        const salaryRanges = await Employee.findAll({
          attributes: [
            [
              sequelize.literal(`
                CASE
                  WHEN salary BETWEEN ${from} AND ${to} THEN '${from}-${to}'
                  ELSE 'Out of Range'
                END
              `),
              "salaryRange",
            ],
            [sequelize.fn("COUNT", sequelize.col("id")), "count"],
          ],
          group: ["salaryRange"],
        });
    
        res.status(200).json({
          status: true,
          message: "Salary range-wise employee count retrieved successfully",
          data: salaryRanges,
        });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    },
    
    getYoungestEmployeeInEachDepartment: async (req, res) => {
      try {
        const youngestEmployees = await sequelize.query(
          `
          SELECT name, 
                 TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age, 
                 department_id, 
                 department_name
          FROM (
              SELECT e.name, 
                     e.dob, 
                     TIMESTAMPDIFF(YEAR, e.dob, CURDATE()) AS age, 
                     e.department_id, 
                     d.name AS department_name,
                     ROW_NUMBER() OVER (PARTITION BY e.department_id ORDER BY e.dob ASC, e.id ASC) AS \`rank\`
              FROM Employees e
              JOIN Departments d ON e.department_id = d.id
          ) ranked
          WHERE ranked.\`rank\` = 1;
          `,
          {
            type: sequelize.QueryTypes.SELECT,
          }
        );
    
        res.status(200).json({
          status: true,
          message: "Youngest employee in each department retrieved successfully",
          data: youngestEmployees,
        });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }      
        
}


export default departmentController;