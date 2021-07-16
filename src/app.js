import { http } from "./http";
import {ui} from './UI';


//Get posts on DOM Load
document.addEventListener('DOMContentLoaded',getPosts);
//Listen for add post
document.querySelector('.post-submit').addEventListener('click',submitPost);
//Listen for delete button
document.querySelector('#posts').addEventListener('click',deletePost);
//listen for edit state
document.querySelector('#posts').addEventListener('click',enableEdit);
//Listen for cancel
document.querySelector('.card-form').addEventListener('click',cancelEdit);
//Listen for keydown event on the form input to validate that shit
document.querySelector('#title').addEventListener('keyup',removeTitleValidation);
document.querySelector('#body').addEventListener('keyup',removeBodyValidation);
//these two vars is just for validation purpose
const titleNode =  document.querySelector('#title');
const bodyNode= document.querySelector('#body');

//App initialization
(function(){
    document.querySelector('.invalid-id').style.display='none';
    document.querySelector('.invalid-body').style.display='none';
})();

function getPosts(){
    http.get('http://localhost:3000/posts')
    .then(data=>ui.showPosts(data))
    .catch(err => console.log(err));
}

function submitPost(){
    const title = document.querySelector('#title').value;
    const body = document.querySelector('#body').value;
    const id = document.querySelector('#id').value;

    //Validation
    if(title==='' || body==''){
        const titleValidity = document.querySelector('.invalid-id');
        const bodyValidity=document.querySelector('.invalid-body');
        if(title===''&&body===''){
            titleValidity.style.display='block';
            bodyValidity.style.display='block';
            titleNode.classList.add('is-invalid');
            bodyNode.classList.add('is-invalid');
            titleValidity.className='invalid-feedback invalid-id';
            bodyValidity.className='invalid-feedback invalid-body';
        }
        else if(title===''){
            titleValidity.style.display='block';
            titleNode.classList.add('is-invalid');
            titleValidity.className='invalid-feedback invalid-id';
        }
        else{
            bodyValidity.style.display='block';
            bodyValidity.className='invalid-feedback';
            bodyValidity.className='invalid-feedback invalid-body';
        }
    }
    else{
        const data = {
            title,
            body
        }
        //check for id if the id is null that means the post is not in update state
        //check in changeFormStateFunction in Ui component that we set id first before updarting
        if(id===''){
            //Create post
            http.post('http://localhost:3000/posts',data)
            .then(data=>{
                ui.showAlert('Post Added!!','alert alert-success');
                ui.clearFields();
                getPosts();
            })
            .catch(err=> console.log(data));
        }
        else{
            //update post
        
            http.put(`http://localhost:3000/posts/${id}`,data)
            .then(data=>{
                ui.showAlert('Post Updated!!','alert alert-success');
                ui.changeFormState('add');
                getPosts();
            })
            .catch(err=> console.log(data));
        }
    }
}

function deletePost(e){
    if(e.target.parentNode.classList.contains('delete')){
        const id = e.target.parentNode.dataset.id;
        if(confirm('Are you sure?')){
            http.delete(`http://localhost:3000/posts/${id}`)
            .then(data=>{
                ui.showAlert('Post Removed','alert alert-success');
                getPosts();
            })
            .catch(err=>console.log(err));
        }
    }
    e.preventDefault();
}

//Enable edit state
function enableEdit(e){
    if(e.target.parentNode.classList.contains('edit')){
        const id=e.target.parentNode.dataset.id;
        const body= e.target.parentElement.previousElementSibling.textContent;
        const title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;

        const data={
            id,
            title,
            body
        }

        //Fill form with current post
        ui.fillForm(data);

    }
    e.preventDefault();
}

//cancel edit state
function cancelEdit(e){
    if(e.target.classList.contains('post-cancel')){
        ui.changeFormState('add');
    }
    e.preventDefault();
}

//validation
function removeTitleValidation(){
    titleNode.classList.remove('is-invalid');
    document.querySelector('.invalid-id').style.display='none';
}

function removeBodyValidation(){
    bodyNode.classList.remove('is-invalid');
    document.querySelector('.invalid-body').style.display='none';
}