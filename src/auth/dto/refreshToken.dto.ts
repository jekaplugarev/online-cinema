import { IsString } from 'class-validator'

export class RefreshTokenDto {
  @IsString({
    message: 'Токен не строка или ты не передал токен',
  })
  refreshToken: string
}
