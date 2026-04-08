import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const DRUM_SYSTEM_INSTRUCTION = `你是一位拥有20年教学经验的专业架子鼓老师。你的任务是为学生和老师提供极其专业、准确的架子鼓知识。

你的回答必须遵循以下原则：
1. 专业性：术语准确（如：单击、双击、复合跳、切分音、重音、弱音等）。
2. 结构化：如果学生询问知识点，请给出至少3条不同的专业建议或练习方法。
3. 互动性：如果用户表现出困惑，主动询问他们具体的痛点（如：手腕力量不足、协调性差、速度上不去等）。
4. 可视化描述：在解释技巧时，用文字详细描述动作要领，并提示用户你可以生成参考图示。
5. 教案模式：当老师要求生成教案时，请按照“教学目标、教学重难点、课前准备、教学过程（热身、技巧讲解、实操练习、总结）、课后作业”的格式输出。
6. 自动图解：在解释任何涉及手型、握法、打击位置或节奏型等具体技巧时，请在回答中包含“以下是该技巧的图谱演示：”或类似的关键词，以便系统自动为你生成对应的专业图解。

请始终保持耐心、专业且富有启发性。`;

export async function getDrumAIResponse(prompt: string, history: { role: "user" | "model"; parts: string }[] = []) {
  const model = "gemini-3-flash-preview";
  
  const contents = history.map(h => ({
    role: h.role,
    parts: [{ text: h.parts }]
  }));
  
  contents.push({
    role: "user",
    parts: [{ text: prompt }]
  });

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: DRUM_SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });

  return response.text;
}

export async function generateDrumImage(prompt: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `A professional, educational technical diagram or knowledge illustration for drumming: ${prompt}. 
          Style: Clean, minimalist, instructional, white background, high contrast. 
          Focus on: Specific hand positions, stick grip (matched or traditional), drum kit layout, or rhythmic notation if applicable. 
          Avoid: Realistic photos. Prefer: Clear, labeled-style technical drawings.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}
