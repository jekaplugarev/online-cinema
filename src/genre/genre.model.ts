import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { prop } from '@typegoose/typegoose'

export class GenreModel extends TimeStamps {
  @prop()
  name: string

  @prop({ unique: true })
  slug: string

  @prop()
  description: string

  @prop()
  icon: string
}
