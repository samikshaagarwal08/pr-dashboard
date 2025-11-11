import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { csvData } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an analytics assistant. Given the following project workflow data, analyze
the performance differences between manual vs automated processes, and summarize
key findings for a project report.

Data:
${csvData}

Return your analysis in markdown format with:
- Key Performance Indicators (KPIs)
- Efficiency improvement summary
- Time saved percentage
- Productivity or accuracy trends
- Graph/Chart suggestion titles
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
