const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody") ;
const deleteAllButton = document.getElementById("delete-all-button");
const filterButton = document.querySelectorAll(".filter-todos");


let todos =JSON.parse(localStorage.getItem("todos")) || [];
console.log(todos);

const generateId = () =>{
    return Math.round(
        Math.random() * Math.random() *Math.pow(3,12)
    ).toString();
}
generateId()

const showAlert = (message , type)=>{
    alertMessage.innerHTML="";
    const alert = document.createElement("P");
    alert.innerText=message;
    alert.classList.add("alert");
    alert.classList.add(`alert-${type}`);
    alertMessage.append(alert);

    setTimeout(()=>{
       alert.style.display="none"; 
    },2000);
};

const displayTodos = (data) =>{
    const todoLists = data ? data : todos ;
    todosBody.innerHTML = "" ;
    if(!todoLists.length){
        todosBody.innerHTML = " <tr> <td colspan='4'> No Task Found </td></tr>"
        return;
    }

    todoLists.forEach(todo =>{
    todosBody.innerHTML += `
       <tr>
        <td>${todo.task}</td>
        <td>${todo.date || "no date" }</td>
        <td>${todo.completed ? "Completed" : "Pending"}</td>
        <td class="col-5">
          <button  class="btn btn-warning " onclick="editHandler ('${todo.id}')" >Edit</button>
          <button  class="btn btn-success" onclick="toggleHandler('${todo.id}')" >${todo.completed ? "UnDo":"Do" }</button>
          <button  class="btn btn-danger" onclick="deleteHandler('${todo.id}')" >Delete</button>
        </td>
       </tr>
    `
});
};

const saveToLocalStorage=()=>{
    localStorage.setItem("todos" , JSON.stringify(todos))
};

const addHandler = ()=> {
    const task = taskInput.value ;
    const date = dateInput.value ;
    const todo ={
        id:generateId(),
        task,
        date:date,
        completed:false,
    };
    if (task) {
        todos.push(todo);
        saveToLocalStorage();
        displayTodos();
        taskInput.value="" ;
        dateInput.value="" ;
        console.log(todos);
        showAlert("Todo added successfuly" , "success");
    }else{
        showAlert("Please enter a todo" ,"error");
    }
};

const deleteAllHandler = () =>{
    if(todos.length){
      todos=[];
      saveToLocalStorage();
      displayTodos();
      showAlert("All todos cleared successfuly" , "success");  
    }else{
        showAlert("No todos to clear" , "error");
    }
    
};

const deleteHandler = (id) => {
    const newTodo = todos.filter(todo => todo.id !== id ) ;
    todos = newTodo ;
    saveToLocalStorage();
    displayTodos();
    showAlert("Todo deleted successfully" , "success");
 };
   
  const toggleHandler =(id) => {
    const todo = todos.find(todo => todo.id === id );
    todo.completed =!todo.completed ;
    saveToLocalStorage() ;
    displayTodos() ;
    showAlert("Todo status change successfully " ,"success")
  };

  const editHandler = (id) =>{
     const todo = todos.find((todo) => todo.id === id);
      taskInput.value = todo.task ;
      dateInput.value = todo.date ;
      addButton.style.display = "none";
      editButton.style.display ="inline-block";
      editButton.dataset.id = id;
  };
   
  const applyEditHandler =(event) =>{
     const id = event.target.dataset.id ;
     const todo = todos.find(todo => todo.id === id);
     todo.task = taskInput.value ;
     todo.date = dateInput.value ;
     taskInput.value = "" ;
     dateInput.value = "" ;
     addButton.style.display = "inline-block" ;
     editButton.style.display = "none" ;
     saveToLocalStorage() ;
     displayTodos();
     showAlert("show success" , "success") ;
  };

  const filterHandler =event => {
    let filterTodos = null ;
    const filter = event.target.dataset.filter ;
    switch (filter) {
        case "pending":
          filterTodos = todos.filter((todo) => todo.completed === false )  
            break;

        case "completed":
            filterTodos = todos.filter((todo) => todo.completed === true )  
             break;

        case "all":
          filterTodos = todos
            break;    
    }
      displayTodos(filterTodos);
  };



editButton.addEventListener("click" , applyEditHandler);
window.addEventListener("load" ,() => displayTodos());
addButton.addEventListener("click" , addHandler);
deleteAllButton.addEventListener("click" , deleteAllHandler);
filterButton.forEach(button => {
    button.addEventListener("click" , filterHandler);
});