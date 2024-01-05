const mysql = require('mysql2');
const inquirer = require("inquirer");

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'pass',
        database: 'employees_db'
    },
    console.log("Connection established to employees_db")
);

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
}
//   case "Add a department":
//     addDepartment();
//     break;

//   case "Add a role":
//     updateEmployeeRole();
//     break;

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

};
promptManager();

//view all  roles select role.id,role.title,role.salary,department.name from role join department on role.department_id=department.id;

//view managers query : select employee.id, employee.first_name, employee.last_name, role.title, manager.last_name from employee join role on employee.role_id=role.id left join employee as manager on employee.manager_id=manager.id;

//same query to view managers of employees but changing the column title of manager last name: select employee.id, employee.first_name, employee.last_name, role.title, manager.last_name as manager from employee join role on employee.role_id=role.id left join employee as manager on employee.manager_id=manager.id;

//viewing all employees : 

// SELECT 
//                         employee.id AS ID,
//                         employee.first_name AS \`First Name\`, 
//                         employee.last_name AS \`Last Name\`, 
//                         role.title AS Title, 
//                         role.salary AS Salary, 
//                         department.name AS Department,
//                         CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
//                     FROM employee 
//                     JOIN role ON employee.role_id = role.id
//                     LEFT JOIN department ON role.department_id = department.id
//                     LEFT JOIN employee AS manager ON employee.manager_id = manager.id
//                     ORDER BY employee.id`
