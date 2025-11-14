const { OpenAI } = require("openai");

const AIResponse = require("../models/AIResponse");
require("dotenv").config();
const UploadFile = require("../models/UploadFile");
exports.ask = async function (req, res) {
  try {
    const questions = req.body.question;
    const token = process.env.AI_API;
    const referenceText =
      // undefined;
      await UploadFile.findById("6895e456d8f0b25f93a08b8c");
    if (referenceText) {
      //UploadFile.findById("6895e456d8f0b25f93a08b8c");
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

      let airesponse = await AIResponse.findOne({
        file: "6895dd2eaaa222045ab48dab",
        user: "688f726069ee334a7ffc3dde",
      });
      if (!airesponse) {
        airesponse = await new AIResponse({
          file: "6895dd2eaaa222045ab48dab",
          user: "688f726069ee334a7ffc3dde",
          interactions: [],
        });
      }
      await airesponse.interactions.push({
        question: req.body.question,
        answer: response.choices[0].message.content,
      });
      await airesponse.save();

      // if(response){
      //   await AIResponse.push()
      // }
      // const airesponses = await AIResponse.create({
      //   file: "6895dd2eaaa222045ab48dab",
      //   user: "688f726069ee334a7ffc3dde",
      //   interactions: [
      //     {
      //       question: req.body.question,
      //       answer: response.choices[0].message.content,
      //     },
      //   ],
      //   // question: "",
      //   // answer: response.choices[0].message.content,
      // });
      console.log(response.choices[0].message.content);
      res.status(200).json({
        answer: response.choices[0].message.content,
      });
    }
    if (!referenceText) {
      try {
        const client = new OpenAI({
          baseURL: "https://models.github.ai/inference",
          apiKey: token,
        });
        const responsewithoutfile = await client.chat.completions.create({
          messages: [
            {
              role: "system",
              content:
                "You are an AI tutor helping students answer questions based on their study materials.",
            },
            {
              role: "user",
              content: ` Answer this questions ${questions}?`,
            },
          ],
          model: "openai/gpt-4o",
          temperature: 1,
          max_tokens: 4096,
          top_p: 1,
        });
        let content;
        //await AIResponse.findById("");
        if (!content) {
          const newresponse = await new AIResponse({
            user: "688f726069ee334a7ffc3dde",
            interactions: [
              {
                question: req.body.question,
                answer: responsewithoutfile.choices[0].message.content,
              },
            ],
          });
          await newresponse.save();
        }
        res.status(200).json({
          message: "without a file normal chatgpt",
          answer: responsewithoutfile.choices[0].message.content,
        });
      } catch (error) {
        console.log(error);
        res.status(400).json({
          error,
        });
      }
    }

    //return response.choices[0].message.content;
  } catch (error) {
    res.status(400).json({ error });
    console.log(error);
  }
};
