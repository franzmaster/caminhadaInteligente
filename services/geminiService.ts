import { GoogleGenAI } from "@google/genai";
import { UserData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWalkingPlan = async (data: UserData): Promise<string> => {
  const prompt = `
    Atue como um treinador físico profissional especializado em caminhada e perda de peso.
    
    Crie um plano de caminhada curto, motivador e estruturado para uma pessoa com o seguinte perfil:
    - Idade: ${data.age} anos
    - Altura: ${data.height} cm
    - Peso Atual: ${data.currentWeight} kg
    - Meta de Perda de Peso: ${data.weightToLose} kg
    - Nível de Condicionamento: ${data.level}
    
    O plano deve incluir:
    1. Frequência semanal recomendada.
    2. Duração por sessão (começando devagar se for iniciante).
    3. Uma estimativa aproximada de quanto tempo levará para perder os ${data.weightToLose}kg com segurança (considere déficit calórico moderado).
    4. Uma dica de nutrição simples.
    
    Formato: Use Markdown para formatar a resposta. Seja direto, use emojis, e mantenha o tom encorajador. O texto deve ser curto o suficiente para ser lido rapidamente em uma tela de celular. Use português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text || "Não foi possível gerar o plano. Tente novamente.";
  } catch (error) {
    console.error("Error generating plan:", error);
    return "Ocorreu um erro ao conectar com a IA. Verifique sua conexão e tente novamente.";
  }
};