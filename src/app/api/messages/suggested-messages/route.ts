import { sendApiResponse } from "@/lib/apiResponse";
import { catchAsyncRoute } from "@/lib/catchAsync";
import { openai } from "@ai-sdk/openai";
import { StreamingTextResponse, streamText, StreamData } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const POST = catchAsyncRoute(async () => {
  const prompt = `Create a list of three open-ended and engaging questions formatted
    as single string.Each question should be separted by '||'.These questions are for an 
    anonymous sociaal messaging platform,like Qooh.me, ans should ne suitable for a diverse
    audience. Avoid personla or sensative topics, focusing instead on universal themes that 
    encourage friendly interactions. For example your output should be structured like this:
    'What's a hobby you've recently started?|| if you could have dinner with any historical
    figure,who would ite be?|| what's a simple thing that makes you happy?'. 
    Ensure the questions are intriguing, foster curiosity, and contribute to a positive and 
    welcoming conversational environment.`;

  const result = await streamText({
    model: openai("gpt-4-turbo"),
    prompt,
  });

  const data = new StreamData();

  data.append({ test: "value" });

  const stream = result.toAIStream({
    onFinal(_) {
      data.close();
    },
  });

  return sendApiResponse<StreamingTextResponse>({
    message: "Suggested messages fetched successfully",
    data: new StreamingTextResponse(stream, {}, data),
    statusCode: 200,
  });
});
