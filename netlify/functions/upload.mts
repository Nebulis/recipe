import AWS from "aws-sdk";
import { log } from "console";
import { v4 as uuid } from "uuid";

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID  ,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const Bucket = "recipe-lma";

export default async (req: Request) => {
  const blob = await req.formData();
  const file = (await blob.get("file")) as File | null;
  if (!file) {
    return new Response(JSON.stringify({ message: "Unable to parse the file" }), { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const params: AWS.S3.PutObjectRequest = {
    ACL: "public-read",
    Body: buffer,
    Bucket,
    CacheControl: "max-age=63113904",
    ContentType: file.type,
    Key: uuid()
  };
  try {
    const data = await s3.upload(params).promise();
    return new Response(JSON.stringify({ url: data.Location }));
  } catch (error) {
    console:log({error})
    return new Response(JSON.stringify({ message: "Unable to save the file" }), { status: 500 });
  }
};

// app.delete("/:id", (req: any, res: any) => {
//   const params: AWS.S3.DeleteObjectRequest = {
//     Bucket,
//     Key: req.params.id
//   };
//   s3.deleteObject(params)
//     .promise()
//     .then((data: any) => {
//       console.log(data);
//       res.json({ message: "ok" });
//     })
//     .catch((e: any) => {
//       console.error(e);
//       res.status(500).json(e);
//     });
// });

// exports.upload = functions.https.onRequest(app);
