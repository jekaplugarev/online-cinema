import { Injectable } from '@nestjs/common'
import { Telegraf } from 'telegraf'
import { Telegram } from './telegram.interface'
import { getTelegramConfig } from '../config/telegram.config'
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types'

@Injectable()
export class TelegramService {
  bot: Telegraf
  option: Telegram

  constructor() {
    this.option = getTelegramConfig()
    this.bot = new Telegraf(this.option.token)
  }

  async sendMessage(
    message: string,
    options?: ExtraReplyMessage,
    chatId: string = this.option.chatId
  ) {
    await this.bot.telegram.sendMessage(chatId, message, {
      parse_mode: 'HTML',
      ...options,
    })
  }

  async sendPhoto(
    photo: string,
    message?: string,
    chatId: string = this.option.chatId
  ) {
    await this.bot.telegram.sendPhoto(chatId, photo, {
      caption: message,
    })
  }
}
