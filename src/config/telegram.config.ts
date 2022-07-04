import { Telegram } from '../telegram/telegram.interface'

export const getTelegramConfig = (): Telegram => ({
  chatId: '', // необходимо получить
  token: '', // при создании бота
})
