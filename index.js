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
    ])
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
}

//   case "Add an employee role":
//     addEmployeeRole();
//     break;

//   case "End":
//     connection.end();
//     break;
// };

//Function to view the department table
function viewDepartmentTable() {
  console.log("Viewing department table\n");
  db.query(`SELECT * FROM department`, (err, result) => {
    if (err) throw err
    console.table (result)
    promptManager();
  });
}

//Function to view role table
function viewRoleTable() {
  console.log("Viewing Employee Role Table\n");
  db.query(`select role.id,role.title,role.salary,department.name from role join department on role.department_id=department.id`, (err, result) => {
    if (err) throw err
    console.table (result)
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
    console.table (result)
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

};
promptManager();

