import "server-only";

/**
 * Optional owner alerts through a Telegram bot. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID
 * in the environment to turn it on; without them nothing is sent anywhere.
 */
export function createOwnerNotifier(): ((text: string) => Promise<void>) | undefined {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return undefined;

  return async (text) => {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`Telegram answered ${response.status}`);
  };
}
