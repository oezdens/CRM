// NOTE: This service requires @google/genai package which may have a different name
// Commenting out until proper package is identified
// import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Customer, CustomerStatus, Article } from "@/types";

// Placeholder - AI functionality temporarily disabled
export const generateCustomer = async (): Promise<Customer | null> => {
  console.warn('AI generation is temporarily disabled');
  return null;
};

export const generateArticle = async (): Promise<Article | null> => {
  console.warn('AI generation is temporarily disabled');
  return null;
};

/* Original implementation - uncomment when @google/genai is available
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const customerSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    customerNumber: { type: Type.STRING, description: "Format KD-XXXX" },
    name: { type: Type.STRING },
    company: { type: Type.STRING },
    email: { type: Type.STRING },
    phone: { type: Type.STRING, description: "German phone number format" },
    address: { type: Type.STRING, description: "Full address: Street, Zip, City" },
    notes: { type: Type.STRING, description: "Short business notes" },
    status: { type: Type.STRING, enum: ['Aktiv', 'Interessent', 'Inaktiv', 'Ehemalig'] },
  },
  required: ["id", "customerNumber", "name", "company", "email", "phone", "address", "status"],
};

const articleSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    sku: { type: Type.STRING, description: "Format VK-XXX" },
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    price: { type: Type.NUMBER },
    unit: { type: Type.STRING, enum: ['Stück', 'Stunde', 'Pauschal', 'Meter'] },
    isActive: { type: Type.BOOLEAN },
  },
  required: ["id", "sku", "name", "description", "price", "unit", "isActive"],
};

export const generateMockCustomers = async (count: number = 5): Promise<Customer[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generiere ${count} realistische deutsche CRM-Datensätze.
      - Kundennummern wie KD-1023
      - Realistische deutsche Adressen
      - Status auf Deutsch (Aktiv, Interessent, Inaktiv, Ehemalig)
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: customerSchema,
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    
    const data = JSON.parse(text) as Customer[];
    
    return data.map((c) => ({
      ...c,
      status: c.status as CustomerStatus,
      notes: c.notes || ''
    }));

  } catch (error) {
    console.error("Failed to generate customers:", error);
    return [];
  }
};

export const generateMockArticles = async (count: number = 5): Promise<Article[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generiere ${count} realistische deutsche Produkte/Dienstleistungen.
      - Artikelnummern (SKU) wie VK-001
      - Preise realistisch in Euro
      - Einheiten: Stück, Stunde, Pauschal
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: articleSchema,
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as Article[];

  } catch (error) {
    console.error("Failed to generate articles:", error);
    return [];
  }
};
*/