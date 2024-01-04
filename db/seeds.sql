INSERT INTO department (name) VALUES
    ("Management"),
    ("Sales"),
    ("Accounting"),
    ("Supplier")
    ("Warehouse"),
    ("HR"),
    ("Administrative");

INSERT INTO role(title, salary, department_id) VALUES
("Manager", 100000, 1),
       ("Supplier Relations", 25000,6),
       ("Secretary", 28000, 5),
       ("Warehouse Foreman", 24000,4),
       ("Receptionist", 20000,),
       ("Customer Service", 20000,8),            
       ("Salesman", 20000,3 ),
       ("Accountant", 20000,2),
       ("Human Resources", 20000,7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)VALUES
        ("Michael", "Scott", 1,),
       ("Angela", "Martin", 2, NULL),
       ("Jim", "Halpert", 3, NULL),
       ("Darryl", "Philbin", 4, NULL),
       ("Pamela", "Beesly", 10, NULL),
       ("Meredith", "Palmer", 1, NULL),
       ("Toby", "Flanderson", 7, NULL),
       ("Kelly", "Kapoor", 8, NULL),
       ("Dwight", "Schrute", 3, NULL);   