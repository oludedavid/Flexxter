//Using the Fetch API to get the JSON object from the endpoint URL.
//N/B the URL endpoint might not work according the details of the task. It cant be used for testing

//Task 1
async function task1() {
  //resolved promised
  try {
    //1a: Find all elements in the DOM with the tagname „todo-item“.
    const todoItem = document.getElementsByTagName("todo-item"); //An array_like object is returned(node list)

    //1b: Every one of these elements should then be removed from its current parent node and appended to the body of the current element.
    let d = todoItem.forEach((element, index) => {
      element.parentNode.removeChild(element); //remove todo-item
      document.body.appendChild(todoItem[index]); //append todo-item to the body
    });
    return await d;
  } 
  //Error handler
  catch (err) { 
    console.log("I was not appended successfully: ", err);
  }
  
}

//Task 2
//Creating a custom element using web components
//Build a class for a Custom Element that represents an HTML object for one task in a project.


//creating a template for the shadowDom
const template = document.createElement('template');
template.innerHTML = `
  <!-- external stylesheet -->
	<link href="style.css" rel="stylesheet">
     <script src="https://kit.fontawesome.com/37b355aaf1.js" crossorigin="anonymous"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
   <div class="todo-container">
   <h1>Welcome Back! Let's Dive into your task for today>>>>>></h1>
   <p class="notification">Lets get started</p>
  <div class="todo">
        <div class="check_box">
            <form action="">
                <input type="checkbox" id="check" name="checking">
                <label for="check">Paint the world</label>
            </form>

            <div class="description_box">
                <p class="taskId">Task Id</p>
                <p class="description">Task description</p>
            </div>
        </div>

        <div class="arrow"><a href="#"><svg class="icon icon-arrow-right-alt1"><use xlink:href="img/fanta.svg#icon-arrow-right-alt1"></use></svg></a></div>
    </div>
 </div>
`;


//2a: Create a class for custom element called UserToDoItem that extends the HTML element. which will represent the JSON file returned from the endpoint.
class UserToDoItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    //The code below creates a template for the shadow dom. The template is writing above
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
//This would fetch the Json file(task) from the endpoint url
  getTask() {
    let url = "https://flexxter.de/Tasks/Get";
    fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())// converts the response to a JSON file
      .then((json) => {
        this.renderTask(json); //The function that returns the properties of the json to the custom element
      //An event listener that checks for a change in the checked property  
        this.shadowRoot
          .querySelector("#check")
          .addEventListener("change", () => this.checkBox(json));
        console.log("The task was Fetched well");
      })
      .catch((error) => console.log("The task was not fetched well " + error));
  }

  renderTask(data) {
    return `
   ${(this.shadowRoot.querySelector(".description").innerHTML =
     data.description)}
   ${(this.shadowRoot.querySelector("label").innerText = data.title)}
   ${(this.shadowRoot.querySelector(
     ".taskId"
   ).innerHTML = `Task ID: ${data.id}`)}
   `;
  }
// A function to check if the checkbox property as changed
  checkBox(data) {
    //Selecting the checkbox
    let checkBox = this.shadowRoot.querySelector("#check");
    let status = data.checked;
    //The code below checks if the checked property has changed
    if (checkBox.checked == status) {
      return (status);
    } else {
      return (!status);
    }
  }

  //2d. Post the present status of the task
  saveStatus() {
    //Connecting to the POST url endpoint as given in the task
    let url = "https://flexxter.de/Tasks/Save";

    fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
      }),
    })
      .then((response) => {
        response.json();
      })
      .then((json) => {
        let checkBox = this.shadowRoot.querySelector("#check");
        if (checkBox.checked == json.checked) {
          console.log(success.status + json);
        } else {
          console.log(error.status + json);
        }
      })
      .catch((err) => console.log(error.status + err));
  }

  //the code below will run when the custom element is added to the body of the html
  connectedCallback() {
    this.getTask();
    this.style.cursor = "pointer";
  }

  //the code below will run when the custom element is removed from the body of the html
  disconnectedCallback() {
    
  }
}

//The code below creates the custom element to the HTML DOM
window.customElements.define('todo-item', UserToDoItem);
