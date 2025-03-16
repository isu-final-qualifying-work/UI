<template>
  <input v-model="login" placeholder="Логин" />
  <input type="password" v-model="password" placeholder="Пароль" />
  <button @click="submitForm">Вход</button>
</template>
