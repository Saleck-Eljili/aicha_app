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

export default {
  data() {
    return {
      newMessage: "",
    };
  },
  methods: {
    submitForm() {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: this.newMessage })
  };

  fetch('http://localhost:3000/message', requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(() => {
      this.newMessage = '';
      this.$emit('message-added');
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

  },
};
</script>
