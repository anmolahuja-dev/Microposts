class UI {
    constructor(){
        this.post= document.querySelector('#posts');
        this.titleInput = document.querySelector('#title');
        this.bodyInput = document.querySelector('#body');
        this.idInput = document.querySelector('#id');
        this.postSubmit = document.querySelector('.post-submit');
        this.forState= 'add';
    }

    showPosts(posts){
        let output = '';
        posts.forEach((post)=>{
            output+= `
                <div class="card mb-3">
                    <div class="card-body">
                        <h4 class="card-title">${post.title}</h4>
                        <p class="card-text">${post.body}</p>
                        <a href="#" class="edit card-link" data-id=${post.id}>
                            <i class="fa fa-edit"></i>
                        </a>
                        <a href="#" class="delete card-link " data-id=${post.id}>
                            <i class="fa fa-minus-square"></i>
                        </a>
                    </div>            
                </div>
            `
        });
        this.post.innerHTML= output;
    }

    showAlert(message,classname) {
        this.clearAlert();

        //create div
        const div= document.createElement('div');
        div.className=classname;
        div.appendChild(document.createTextNode(message));

        const container= document.querySelector('.postsContainer');
        
        //insert alert div
        container.insertBefore(div,this.post);

        //time out
        setTimeout(()=>{
            this.clearAlert();
        },2500);
    }

    fillForm(data){
        this.titleInput.value=data.title;
        this.bodyInput.value=data.body;
        this.idInput.value=data.id;

        this.changeFormState('edit');
    }

    //Change form state
    changeFormState(type){
        if(type==='edit'){
            this.postSubmit.textContent= 'Update Post';
            this.postSubmit.className='post-submit btn btn-warning btn-block';

            //create cancel button
            const button = document.createElement('button');
            button.className='post-cancel btn btn-light btn-block my-2';
            button.appendChild(document.createTextNode('Cancel'));

            //get parent
            const cardForm = document.querySelector('.card-form');
            //get element to insert before
            const formEnd= document.querySelector('.form-end');

            cardForm.insertBefore(button,formEnd);
        }
        else {
            this.postSubmit.textContent= 'Post';
            this.postSubmit.className='post-submit btn btn-primary btn-block';
            if(document.querySelector('.post-cancel')){
                document.querySelector('.post-cancel').remove();
            }

            //clear ID from input field
            this.clearIdInput();
            //clear text
            this.clearFields();
        }
    }

    clearIdInput(){
        this.idInput.value='';
    }

    clearAlert(){
        const currAlert=document.querySelector('.alert');

        if(currAlert){
            currAlert.remove();
        }
    }

    clearFields(){
        this.titleInput.value='';
        this.bodyInput.value='';
    }
}

export const ui= new UI;