<template>
    <div class="container">
      <h2>Вход</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="name">Имя: </label>
          <input type="text" id="name" v-model="name" class="form-control">
        </div>
        <div class="form-group">
          <label for="password">Пароль: </label>
          <input type="password" id="password" v-model="password" class="form-control">
        </div>
        <button type="submit" class="btn btn-primary">Войти</button>
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

<style scoped>
.container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background: #f8f9fa;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.btn {
  width: 100%;
  padding: 10px;
  background-color: #a9bdb9;
  color: #2c3e50;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn:hover {
  background-color:rgb(127, 145, 141);
}
</style>