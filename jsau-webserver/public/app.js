document.getElementById("loadMessages").addEventListener("click", () => {
  fetch("/getmsg")
    .then((response) => response.json())
    .then((messages) => {
      const messagesList = document.getElementById("messagesList");
      messagesList.innerHTML = "";
      messages.forEach((message) => {
        const li = document.createElement("li");
        li.textContent = JSON.stringify(message);
        messagesList.appendChild(li);
      });
    })
    .catch((error) => console.error("Erreur:", error));
});
