import axios from "axios";
import FormData from "form-data";

const PINATA_API_KEY = "201fd450ab585de3e786";
const PINATA_API_SECRET = "9c565fdc674957d6efe97c3a7120281563dc9d388b045743242383437b28f1f0";

export async function POST(req) {
  try {
    const { file, fileName } = await req.json(); // Parse the request payload

    if (!file || !fileName) {
      return new Response(
        JSON.stringify({ error: "File and fileName are required." }),
        { status: 400 }
      );
    }

    // Prepare the file for Pinata
    const formData = new FormData();
    formData.append("file", Buffer.from(file, "base64"), fileName);

    // Upload to Pinata
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
                    pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_API_SECRET,
        },
      }
    );

    const { IpfsHash } = response.data;
    return new Response(
      JSON.stringify({ message: "File uploaded successfully", hash: IpfsHash }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return new Response(
      JSON.stringify({ error: "File upload failed" }),
      { status: 500 }
    );
  }
}

