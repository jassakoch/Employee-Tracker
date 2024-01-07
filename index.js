const mysql = require('mysql2');
const inquirer = require("inquirer");

//Establashing connection to the database employees_db
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'pass',
    database: 'employees_db'
  },
  console.log("Connection established to employees_db")
);

//Declare roleChoices and managerChoices for inserting prompts
let roleChoices;
let managerChoices;


//Prompts for the user menu
async function promptManager() {
  const answers = await inquirer.prompt([


    {
      type: "list",
      name: "menu",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role"
      ]
    }
  ]);
  console.log(answers);


  //Switch statement to handle diffent menu options
  switch (answers.menu) {
    case "View all departments":
      viewDepartmentTable();
      break;

    case "View all roles":
      viewRoleTable();
      break;

    case "View all employees":
      viewEmployeeTable();
      break;

    case "Add a department":
      addDepartment();
      break;


    case "Add a role":
      addRole();
      break;


    case "Add an employee":
      addEmployee();
      break;
     
   case "Update an employee role":
        updateEmployeeRole();
        break; 

  case "End":
    connection.end();
    break;
};
}
//Function to view the department table
function viewDepartmentTable() {
  console.log("Viewing department table\n");
  db.query(`SELECT * FROM department`, (err, result) => {
    if (err) throw err
    console.table(result)
    promptManager();
  });
}

//Function to view role table
function viewRoleTable() {
  console.log("Viewing Employee Role Table\n");
  db.query(`select role.id,role.title,role.salary,department.name from role join department on role.department_id=department.id`, (err, result) => {
    if (err) throw err
    console.table(result)
    promptManager();
  });
}

//Function to view employees table
function viewEmployeeTable() {
  console.log("Viewing Employee Role Table\n");
  db.query(`SELECT 
  employee.id AS ID,
  employee.first_name AS \`First Name\`, 
  employee.last_name AS \`Last Name\`, 
  role.title AS Title, 
  role.salary AS Salary, 
  department.name AS Department,
  CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
FROM employee 
JOIN role ON employee.role_id = role.id
LEFT JOIN department ON role.department_id = department.id
LEFT JOIN employee AS manager ON employee.manager_id = manager.id
ORDER BY employee.id`, (err, result) => {
    if (err) throw err
    console.table(result)
    promptManager();
  });
}

// Function to add a department
async function addDepartment() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "newDepartment",
      message: "What is the new department?",
      validate: function (input) {
        // Validate that the input is not empty
        return input !== '';
      }
    }
  ]);

  const newDepartmentName = answers.newDepartment;

  db.query(`INSERT INTO department (name) VALUES (?)`, [newDepartmentName], (err, result) => {
    if (err) throw err;
    console.table(result);
    promptManager();
  });
}


