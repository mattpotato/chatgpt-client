"use client"
import { FormEvent, useState } from 'react'

const GPT_MODEL = "gpt-3.5-turbo"

interface Message {
  role: 'user' | 'assistant',
  message: string
}

export default function Home() {
  const [token, setToken] = useState<string>(process.env.NEXT_PUBLIC_CHATGPT_TOKEN ?? "");
  const [humanInput, setHumanInput] = useState<string>("");
  const [conversation, setConversation] = useState<Message[]>([]);


  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setHumanInput("")
  }

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && event.shiftKey) {
    }
    else if (event.key === 'Enter') {
      event.preventDefault();
      setConversation((convo) => [...convo, {
        role: 'user',
        message: humanInput
      }]);
      setHumanInput("");
      const body = {
        model: GPT_MODEL,
        messages: [
          {
            role: "user",
            content: humanInput,
          }
        ]
      }
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: "POST",
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })
      const json = await res.json()
      const gptMessage = json.choices[0].message.content;
      setConversation((convo) => [...convo, {
        role: 'assistant',
        message: gptMessage
      }])
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-[600px]">
        <div className="flex flex-col gap-2">
          {conversation?.map((convo) => {
            if (convo.role === 'user') {
              return (
                <div
                  className='self-end bg-blue-400 text-white p-2 rounded-md'>
                  {convo.message}
                </div>
              )
            }
            else {
              return <div className="self-start bg-white text-black p-2 rounded-md">{convo.message}</div>
            }
          })
          }
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex items-center justify-between gap-2 w-[600px]">
        <textarea
          className="p-2 resize-none w-full rounded-md border border-gray-800 bg-white"
          name="message"
          autoFocus
          rows={2}
          value={humanInput}
          onChange={(event) => setHumanInput(event.target.value)}
          onKeyDown={(event) => handleKeyDown(event)}
          placeholder="Send a message."
        />
        <button type="submit"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
        </button>
      </form>
    </main>
  )
}
