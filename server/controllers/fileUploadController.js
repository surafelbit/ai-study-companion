const express = require("express");
const axios = require("axios");
const pdf = require("pdf-parse");
const AIResponse = require("../models/AIResponse");
const UploadFile = require("../models/UploadFile");
exports.uploader = async function (req, res) {
  try {
    const imported = req.file.path;
    console.log(req.file, "this is req file");
    console.log("reached succesfully here", imported);
    const response = await axios.get(
      imported,
      //"https://res.cloudinary.com/djz4nl0ic/raw/upload/v1754640917/uploads/ekwxafmgtljbdncfvmvx",
      { responseType: "arraybuffer" }
    );
    const bufferedData = response.data;
    const data2 = await pdf(bufferedData);
    const datas = await UploadFile.create({
      fileUrl: imported,
      fileName: req.file.originalname,
      user: req.user._id,
      extractedText: data2.text,
    });
    const aidata = await AIResponse.create({
      file: datas._id,
      user: req.user._id,
    });
    console.log(datas._id, "this should be the id of the file uploaded");
    res.status(200).json({
      aidata,
      datas,
      notice: "we have succesfully analyzed you data",
      data: data2.text,
      message: "succesfully reached here",
    });
  } catch (error) {
    console.log(error, "this is the error");
    res.status(400).json({ error });
  }
};
exports.extract = async function (req, res) {
  try {
    const response = await axios.get(
      "https://res.cloudinary.com/djz4nl0ic/raw/upload/v1754640917/uploads/ekwxafmgtljbdncfvmvx",
      { responseType: "arraybuffer" }
    );
    const bufferedData = response.data;
    const data = await pdf(bufferedData);
    console.log(data);
    // const AIResponses = await AIResponse.create({});
    res.status(200).json({
      message: "success",
      //  data,
      text: data.text,
      numpages: data.numpages,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error,
    });
  }
};
exports.getFiles = async function (req, res) {
  try {
    const files = await UploadFile.find({ user: req.user._id }).sort({
      uploadedAt: -1,
    });
    res.status(200).json({
      status: "success",
      results: files.length,
      data: {
        files,
      },
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