// Function to add a role
async function addRole() {
  // Get department choices for user prompt
  const departmentChoices = await getDepartmentChoices();

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "newRoleTitle",
      message: "What is the title of the new role?",
      validate: function (input) {
        return input !== '';
      }
    },
    {
      type: "input",
      name: "newRoleSalary",
      message: "What is the salary for the new role?",
      validate: function (input) {
        return !isNaN(input) && parseFloat(input) >= 0;
      }
    },
    {
      type: "list",
      name: "newRoleDepartment",
      message: "Which department does the new role belong to?",
      choices: departmentChoices
    }
  ]);

  const newRoleTitle = answers.newRoleTitle;
  const newRoleSalary = parseFloat(answers.newRoleSalary);
  const newRoleDepartmentId = departmentChoices.find(department => department.name === answers.newRoleDepartment).id;
  const selectedDepartment = departmentChoices.find(dep => dep.name === answers.newRoleDepartment);

  if (!selectedDepartment) {
    console.log("Error: Selected department not found.");
    promptManager();
    return;
  }



  // Insert the new role into the 'role' table
  db.query(
    `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
    [newRoleTitle, newRoleSalary, newRoleDepartmentId],
    (err, result) => {
      if (err) throw err;
      console.log(`${result.affectedRows} role inserted!\n`);
      promptManager();
    }
  );
}

// Helper function to retrieve department choices for user prompt
function getDepartmentChoices() {
  return new Promise((resolve, reject) => {
    db.query(`SELECT id, name FROM department`, (err, result) => {
      if (err) reject(err);
      const departmentChoices = result.map(dep => ({ id: dep.id, name: dep.name }));
      resolve(departmentChoices);
    });
  });
}

//Function for adding an employee
async function addEmployee() {

  //initializing roleChoices and managerChoices
  const roleChoices = await getRoleChoices();
  const managerChoices = await getManagerChoices();

  // Get emmployee choices for user prompt
  const employeeChoices = await getEmployeeChoices();

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "newFirstName",
      message: "What is the first name of the new employee?",
      validate: function (input) {
        return input !== '';
      }
    },
    {
      type: "input",
      name: "newLastName",
      message: "What is the last name of the new employee?",
      validate: function (input) {
        return input !== '';
      }
    },
    {
      type: "list",
      name: "newRoleEmployee",
      message: "What role does the new employee have?",
      choices: roleChoices.map(role => role.title)
    },
    {
      type: "list",
      name: "newManager",
      message: "Who is the manager of the new employee?",
      choices: managerChoices.map(manager=> manager.name)
    }
  ]);

  const newFirstName = answers.newFirstName;
  const newLastName = answers.newLastName;
  const newRoleEmployeeId = roleChoices.find(role => role.title === answers.newRoleEmployee).id;
  const newManagerId = managerChoices.find(manager => manager.name === answers.newManager).id;

  // Insert the new employee into the 'employee' table

  db.query(
    `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
    [newFirstName, newLastName, newRoleEmployeeId, newManagerId],
    (err, result) => {
      if (err) throw err;
      console.log(`${result.affectedRows} employee inserted!\n`);
      promptManager();
    }
  );
}

// Helper function to retrieve employee choices for user prompt
function getEmployeeChoices() {
  return new Promise((resolve, reject) => {
    db.query(`SELECT id, first_name, last_name FROM employee`, (err, result) => {
      if (err) reject(err);
      const employeeChoices = result.map(emp => ({
        id: emp.id,
        first_name: emp.first_name,
        last_name: emp.last_name,
        name: `${emp.first_name} ${emp.last_name}`
      }));
      resolve(employeeChoices);
    });
  });
}

// Helper function to retrieve role choices for user prompt
function getRoleChoices() {
  return new Promise((resolve, reject) => {
    db.query(`SELECT id, title FROM role`, (err, result) => {
      if (err) reject(err);
      roleChoices = result.map(role => ({ id: role.id, title: role.title }));
      resolve(roleChoices);
    });
  });
}

// Helper function to retrieve manager choices for user prompt
function getManagerChoices() {
  return new Promise((resolve, reject) => {
    db.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee WHERE manager_id IS NULL`, (err, result) => {
      if (err) reject(err);
      managerChoices = result.map(manager => ({ id: manager.id, name: manager.name }));
      resolve(managerChoices);
    });
  });
}

//Function to update current employee role
async function updateEmployeeRole() {
      // Get employee choices for user prompt
      const employeeChoices = await getEmployeeChoices();
      console.log("Before getRoleChoices");
const roleChoices = await getRoleChoices();
console.log("After, getRoleChoices", roleChoices);
      const answers = await inquirer.prompt([
          {
              type: "list",
              name: "employeeToUpdate",
              message: "Select an employee to update:",
              choices: employeeChoices.map(employee => ({
                  name: `${employee.first_name} ${employee.last_name}`,
                  value: employee.id
              }))
          },
          {
              type: "list",
              name: "newRole",
              message: "Select the new role for the employee:",
              choices: roleChoices.map(role => role.title)
          }
      ]);
  
      const employeeIdToUpdate = answers.employeeToUpdate;
      const newRoleTitle = answers.newRole;
//Get the role id based on the selected role title
const newRoleId = roleChoices.find(role => role.title ===newRoleTitle).id

  
      // Update the employee's role in the database
      db.query(
          "UPDATE employee SET role_id = ? WHERE id = ?",
          [newRoleId, employeeIdToUpdate],
          (err, result) => {
              if (err) throw err;
              console.log(`${result.affectedRows} employee role updated!\n`);
              // Call the main prompt function or do any other necessary actions
              promptManager();
          }
      );
  }




promptManager();

