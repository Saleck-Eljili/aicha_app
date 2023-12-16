<template>
  <div>
    <h2>Ajouter un Message</h2>
    <form @submit.prevent="submitForm">
      <input type="text" v-model="newMessage" placeholder="Écrire un message" />
      <button type="submit">Ajouter</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      newMessage: "",
    };
  },
  methods: {
    submitForm() {
      axios
        .post("http://localhost:3000/message", { message: this.newMessage })
        .then(() => {
          this.newMessage = "";
          this.$emit("message-added");
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
