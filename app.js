const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const team = [];
const idArray = [];

const writeFileAsync = util.promisify(fs.writeFile);

// main function that will be called to start app
function initApp() {
  // Questions and functions for adding the manager's info
  function addManager() {
    console.log("Build your team!");
    inquirer
      .prompt([
        // Manager's name
        {
          type: "input",
          name: "name",
          message: "What is the manager's name?",
          validate: (answer) => {
            if (answer !== "") {
              return true;
            } else {
              return "Please enter a valid name.";
            }
          },
        },
        // Manager's id
        {
          type: "input",
          name: "id",
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
        // Manager's email
        {
          type: "input",
          name: "email",
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
        // Manager's office number
        {
          type: "input",
          name: "office",
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
          answers.name,
          answers.id,
          answers.email,
          answers.office
        );
        team.push(manager);
        idArray.push(answers.id);
        buildTeam();
      });
  }
  // Function to add additional team members after the manager
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
  //  Questions and functions for adding an engineer's info
  function addEngineer() {
    inquirer
      .prompt([
        // Engineer's name
        {
          type: "input",
          name: "name",
          message: "What is the engineer's name?",
          validate: (answer) => {
            if (answer !== "") {
              return true;
            } else {
              return "Please enter a valid name.";
            }
          },
        },
        // Engineer's id
        {
          type: "input",
          name: "id",
          message: "What is the engineer's id?",
          validate: (answer) => {
            const validInput = answer.match(/^[1-9]\d*$/);
            if (validInput) {
              if (idArray.includes(answer)) {
                return "This id is already taken.";
              } else {
                return true;
              }
            } else {
              return "Please enter a valid id.";
            }
          },
        },
        // Engineer's email
        {
          type: "input",
          name: "email",
          message: "What is the engineer's email?",
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
        // Engineer's GitHub
        {
          type: "input",
          name: "github",
          message: "What is the engineer's GitHub username?",
          validate: (answer) => {
            if (answer !== "") {
              return true;
            } else {
              return "Please enter a valid username.";
            }
          },
        },
      ])
      .then((answers) => {
        const engineer = new Engineer(
          answers.name,
          answers.id,
          answers.email,
          answers.github
        );
        team.push(engineer);
        idArray.push(answers.id);
        buildTeam();
      });
  }
  //  Questions and functions for adding an intern's info
  function addIntern() {
    inquirer
      .prompt([
        // Intern's name
        {
          type: "input",
          name: "name",
          message: "What is the intern's name?",
          validate: (answer) => {
            if (answer !== "") {
              return true;
            } else {
              return "Please enter a valid name.";
            }
          },
        },
        // Intern's id
        {
          type: "input",
          name: "id",
          message: "What is the intern's id?",
          validate: (answer) => {
            const validInput = answer.match(/^[1-9]\d*$/);
            if (validInput) {
              if (idArray.includes(answer)) {
                return "This id is already taken.";
              } else {
                return true;
              }
            } else {
              return "Please enter a valid id.";
            }
          },
        },
        // Intern's email
        {
          type: "input",
          name: "email",
          message: "What is the intern's email?",
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
        // Intern's school
        {
          type: "input",
          name: "school",
          message: "Where does the intern go to school?",
          validate: (answer) => {
            if (answer !== "") {
              return true;
            } else {
              return "Please enter a valid username.";
            }
          },
        },
      ])
      .then((answers) => {
        const intern = new Intern(
          answers.name,
          answers.id,
          answers.email,
          answers.school
        );
        team.push(intern);
        idArray.push(answers.id);
        buildTeam();
      });
  }

  function writeTeam() {
    const htmlResults = render(team);
    writeFileAsync(outputPath, htmlResults);
  }

  addManager();
}

// Calling the main function
initApp();

// Writes the info from the inquirer prompts to an html file
