<!-- <template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template> -->
<template>
  <div>
    <h1>Nuxt.js + Supabase</h1>

    <!-- Автентифікація -->
    <div v-if="!user">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button @click="signUp">Sign Up</button>
      <button @click="signIn">Sign In</button>
    </div>

    <!-- Вихід -->
    <div v-else>
      <p>Welcome, {{ user.email }}!</p>
      <button @click="signOut">Sign Out</button>
    </div>

    <!-- Робота з базою даних -->
    <div>
      <h2>Tasks</h2>
      <input v-model="newTask" placeholder="New task" />
      <button @click="addTask">Add Task</button>
      <ul>
        <li v-for="task in tasks" :key="task.id">{{ task.title }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const { $supabase } = useNuxtApp();
// const { supabaseUrl, supabaseKey } = useRuntimeConfig().public;

// console.log('Supabase URL:', process.env.SUPABASE_URL);
// console.log('Supabase Key:', process.env.SUPABASE_KEY);

// console.log('Supabase URL:', supabaseUrl);
// console.log('Supabase Key:', supabaseKey);

const email = ref('');
const password = ref('');
const user = ref(null);
const tasks = ref([]);
const newTask = ref('');

// Перевірка автентифікації
const checkAuth = async () => {
  const { data: { user: authUser } } = await $supabase.auth.getUser();
  user.value = authUser;
  if (authUser) fetchTasks();
};

// Реєстрація
const signUp = async () => {
  const { data, error } = await $supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });
  if (error) alert(error.message);
  else user.value = data.user;
};

// Вхід
const signIn = async () => {
  const { data, error } = await $supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  if (error) alert(error.message);
  else user.value = data.user;
};

// Вихід
const signOut = async () => {
  const { error } = await $supabase.auth.signOut();
  if (error) alert(error.message);
  else user.value = null;
};

// Отримання завдань
const fetchTasks = async () => {
  const { data, error } = await $supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.value.id);
  if (error) alert(error.message);
  else tasks.value = data;
};

// Додавання завдання
const addTask = async () => {
  const { data, error } = await $supabase
    .from('tasks')
    .insert([{ title: newTask.value, user_id: user.value.id }]);
  if (error) alert(error.message);
  else {
    tasks.value.push(data[0]);
    newTask.value = '';
  }
};

// Перевірка автентифікації при завантаженні сторінки
onMounted(() => {
  checkAuth();
});
</script>