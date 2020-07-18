const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const team = [];
const teamId = [];

// main function that will be called to start app
function initApp() {
  function addManager() {
    console.log("Build your team!");
    inquirer
      .prompt([
        {
          type: "input",
          name: "managername",
          message: "What is the manager's name?",
          validate: (answer) => {
            if (answer !== "") {
              return true;
            } else {
              return "Please enter a valid name.";
            }
          },
        },
        {
          type: "input",
          name: "managerid",
          message: "What is the manager's id?",
          validate: (answer) => {
            const validInput = answer.match(/^[1-9]\d*$/);
            if (validInput) {
              return true;
            } else {
              return "Please enter a valid id.";
            }
          },
        },
        {
          type: "input",
          name: "manageremail",
          message: "What is the manager's email?",
          validate: (answer) => {
            const validInput = answer.match(
              /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            );
            if (validInput) {
              return true;
            } else {
              return "Please enter a valid email.";
            }
          },
        },
        {
          type: "input",
          name: "manageroffice",
          message: "What is the manager's office number?",
          validate: (answer) => {
            const validInput = answer.match(/^[1-9]\d*$/);
            if (validInput) {
              return true;
            } else {
              return "Please enter a valid office number.";
            }
          },
        },
      ])
      .then((answers) => {
        const manager = new Manager(
          answers.managername,
          answers.managerid,
          answers.manageremail,
          answers.managerofficenumber
        );
        team.push(manager);
        teamId.push(answers.managerid);
        buildTeam();
      });
  }
  function buildTeam() {
    inquirer
      .prompt([
        {
          type: "list",
          name: "employeechoice",
          message: "Which type of employee would you like to add?",
          choices: ["Engineer", "Intern", "Stop adding employees"],
        },
      ])
      .then((answer) => {
        switch (answer.employeechoice) {
          case "Engineer":
            addEngineer();
            break;
          case "Intern":
            addIntern();
            break;
          default:
            writeTeam();
        }
      });
  }
  function addEngineer() {
    inquirer.prompt([
      {
        type: "input",
        name: "engineerid",
        message: "What is the engineer's id?",
        validate: (answer) => {
          const validInput = answer.match(/^[1-9]\d*$/);
          if (validInput) {
            if (teamId.includes(answer)) {
              return "This id is already taken.";
            } else {
              return true;
            }
          } else {
            return "Please enter a valid id.";
          }
        },
      },
    ]);
  }

  function writeTeam() {
    fs.writeFileSync(outputPath, render);
  }

  addManager();
}

// calling the main function
initApp();

// Write code to use inquirer to gather information about the development team members,

// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

// consider using an array of ids to see if an id has been added before - add this to validation
//
