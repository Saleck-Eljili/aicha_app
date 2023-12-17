<template>
  <div id="app">
    <add-message-form @message-added="fetchMessages" />
    <messages-list :messages="messages" @message-deleted="fetchMessages" />
  </div>
</template>

<script>
import MessagesList from "./components/MessagesList.vue";
import AddMessageForm from "./components/AddMessageForm.vue";

export default {
  name: "App",
  components: {
    MessagesList,
    AddMessageForm,
  },
  data() {
    return {
      messages: [],
    };
  },
  methods: {
    fetchMessages() {
  fetch('http://localhost:3000/messages')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      this.messages = data.messages;
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

  },
  mounted() {
    this.fetchMessages();
  },
};
</script>

<style>
body {
  font-family: "Arial", sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 20px;
}

#app {
  max-width: 600px;
  margin: auto;
  background: white;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #008cba;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #005f73;
}
</style>
