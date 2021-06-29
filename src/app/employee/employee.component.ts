import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from 'src/services/employee.service';
import { Employee } from './Employee';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  public employeeRecords: Employee[] = [];
  private currentEmployeeId: number = 0;
  //  Preparing Reactive form froup object
  public form = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
    contactNumber: new FormControl('', [
      Validators.required,
      Validators.maxLength(15),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(200),
    ]),
    dob: new FormControl('', [Validators.required]),
    address: new FormControl('', [
      Validators.required,
      Validators.maxLength(500),
    ]),
  });
  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.getAllEmployee();
  }

  //  To get all employees
  getAllEmployee() {
    this.employeeService.getAllEmployees().subscribe((response: Employee[]) => {
      this.employeeRecords = response;
    });
  }

  // To insert/update employee
  addUpdateEmployee() {
    this.employeeService
      .saveUpdateEmployee(this.currentEmployeeId, this.form.value)
      .subscribe((respone) => {
        if (respone && this.currentEmployeeId <= 0) {
          this.employeeRecords.push(respone);
        } else {
          let currentEmployee = this.employeeRecords.find(
            (f) => f.id == this.currentEmployeeId
          );
          if (!currentEmployee) return;
          let index = this.employeeRecords.indexOf(currentEmployee);
          this.employeeRecords[index] = this.form.value;
        }

        //Reseting the employees form
        this.resetEmployeeForm();
      });
  }

  //  method to delete the employee
  fillEmployeeDetailsIntoForm(employee: Employee) {
    if (!employee) return;

    //  Setting the employee details into employee form
    this.form.setValue({
      firstName: employee.firstName,
      lastName: employee.lastName,
      contactNumber: employee.contactNumber,
      email: employee.email,
      dob: employee.dob,
      address: employee.address,
    });

    //  Storing the employee id for future purpose
    //  while updating the employee
    this.currentEmployeeId = employee.id;
  }

  //  method to delete the employee
  deleteEmployee(employee: Employee) {
    if (!employee) return;
    this.employeeService
      .deleteEmployee(employee.id)
      .subscribe((response: any) => {
        let index = this.employeeRecords.indexOf(employee);
        this.employeeRecords.splice(index, 1);
      });
  }

  //Loading indicator

  //  Method to detect weather a control is valid or not
  isValidControl(controlName: string) {
    let control = this.getControl(controlName);
    return control && control.touched && control.invalid;
  }

  //  Private method to get perticular control object
  private getControl(controlName: string) {
    return this.form.get(controlName);
  }

  //  Method to reset the forms
  private resetEmployeeForm() {
    this.currentEmployeeId = 0;
    this.form.reset();
  }
}
