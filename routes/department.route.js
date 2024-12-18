import express from 'express';
const router = express.Router();
// const authenticate = require('../middleware/auth');
import departmentController from '../controller/department.controller.js';

router.post('/add', departmentController.addDepartment);

router.get('/getDepartmentWiseHighestSalary',departmentController.getDepartmentWiseHighestSalary);
router.get('/getSalaryRangeEmployeeCount',departmentController.getSalaryRangeEmployeeCount);
router.get('/getYoungestEmployeeInEachDepartment',departmentController.getYoungestEmployeeInEachDepartment);

export default router;
