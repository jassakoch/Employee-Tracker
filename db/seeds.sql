INSERT INTO department (name) 
VALUES
    ("Management"),
    ("Sales"),
    ("Accounting"),
    ("Supplier"),
    ("Warehouse"),
    ("HR"),
    ("Administrative");

INSERT INTO role(title, salary, department_id) 
VALUES
    ("Manager", 100000,1),
    ("Accountant", 20000,3),
    ("Salesman", 20000,2),
    ("Supplier Relations", 25000,4),
    ("Secretary", 28000,7),
    ("Warehouse Foreman", 24000,5),
    ("Receptionist", 20000,7),
    ("Customer Service", 20000,2),               
    ("Human Resources", 20000,6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Michael", "Scott", 1, NULL),
    ("Angela", "Martin", 2, 1),
    ("Jim", "Halpert", 3, 1),
    ("Darryl", "Philbin", 4, 1),
    ("Pamela", "Beesly", 7, 1),
    ("Meredith", "Palmer", 4, 1),
    ("Toby", "Flanderson", 9, 1),
    ("Kelly", "Kapoor", 8, 1),
    ("Dwight", "Schrute", 3, 1),
    ("Andy", "Smith", 6,1);  