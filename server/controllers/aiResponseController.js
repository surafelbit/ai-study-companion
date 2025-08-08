const { OpenAI } = require("openai");

const AIResponse = require("../models/AIResponse");
require("dotenv").config();

exports.ask = async function (req, res) {
  try {
    const token = process.env.AI_API;
    console.log(process.env.AI_API, " this man");

    const client = new OpenAI({
      baseURL: "https://models.github.ai/inference",
      apiKey: token,
    });
    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are an AI tutor helping students answer questions based on their study materials.",
        },
        { role: "user", content: "What is the capital of France?" },
      ],
      model: "openai/gpt-4o",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });
    console.log(response.choices[0].message.content);
    res.status(response);
    //return response.choices[0].message.content;
  } catch (error) {
    res.status(400).json({ error });
    console.log(error);
  }
};
