import express from 'express';
const router = express.Router();
import employeeController from '../controller/employee.controller.js';


router.get('/getAllEmployee', employeeController.getAllEmployee);
router.get('/getEmployeeById/:id', employeeController.getEmployeeById);
router.post('/addEmployee', employeeController.addEmployee);
router.put('/updateEmployee/:id', employeeController.updateEmployee);
router.delete('/deleteEmployee/:id', employeeController.deleteEmployee);
router.patch('/changeEmployeeStatus/:id',employeeController.changeEmployeeStatus);
export default router;
