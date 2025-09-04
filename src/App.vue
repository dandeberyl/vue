<script setup>
import { ref } from "vue"
import axios from "axios"

const username = ref("")
const password = ref("")
const token = ref(localStorage.getItem("token") || "")
const profile = ref(null)

const errorMessage = ref("")
const showError = ref(false)

const login = async () => {
  try {
    const { data } = await axios.post("http://localhost:3000/login", {
      username: username.value,
      password: password.value
    })
    token.value = data.token
    localStorage.setItem("token", data.token)
    errorMessage.value = ""
    showError.value = false
  } catch (err) {
    errorMessage.value = "Invalid username or password!"
    showError.value = true
    setTimeout(() => (showError.value = false), 3000)
  }
}

const getProfile = async () => {
  try {
    const { data } = await axios.get("http://localhost:3000/profile", {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    profile.value = data
  } catch (err) {
    errorMessage.value = "Unauthorized. Please log in again."
    showError.value = true
    setTimeout(() => (showError.value = false), 3000)
  }
}

const logout = () => {
  token.value = ""
  profile.value = null
  localStorage.removeItem("token")
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 relative">

    <transition name="fade">
      <div
        v-if="showError"
        class="absolute top-6 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
      >
        {{ errorMessage }}
      </div>
    </transition>

    <div v-if="!token" class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>
      
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-gray-600 mb-1">Username</label>
          <input
            v-model="username"
            placeholder="Enter your username"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label class="block text-gray-600 mb-1">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter your password"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Login
        </button>
      </form>
    </div>

    <div v-else class="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-green-600">Authenticated!</h2>

      <div class="flex space-x-4 mb-6 justify-center">
        <button
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          @click="getProfile"
        >
          Get Profile
        </button>
        <button
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
          @click="logout"
        >
          Logout
        </button>
      </div>

      <div v-if="profile" class="bg-gray-50 p-4 rounded-lg border text-sm text-gray-700">
        <pre class="whitespace-pre-wrap">{{ profile }}</pre>
      </div>
    </div>
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
