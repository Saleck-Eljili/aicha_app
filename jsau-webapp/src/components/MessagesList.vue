<template>
  <div>
    <h2>Messages</h2>
    <ul>
      <li v-for="message in messages" :key="message.id">
        {{ message.message }}
        <button @click="deleteMessage(message.id)">Supprimer</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    messages: Array,
  },
  methods: {
    deleteMessage(id) {
      axios
        .delete(`http://localhost:3000/message/${id}`)
        .then(() => {
          this.$emit("message-deleted");
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
