"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const app = express();
app.use(bodyParser.json());

app.set("view engine", "ejs"); // Définir EJS comme moteur de template
app.set("views", "views"); // Définir le dossier des vues
app.use(express.static("public")); // 'public' est le nom du dossier contenant vos fichiers HTML

const filePath = "messages.json";

app.get("/api-test", (req, res) => {
  res.render("apiTest"); // Rendu de la vue apiTest.ejs
});

function replaceWordsWithEmojis(text) {
  const wordToEmojiMap = {
    heureux: "😄",
    triste: "😢",
    amour: "❤️",
    cool: "😎",
    colère: "😡",
    rire: "😂",
    bisous: "😘",
    yeux: "👀",
    musique: "🎵",
    soleil: "☀️",
    lune: "🌙",
    étoile: "⭐",
    chat: "😺",
    chien: "🐶",
    fleur: "🌸",
    "arc-en-ciel": "🌈",
    café: "☕",
    gâteau: "🍰",
    livre: "📖",
    ordinateur: "💻",
    téléphone: "📱",
    voiture: "🚗",
    avion: "✈️",
    bateau: "⛵",
    maison: "🏠",
    famille: "👨‍👩‍👧‍👦",
    travail: "💼",
    argent: "💰",
    coeur: "💖",
    heure: "🕒",
    montagne: "⛰️",
    plage: "🏖️",
    forêt: "🌳",
    sport: "⚽",
    art: "🎨",
    film: "🎬",
    jeu: "🎮",
    ampoule: "💡",
    question: "❓",
    idée: "💡",
    calendrier: "📅",
    horloge: "🕰️",
    cadeau: "🎁",
    météo: "🌦️",
    "bonhomme de neige": "☃️",
    bonjour: "🌞",
    salut: "👋",
  };

  // Créez une expression régulière avec tous les mots à remplacer
  const regex = new RegExp(Object.keys(wordToEmojiMap).join("|"), "gi");

  // Remplacez les mots par leurs emojis correspondants
  const updatedText = text.replace(
    regex,
    (match) => wordToEmojiMap[match.toLowerCase()]
  );

  return updatedText;
}

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
      newMessage.message = replaceWordsWithEmojis(newMessage.message); // Remplacez le texte par sa version emoji
      file.messages.push(newMessage);

      fs.writeFile(filePath, JSON.stringify(file), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(newMessage);
        }
      });
    });
  });
}

// Route pour écrire un message
app.post("/message", (req, res) => {
  const newMessage = {
    id: uuidv4(), // Génère un ID unique
    timestamp: new Date().toISOString(), // Timestamp actuel
    ...req.body,
  };

  addMessage(newMessage)
    .then((result) => {
      res.send({ status: "success", message: "Message ajouté", data: result });
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

    updatedMessage.message = replaceWordsWithEmojis(updatedMessage.message); // Remplacez le texte par sa version emoji
    file.messages[messageIndex] = {
      ...file.messages[messageIndex],
      ...updatedMessage,
    };
    await fs.promises.writeFile(filePath, JSON.stringify(file));
    return file.messages[messageIndex];
  } catch (err) {
    throw err;
  }
}

// Route pour modifier un message
app.put("/message/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await updateMessage(id, req.body);
    res.send({
      status: "success",
      message: "Message mis à jour",
      data: result,
    });
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la mise à jour du message : " + err.message);
  }
});

// Route pour supprimer un message
app.delete("/message/:id", async (req, res) => {
  try {
    const data = await fs.promises.readFile(filePath, "utf8");
    const file = JSON.parse(data);
    const updatedMessages = file.messages.filter((m) => m.id !== req.params.id);

    if (file.messages.length !== updatedMessages.length) {
      file.messages = updatedMessages;
      await fs.promises.writeFile(filePath, JSON.stringify(file));
      res.send({ status: "success", message: "Message supprimé" });
    } else {
      res.status(404).send({ status: "error", message: "Message non trouvé" });
    }
  } catch (err) {
    res
      .status(500)
      .send("Erreur lors de la suppression du message : " + err.message);
  }
});

app.listen(3000, () => {
  console.log("Serveur démarré sur le port 3000");
});
