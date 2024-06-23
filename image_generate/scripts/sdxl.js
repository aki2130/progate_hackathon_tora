import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import fs from "fs";
import "dotenv/config";


// Create a new BedrockRuntimeClient
const client = new BedrockRuntimeClient({
  region: "us-west-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const imageData =  fs.readFileSync("./output/image2.png");
const imageBase64 = Buffer.from(imageData).toString('base64');
const params = {
    "modelId": "stability.stable-diffusion-xl-v1",
    "contentType": "application/json",
    "accept": "application/json",
    "body": JSON.stringify({
      text_prompts: [
        {
          text: "A beautiful sunset over the ocean, best quality",
          weight: 1,
        },
      ],
      init_image: imageBase64,
      image_strength: 0.7,
      cfg_scale: 10,
      seed: 1,
      steps: 50,
      width: 512,
      height: 512,
    }),
};

const invokeModel = async () => {
  try {
    const command = new InvokeModelCommand(params);
    const response = await client.send(command);

    // Parse the response and extract the image
    const textDecoder = new TextDecoder("utf-8");
    const responseBodyText = textDecoder.decode(response.body);
    const responseBody = JSON.parse(responseBodyText);
    const base64Image = responseBody.artifacts[0].base64;

    // Convert the base64 image to binary data
    const binaryData = Buffer.from(base64Image, "base64");

    // Write the image to a file
    fs.writeFileSync("output/image.json", responseBodyText);
    fs.writeFileSync("output/image4.png", binaryData);
    console.log("Image saved as output_image.png");
  } catch (error) {
    console.error("Error invoking model:", error);
  }
};

invokeModel();
