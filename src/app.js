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
//listen for update

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