import * as functions from "firebase-functions";
import cors from "cors";
import express from "express";
// @ts-ignore no type for this :)
import fileParser from "express-multipart-file-parser";
import AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import { isArray } from "util";

const s3 = new AWS.S3({
  accessKeyId: functions.config().aws.accesskey,
  secretAccessKey: functions.config().aws.secretkey
});

const app = express();
app.use(
  cors({
    origin: function(origin: string | undefined, callback: any) {
      console.log(origin);
      if (
        origin === "http://localhost:3000" ||
        origin?.endsWith("recipe-maillet.netlify.com") ||
        (origin?.endsWith("gitpod.io") && origin.includes("3000-nebulis-recipe"))
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  })
);

const Bucket = "recipe-lma";
app.use(fileParser);
app.post("/", (req: any, res: any) => {
  const file = isArray(req.files) ? req.files[0] : undefined;
  if (!file) {
    res.status(500).send({ message: "Unable to parse the file" });
    return;
  }
  const params: AWS.S3.PutObjectRequest = {
    ACL: "public-read",
    Body: file.buffer,
    Bucket,
    CacheControl: "max-age=63113904",
    ContentType: file.mimetype,
    Key: uuid()
  };
  s3.upload(params)
    .promise()
    .then((data: any) => {
      console.log(data);
      res.json({ url: data.Location });
    })
    .catch((e: any) => {
      console.error(e);
      res.status(500).json(e);
    });
});
app.delete("/:id", (req: any, res: any) => {
  const params: AWS.S3.DeleteObjectRequest = {
    Bucket,
    Key: req.params.id
  };
  s3.deleteObject(params)
    .promise()
    .then((data: any) => {
      console.log(data);
      res.json({ message: "ok" });
    })
    .catch((e: any) => {
      console.error(e);
      res.status(500).json(e);
    });
});

exports.upload = functions.https.onRequest(app);
