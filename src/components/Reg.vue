<template>
    <div class="container">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <label for="name">Username:</label>
          <input type="text" id="name" v-model="name" class="form-control">
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">Register</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'UserRegister',
    data() {
      return {
        name: '',
        password: ''
      };
    },
    methods: {
      async register() {
        try {
          const response = await axios.post('http://localhost:8000/register', {
            name: this.name,
            password: this.password
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          localStorage.setItem('token', response.data.access_token);
          this.$router.push('/');
        } catch (error) {
          console.error(error);
        }
      }
    }
  };
  </script>
  