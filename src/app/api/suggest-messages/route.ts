import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = streamText({
      model: openai("gpt-4o"), // Make sure to use the proper model provided by @ai-sdk/openai
      maxOutputTokens: 400,
      prompt,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    if (error?.name === 'APIError') {
      const { name, status, headers, message } = error;
      return NextResponse.json({ message, name, status, headers }, { status: status || 500 });
    } else {
      console.log("An unexpected error occurred", error);
      throw error;
    }
  }
}
