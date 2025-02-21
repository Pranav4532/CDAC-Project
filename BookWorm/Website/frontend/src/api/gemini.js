import axios from "axios";

const GEMINI_API_KEY = "AIzaSyD_uZmp3_ZF_6yiqFQklbUMVyR6SlOBweI"; 

export const fetchAIDescription = async (title, author) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              { text: `Give a detailed summary of the book "${title}" written by ${author}.` },
            ],
          },
        ],
      }
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No description available.";
  } catch (error) {
    console.error("Error fetching AI description:", error);
    return "Could not generate description. Please try again later.";
  }
};
