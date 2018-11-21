<template>
    <div class="container">
       <div class="row mt-5">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">User Management</h3>

                <div class="card-tools">
                <button class="btn btn-success" @click="newModal">
                    Add New 
                    <i class="fas fa-user-plus fa-fw"></i>
                </button>
                  <!-- <div class="input-group input-group-sm" style="width: 150px;">
                    <input type="text" name="table_search" class="form-control float-right" placeholder="Search">

                    <div class="input-group-append">
                      <button type="submit" class="btn btn-default"><i class="fa fa-search"></i></button>
                    </div>
                  </div> -->
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <tbody>
                    <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Registered At</th>
                    <th>Modify</th>
                  </tr>

                  <tr v-for="(user, index) in users" :key="user.id">
                    <td>{{index+1}}</td>
                    <td>{{user.name}}</td>
                    <td>{{user.email}}</td>
                    <td>{{user.type | uptext}}</td> <!-- using filter uptext -->
                    <td>{{user.created_at | myDate}}</td>
                    <td>
                        <a href="#" @click="editModal(user)">
                            <i class="fa fa-edit color-blue"></i>
                        </a>
                        /
                        <a href="#" @click="deleteUser(user.id)">
                            <i class="fa fa-trash color-red"></i>
                        </a>
                    </td>
                  </tr>
               </tbody></table>
              </div>
              <!-- /.card-body -->
            </div>
            <!-- /.card -->
          </div>
        </div>
        <!-- Modal -->
        <div class="modal fade" id="addNewModal" tabindex="-1" role="dialog" aria-labelledby="addNewModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
            <div class="modal-header">
                <h5 v-if="!editMode" class="modal-title" id="addNewModalLabel">Add New</h5>
                <h5  v-if="editMode"  class="modal-title" id="addNewModalLabel">Update user info</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <form @submit.prevent="editMode ? editUser() : createUser()" >
                <div class="modal-body">
                    <div class="form-group">
                        <input v-model="form.name" type="text" name="name"
                            class="form-control" placeholder="Name" :class="{ 'is-invalid': form.errors.has('name') }">
                        <has-error :form="form" field="name"></has-error>
                    </div>
                    <div class="form-group">
                        <input v-model="form.email" type="email" name="email" value=""
                            class="form-control" placeholder="Email" :class="{ 'is-invalid': form.errors.has('email') }">
                        <has-error :form="form" field="email"></has-error>
                    </div>
                
                    <div class="form-group">
                        <textarea v-model="form.bio" name="bio"
                            class="form-control" placeholder="Some bio info (Optional)" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                        <has-error :form="form" field="bio"></has-error>
                    </div>
                    <div class="form-group">
                        <select class="form-control" name="type" id="type" v-model="form.type" :class="{ 'is-invalid': form.errors.has('type') }">
                            <option value="">Select User Role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="author">Author</option>
                        </select>
                        <has-error :form="form" field="type"></has-error>
                    </div>
                    
                    <div class="form-group">
                        <input v-model="form.password" type="password" name="password"
                            class="form-control" placeholder="Password" :class="{ 'is-invalid': form.errors.has('password') }">
                        <has-error :form="form" field="password"></has-error>
                    </div>

                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    <button v-if="editMode" type="submit" class="btn btn-success">Update</button>
                    <button v-if="!editMode" type="submit" class="btn btn-primary">Create</button>
                </div>
            </form>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                editMode:true,
                users: [],
                form: new Form({
                    id:'',
                    name: '',
                    email: '',
                    password: '',
                    type:'',
                    bio:'',
                    photo:'',
                })
            }
        },
        methods:{
            editModal(user){
              this.editMode = true;
              this.form.reset(); 
               this.form.clear(); 
              $('#addNewModal').modal('show');
              this.form.fill(user); 
            },
            newModal(){
                this.editMode = false;
                this.form.reset(); //v-form package
              $('#addNewModal').modal('show');
            },
            createUser(){
                this.$Progress.start(); // loading bar need refactor
                this.form.post('api/user')
                    .then(({ data }) => { 
                            toast({
                            type: 'success',
                            title: 'User created in successfully!'
                        })
                        $('#addNewModal').modal('hide');
                    })
                     .catch( error => {
                        console.log(error);
                    });
                Fire.$emit('AfterCreate') // Custom Vue Event (the name is mine) / Component Communication
             
                this.$Progress.finish();
            },
            editUser(){
                this.$Progress.start();
                this.form.put('api/user/'+this.form.id)
                .then(()=>{
                      $('#addNewModal').modal('hide');
                      swal(
                            'Updated!',
                            'The user has been Updated.',
                            'success'
                             )
                     Fire.$emit('AfterCreate');
                     this.$Progress.finish();
                })
                .catch(()=>{
                    this.$Progress.fail();
                })
            },

            loadUsers(){ // To Refactor => computed method the data
                axios.get('api/user')
                .then(({data})=> (this.users = data.data))
                .catch(function (error) {
                    console.log(error);
                });
            },

            deleteUser(id){
                swal({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                    }).then((result) => {
                 if (result.value) {
                     axios.delete('api/user/'+id)
                     .then(()=>{
                             swal(
                                 'Deleted!',
                                 'The user has been deleted.',
                                 'success'
                             )
                          Fire.$emit('AfterCreate');
                        })
                     .catch(function (error) {
                        console.log(error);
                          swal(
                            'Cancelled',
                            'Something went wrong',
                            'error'
                            )
                     });
                 }
               })
            }
        },
        mounted(){
            this.loadUsers();
            Fire.$on('AfterCreate', ()=> {
                this.loadUsers();
            })
            //setInterval(()=> this.loadUsers(),2000) //Reload changes real time with setInterval ??
        }
    }
</script>
