import express, { type Request, type Response } from "express"
import OpenAI from "openai"
const app = express()
const client = new OpenAI({
    apiKey : process.env.OPENAI_API_KEY
})



app.use(express.json());

app.get("/", async(req : Request , res : Response)=> {

     res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

    res.flushHeaders();


     let response = await client.chat.completions.create({
        messages : [{role : "user" , content : "Reply with a new business idea for AI Agents, formatted with headings, sub-headings and bullet points" }],
        model : "gpt-5-nano",
        stream : true

     })

     
     for await ( const chunk of response){
       const text =  chunk.choices[0]?.delta.content

       if (!text){
        continue
       }

       // split into lines (like your Python code)
    const lines = text.split("\n");

    for (const line of lines) {
      res.write(`data: ${line}\n`);
    }
    res.write("\n"); // blank line ends SSE event
  }
      // when finished
  res.write("event: end\ndata: done\n\n");
  res.end();



     


})


app.listen(3000, () => {
    console.log("app is listening on port 3000")
})


