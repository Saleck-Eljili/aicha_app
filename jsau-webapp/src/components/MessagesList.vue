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

export default {
  props: {
    messages: Array,
  },
  methods: {
    deleteMessage(id) {
  fetch(`http://localhost:3000/message/${id}`, { method: 'DELETE' })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      this.$emit('message-deleted');
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}

  },
};
</script>
