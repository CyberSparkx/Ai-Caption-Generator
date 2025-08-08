const {GoogleGenAI}  = require("@google/genai");
const ai = new GoogleGenAI({});

const generateCaption = async (base64ImageFile,prompt)=>{

    const contents = [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64ImageFile,
          },
        },
        { text: prompt },
      ];
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
      });
      return(response.text);

}


module.exports = generateCaption;