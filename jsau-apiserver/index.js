"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
app.use(bodyParser.json());

const filePath = "messages.json";

function getMessages(callback) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}
// Route pour afficher tous les messages
app.get("/messages", (req, res) => {
  getMessages((err, data) => {
    if (err) {
      res.status(500).send("Erreur lors de la lecture du fichier");
    } else {
      res.send(data);
    }
  });
});

function addMessage(newMessage) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      const file = JSON.parse(data);
      file.messages.push(newMessage);

      fs.writeFile(filePath, JSON.stringify(file), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve("Message ajouté");
        }
      });
    });
  });
}

// Route pour écrire un message

app.post("/message", (req, res) => {
  const newMessage = req.body;

  addMessage(newMessage)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send("Erreur lors de l'ajout du message : " + err);
    });
});

async function updateMessage(id, updatedMessage) {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    const file = JSON.parse(data);
    const messageIndex = file.messages.findIndex((m) => m.id === id);

    if (messageIndex === -1) {
      throw new Error("Message non trouvé");
    }

    file.messages[messageIndex] = updatedMessage;
    await fs.promises.writeFile(filePath, JSON.stringify(file));
    return "Message mis à jour";
  } catch (err) {
    throw err;
  }
}

// D'autres routes pour modifier et supprimer des messages...

app.put("/message/:id", async (req, res) => {
  const id = req.params.id;
  const updatedMessage = req.body;

  try {
    const result = await updateMessage(id, updatedMessage);
    res.send(result);
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la mise à jour du message : " + err.message);
  }
});

app.delete("/message/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) throw err;
    const file = JSON.parse(data);
    const updatedMessages = file.messages.filter((m) => m.id !== id);

    if (file.messages.length !== updatedMessages.length) {
      file.messages = updatedMessages;
      fs.writeFile(filePath, JSON.stringify(file), (err) => {
        if (err) throw err;
        res.send("Message supprimé");
      });
    } else {
      res.status(404).send("Message non trouvé");
    }
  });
});

app.listen(3000, () => {
  console.log("Serveur démarré sur le port 3000");
});
