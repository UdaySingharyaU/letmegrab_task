
import Employee from "../models/employee.model.js"
import Department from "../models/department.model.js"
import { Op } from "sequelize";
import crypto from "crypto";
const encryptPhone = (phone) => {
    const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY || 'default_key');
    let encrypted = cipher.update(phone, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  };
  
const employeeController = {
    addEmployee: async (req, res) => {
        const { name, dob, phone, email, salary, department_id } = req.body;
        if(!department_id){
          return res.status(400).json({
            status:false,
            message:"Department id iS Required!"
          })
        }
        const existDepartMent = await Department.findByPk(department_id);
        if(!existDepartMent || existDepartMent.status=='inactive'){
          return res.status(400).json({
            status:false,
            message:"Department Does Not Exist! With This Id Or DepartMent is Inactive"
          })
        }
        if (phone && (phone.length<10 || phone.length>10)) {
          return res.status(400).json({
            status: false,
            message: "Phone number must be a valid 10 digit number"
          });
        }    
        try {
            const existingEmployee = await Employee.findOne({
                where: {
                    [Op.or]: [{ phone: encryptPhone(phone) }, { email }],
                }
            });
            if (existingEmployee) {
                return res.status(400).json({
                    message: "Employee Already Exist",
                    data: existingEmployee
                })
            }
            const employee = await Employee.create({
                name,
                dob,
                phone: encryptPhone(phone),
                email,
                salary,
                department_id
            });

            res.status(201).json({
                message: "Employee Created Successfully",
                data: employee
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },


    getAllEmployee: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            const getAllEmployee = await Employee.findAndCountAll({
                limit,
                offset,
                include: [{ model: Department, as: "department" }],
            });

            return res.status(200).json({
                status: true,
                message: "All Employees Retrieved Successfully",
                total: getAllEmployee.count,
                currentPage: page,
                totalPages: Math.ceil(getAllEmployee.count / limit),
                data: getAllEmployee.rows,
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getEmployeeById: async (req, res) => {
        try {
            const id = req.params.id;
            const employee = await Employee.findByPk(id, {
                include: [{ model: Department, as: "department" }],
            });

            if (!employee) {
                return res.status(404).json({
                    status: false,
                    message: "Employee Not Found With This ID",
                });
            }

            return res.status(200).json({
                status: true,
                message: "Employee Retrieved Successfully",
                data: employee,
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    updateEmployee: async (req, res) => {
        const { id } = req.params;
        const { name, dob, phone, email, salary, department_id } = req.body;

        if (phone && (phone.length<10 || phone.length>10)) {
          return res.status(400).json({
            status: false,
            message: "Phone number must be a valid 10 digit number"
          });
        }        
        try {
          const employee = await Employee.findByPk(id);
    
          if (!employee) {
            return res.status(404).json({
              status: false,
              message: "Employee Not Found With This ID",
            });
          }
    
          // Update employee details
          await employee.update({
            name,
            dob,
            phone: phone ? encryptPhone(phone) : employee.phone,
            email,
            salary,
            department_id,
          });
    
          res.status(200).json({
            message: "Employee Updated Successfully",
            data: employee,
          });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      },

      deleteEmployee: async (req, res) => {
        const { id } = req.params;
    
        try {
          const employee = await Employee.findByPk(id);
    
          if (!employee) {
            return res.status(404).json({
              status: false,
              message: "Employee Not Found With This ID",
            });
          }
    
          await employee.destroy();
    
          res.status(200).json({
            message: "Employee Deleted Successfully",
          });
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      },

      changeEmployeeStatus: async (req, res) => {
        try {
          const { id } = req.params;
          const { status } = req.body;
      
          // Validate the status value
          if (!['active', 'inactive'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value. Allowed values are "active" and "inactive".' });
          }
      
          // Find the employee by primary key (id)
          const existEmployee = await Employee.findByPk(id);
      
          // Check if employee exists
          if (!existEmployee) {
            return res.status(404).json({ message: 'Employee not found.' });
          }
      
          // Update the status
          existEmployee.status = status;
          await existEmployee.save();
      
          // Respond with success
          res.status(200).json({ message: 'Employee status updated successfully.', employee: existEmployee });
      
        } catch (err) {
          // Handle any unexpected errors
          console.error(err);
          res.status(500).json({ message: 'An error occurred while updating employee status.' });
        }
      }      
}


export default employeeController;