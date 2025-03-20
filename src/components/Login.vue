<template>
    <div class="container">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="name">Username:</label>
          <input type="text" id="name" v-model="name" class="form-control">
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
    </div>
  </template>

  <script>
  import axios from 'axios';
  
  export default {
    name: 'UserLogin',
    data() {
      return {
        name: '',
        password: ''
      };
    },
    methods: {
      async login() {
        try {
          const response = await axios.post('http://localhost:8000/token', {
            name: this.name,
            password: this.password
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