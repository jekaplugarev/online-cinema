import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { IdValidationPipe } from '../pipes/id.validation.pipe'
import { GenreService } from './genre.service'
import { CreateGenreDto } from './dto/create-genre.dto'

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return this.genreService.bySlug(slug)
  }

  @Get('collections')
  async getCollections() {
    return this.genreService.getCollection()
  }

  @Get()
  async getAllGenres(@Query('searchTerm') searchTerm: string) {
    return this.genreService.getAll(searchTerm)
  }

  @Get(':id')
  @Auth('admin')
  async getGenre(@Param('id', IdValidationPipe) id: string) {
    return this.genreService.byId(id)
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(200)
  @Auth('admin')
  async createGenre() {
    return this.genreService.create()
  }

  @UsePipes(new ValidationPipe())
  @Put(':id')
  @HttpCode(200)
  @Auth('admin')
  async updateGenre(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateGenreDto
  ) {
    return this.genreService.update(id, dto)
  }

  @Delete(':id')
  @HttpCode(200)
  @Auth('admin')
  async deleteGenre(@Param('id', IdValidationPipe) id: string) {
    return this.genreService.delete(id)
  }
}
