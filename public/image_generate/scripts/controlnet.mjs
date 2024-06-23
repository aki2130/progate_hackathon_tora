import Replicate from "replicate";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";

// .envファイルから環境変数を読み込む
dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const genre = process.env.SELECTED_GENRE;
console.log(`Selected genre: ${genre}`);

const output = await replicate.run(
  "jagilley/controlnet-canny:aff48af9c68d162388d230a2ab003f68d2638d88307bdaf1c2f1ac95079c9613",
  {
    input: {
      image: "https://replicate.delivery/pbxt/IMPLYODUwdmHTsnLKi5YiFccIAK6g9l5KK1FNyCtpGS1g0UN/1200.jpeg",
      scale: 9,
      prompt: `a ${genre} metallic cyborg bird`,
      a_prompt: "best quality, extremely detailed",
      n_prompt: "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality",
      ddim_steps: 20,
      num_samples: "1",
      low_threshold: 100,
      high_threshold: 200,
      image_resolution: "512"
    }
  }
);
console.log(output);

// 画像のURLリストを取得
const imageUrls = output;

// 画像をダウンロードして保存する関数
const downloadImage = async (url, outputPath) => {
  const response = await fetch(url);
  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  console.log(`Image saved to ${outputPath}`);
};

// 保存するファイルパスを設定
const outputImagePath1 = path.resolve("image_generate/output/output_image_1.png");
const outputImagePath2 = path.resolve("image_generate/output/output_image_2.png");

// 画像をダウンロードして保存
await downloadImage(imageUrls[0], outputImagePath1);
await downloadImage(imageUrls[1], outputImagePath2);

console.log("Images have been downloaded and saved.");
