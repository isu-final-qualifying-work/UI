<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo2.png" width="50" height="50" />
    <h3>PET HOME</h3>

    <div class="wrapper">

      <nav>
        <RouterLink to="/">Главная</RouterLink>
        <RouterLink to="/login">Вход</RouterLink>
        <RouterLink to="/reg">Регистрация</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color:rgb(219, 223, 221);
  padding: 10px 20px;
  color:#2c3e50;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.logo {
  border-radius: 50%;
}

h3 {
  margin: 0;
  font-size: 1.5rem;
}

.wrapper {
  display: flex;
  align-items: center;
}

nav {
  display: flex;
  gap: 15px;
}

nav a {
  text-decoration: none;
  color: #2c3e50;
  font-weight: bold;
  padding: 8px 15px;
  border-radius: 5px;
  transition: background 0.3s;
}

nav a:hover {
  background: rgba(255, 255, 255, 0.2);
}

nav a.router-link-exact-active {
  background:#a9bdb9;
  color: #2c3e50;
}

</style>
