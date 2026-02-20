import AWS from "aws-sdk";
import { log } from "console";

const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY_ID  ,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const Bucket = "recipe-lma";

export default async (req: Request) => {
  const blob = await req.formData();
  const key = (await blob.get("key")) as string | null;
  if (!key) {
    return new Response(JSON.stringify({ message: "Unable to retrieve the key" }), { status: 400 });
  }
  const params: AWS.S3.DeleteObjectRequest = {
    Bucket,
    Key: key
  };

  try {
    await s3.deleteObject(params).promise();
    return new Response(JSON.stringify({ message: "ok" }));
  } catch (error) {
    console:log({error})
    return new Response(JSON.stringify({ message: "Unable to delete the file" }), { status: 500 });
  }
};

