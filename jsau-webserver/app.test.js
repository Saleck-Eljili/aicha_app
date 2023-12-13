"use strict";

const request = require("supertest");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs").promises;
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(bodyParser.json());

// Mock de fs pour simuler la lecture de fichiers
jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

// Implémentez la route pour les tests
app.get("/messages", async (req, res) => {
  try {
    const data = await fs.readFile("messages.json", "utf8");
    res.send(data);
  } catch (err) {
    res.status(500).send("Erreur lors de la lecture du fichier");
  }
});

describe("GET /messages", () => {
  it("répond avec les messages en JSON", async () => {
    const mockMessages = JSON.stringify({
      messages: [
        { id: uuidv4(), message: "Hello World" },
        // Autres messages pour le test
      ],
    });

    fs.readFile.mockResolvedValue(mockMessages);

    await request(app)
      .get("/messages")
      .expect("Content-Type", /json/)
      .expect(200, mockMessages);
  });

  it("gère les erreurs lors de la lecture du fichier", async () => {
    fs.readFile.mockRejectedValue(new Error("Erreur de lecture"));

    await request(app).get("/messages").expect(500);
  });
});
