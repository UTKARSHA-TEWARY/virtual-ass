import axios from "axios";

const geminiResponse = async (command, name, userName) => {
  try {
    const apiUrl = process.env.GEMINI_API_URL;

    const prompt = `
You are a voice-enabled virtual assistant named "${name}", created by "${userName}". 
You understand user speech and return a pure JSON response. No extra text.

Respond ONLY in this strict JSON format:

{
  "type": "general" | "google_search" | "youtube_search" | "youtube_play" | "get_time" | "get_date" | "get_day" | "get_month" | "calculator_open" | "instagram_open" | "weather_show",
  "userInput": "<original user input without assistant name>",
  "response": "<short reply to say aloud>"
}

Type meanings:
- "general": factual Q&A, e.g. "What is AI?"
- "google_search": e.g. "Search India population on Google"
- "youtube_search": e.g. "Search Messi goals on YouTube"
- "youtube_play": e.g. "Open YouTube" or "Play music"
- "get_time": e.g. "What time is it"
- "get_date": e.g. "What's the date today"
- "get_day": e.g. "Which day is today"
- "get_month": e.g. "Which month is this"
- "calculator_open": e.g. "Open calculator"
- "instagram_open": e.g. "Open Instagram"
- "weather_show": e.g. "Show me weather"

Now respond for: "${command}"

Important:
- Remove your own name if mentioned in the userInput.
- No markdown, no code blocks, no explanation. Output ONLY valid JSON.
`;

    const result = await axios.post(apiUrl, {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    });

    const responseText = result?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) throw new Error("Gemini response is empty");

    return JSON.parse(responseText);
  } catch (err) {
    console.error("Gemini response error:", err.message);
    return {
      type: "general",
      userInput: command,
      response: "Sorry, the assistant failed to respond."
    };
  }
};

export default geminiResponse;




