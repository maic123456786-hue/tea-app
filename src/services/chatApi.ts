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
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s timeout

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

const CALENDAR_API_ENDPOINT =
  'https://tea-backend-one.vercel.app/calendar-reply';

export async function sendCalendarReply(
  date: string,
  emoji: string,
  note: string,
  sessionId: number = 1
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);

  try {
    const response = await fetch(CALENDAR_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date,
        emoji,
        note,
        sessionId: Number(sessionId) || 1,
      }),
      signal: controller.signal,
    });

    const data: { reply?: string; error?: string } =
      await response.json();

    if (!response.ok || !data.reply) {
      throw new Error(
        data.error || '获取日历回信失败，请稍后重试'
      );
    }

    return data.reply;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('日历回信等待超时，请稍后重试');
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
