const { OpenAI } = require("openai");

const AIResponse = require("../models/AIResponse");
require("dotenv").config();
const UploadFile = require("../models/UploadFile");
exports.ask = async function (req, res) {
  try {
    const questions = req.body.question;
    const token = process.env.AI_API;
    console.log(process.env.AI_API, " this man");
    const referenceText = await UploadFile.findById("6895e456d8f0b25f93a08b8c");
    const mainText = referenceText.extractedText;
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
        {
          role: "user",
          content: ` from this ${mainText} Answer this questions ${questions}?`,
        },
      ],
      model: "openai/gpt-4o",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });
    console.log(response.choices[0].message.content);
    res.status(200).json({
      answer: response.choices[0].message.content,
    });
    //return response.choices[0].message.content;
  } catch (error) {
    res.status(400).json({ error });
    console.log(error);
  }
};
