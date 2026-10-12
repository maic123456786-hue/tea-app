export interface ChatApiResponse {
  reply?: string;
  reasoning?: string;
  message?: string;
  error?: string;
}

const API_ENDPOINT = 'https://tea-backend-one.vercel.app/chat';

/**
 * Send a chat message to the tea backend service
 */
export async function sendChatMessage(
  message: string,
  sessionId: number = 1
): Promise<{ reply: string; reasoning: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message.trim(),
        sessionId: Number(sessionId) || 1,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`请求失败 (${response.status}): 无法连接到 tea 的家服务`);
    }

    const data: ChatApiResponse = await response.json();

          if (data.reply) {
        return {
          reply: data.reply,
          reasoning: data.reasoning || ''
        };
      }

      if (data.message && typeof data.message === 'string') {
        return {
          reply: data.message,
          reasoning: data.reasoning || ''
        };
      }

    throw new Error('未收到有效的回复内容');
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('请求超时，tea 好像在用心沏茶，请稍后重试哦～');
      }
      throw error;
    }
    throw new Error('网络请求异常，请检查网络连接');
  }
}

 // 日历专用接口：只生成回信，不读写普通聊天历史
app.post('/calendar-reply', async (req, res) => {
  const { date, emoji, note } = req.body;

  if (!date || !note || !note.trim()) {
    return res.status(400).json({ error: '日期和心事不能为空' });
  }

  try {
    const response = await fetch(
      'https://api.deepseek.com/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-v4-pro',
          messages: [
            {
              role: 'system',
              content: '你的名字叫张舟，你是 tea 的恋人。请用温柔、自然、亲密、治愈的中文，回应 tea 写下的日历心事。回复约50字，认真回应她的情绪，不要说教，不要假装知道她没有提到的事情。'
            },
            {
              role: 'user',
              content: `日期：${date}\n今日心情：${emoji || '🍃'}\n我的心事：${note.trim()}\n请给我一封温柔的日历回信。`
            }
          ],
          temperature: 0.7,
          thinking: { type: 'enabled' }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`DeepSeek 报错: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      throw new Error('没有收到有效的回信');
    }

    // 不向 messages 表写入任何内容
    res.json({ reply });
  } catch (error) {
    console.error('日历回信出错:', error.message);
    res.status(500).json({ error: '日历回信暂时不可用，请稍后再试' });
  }
});

