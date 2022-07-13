import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { MovieModel } from './movie.model'
import { UpdateMovieDto } from './update-movie.dto'
import { Types } from 'mongoose'

@Injectable()
export class MovieService {
  constructor(
    @InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>
  ) {}

  async getAll(searchTerm?: string) {
    let options = {}

    if (searchTerm) {
      options = {
        $or: [
          {
            title: new RegExp(searchTerm, 'i'),
          },
        ],
      }
    }

    return this.MovieModel.find(options)
      .select('-updateAt -__v')
      .sort({
        createdAt: 'desc',
      })
      .populate('actors genres')
      .exec()
  }

  async bySlug(slug: string) {
    const doc = await this.MovieModel.findOne({ slug })
      .populate('actors genres')
      .exec()

    if (!doc) throw new NotFoundException('Фильм не найден')

    return doc
  }

  async byActor(actorId: Types.ObjectId) {
    const doc = await this.MovieModel.find({ actors: actorId }).exec()

    if (!doc) throw new NotFoundException('Фильм не найден')

    return doc
  }

  async byGenres(genresIds: Types.ObjectId[]) {
    const doc = await this.MovieModel.find({
      genres: { $in: genresIds },
    }).exec()

    if (!doc) throw new NotFoundException('Фильм не найден')

    return doc
  }

  async updateCountOpened(slug: string) {
    const updateDoc = await this.MovieModel.findOneAndUpdate(
      { slug },
      { $inc: { countOpened: 1 } },
      { new: true }
    ).exec()

    if (!updateDoc) {
      throw new NotFoundException('Фильм не найден')
    }

    return updateDoc
  }

  async getMostPopular() {
    return await this.MovieModel.find({ countOpened: { $gt: 0 } })
      .sort({ countOpened: -1 })
      .populate('genres')
      .exec()
  }

  async updateRating(id: Types.ObjectId, newRating: number) {
    return this.MovieModel.findByIdAndUpdate(
      id,
      {
        rating: newRating,
      },
      {
        new: true,
      }
    ).exec()
  }

  /* Админ */

  async byId(_id: string) {
    const doc = await this.MovieModel.findById(_id)

    if (!doc) throw new NotFoundException('Фильм не найден')

    return doc
  }

  async create() {
    const defaultValue: UpdateMovieDto = {
      bigPoster: '',
      actors: [],
      genres: [],
      poster: '',
      title: '',
      videoUrl: '',
      slug: '',
    }
    const doc = await this.MovieModel.create(defaultValue)

    return doc._id
  }

  async update(_id: string, dto: UpdateMovieDto) {
    // if (!dto.isSendTelegram) {
    //   await this.sendNotification(dto)
    //   dto.isSendTelegram = true
    // }

    const updateDoc = await this.MovieModel.findByIdAndUpdate(_id, dto, {
      new: true,
    }).exec()

    if (!updateDoc) {
      throw new NotFoundException('Фильм не найден')
    }

    return updateDoc
  }

  async delete(id: string) {
    const deleteDoc = await this.MovieModel.findByIdAndDelete(id).exec()

    if (!deleteDoc) {
      throw new NotFoundException('Фильм не найден')
    }

    return deleteDoc
  }

  // async sendNotification(dto: UpdateMovieDto) {
  //   if (process.env.NODE_ENV !== 'development') {
  //     await this.telegramService.sendPhoto(dto.poster)
  //   }
  //
  //   const message = `<b>${dto.title}</b>`
  //
  //   await this.telegramService.sendMessage(message, {
  //     reply_markup: {
  //       inline_keyboard: [
  //         [
  //           {
  //             url: 'https://okko.tv/movie/free-guy',
  //             text: 'Go to watch',
  //           },
  //         ],
  //       ],
  //     },
  //   })
  // }
}
