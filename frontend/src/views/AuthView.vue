<script setup lang="ts">
import { ref } from 'vue';
import { loginUser, registerUser } from '../services/authService';
import { useRouter } from 'vue-router'

const username = ref('');
const email = ref('');
const password = ref('');
const message = ref('');
const isLogin = ref(true);
const router = useRouter()

const submitForm = async () => {
  try {
    message.value = '';

    if (isLogin.value) {
      await loginUser(email.value, password.value);
      message.value = 'Login correcto';
      await router.push('/')
    } else {
      await registerUser(username.value, email.value, password.value);
      message.value = 'Usuario registrado correctamente';
      await router.push('/')
    }
  } catch (error) {
    if (error instanceof Error) {
      message.value = error.message;
    } else {
      message.value = 'Error desconocido';
    }
  }
};
</script>

<template>
  <main class="auth-page">
    <section class="auth-box">
      <h1>{{ isLogin ? 'Iniciar sesión' : 'Crear cuenta' }}</h1>

      <form @submit.prevent="submitForm">
        <input
          v-if="!isLogin"
          v-model="username"
          type="text"
          placeholder="Nombre de usuario"
        />

        <input
          v-model="email"
          type="email"
          placeholder="Correo"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
        />

        <button type="submit">
          {{ isLogin ? 'Entrar' : 'Registrarse' }}
        </button>
      </form>

      <button class="secondary-button" @click="isLogin = !isLogin">
        {{ isLogin ? 'Crear cuenta nueva' : 'Ya tengo cuenta' }}
      </button>

      <p v-if="message">{{ message }}</p>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #111827;
  color: white;
}

.auth-box {
  width: 340px;
  display: grid;
  gap: 14px;
}

form {
  display: grid;
  gap: 10px;
}

input,
button {
  padding: 10px;
  border-radius: 6px;
  border: none;
}

button {
  cursor: pointer;
  font-weight: bold;
}

.secondary-button {
  background: #374151;
  color: white;
}
</style>