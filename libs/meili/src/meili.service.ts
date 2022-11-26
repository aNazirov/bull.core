import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import MeiliSearch, { Index } from 'meilisearch';

interface GenreQueryModel {
  id: number;
  title: string;
  slug: string;
}

interface CategoryQueryModel {
  id: number;
  title: string;
  slug: string;
}

interface CountryQueryModel {
  id: number;
  title: string;
  slug: string;
}

interface ActerQueryModel {
  id: number;
  name: string;
  slug: string;
  avatar: string;
}

interface ProducerQueryModel {
  id: number;
  name: string;
  slug: string;
  avatar: string;
}

interface MovieQueryModel {
  id: number;
  title: string;
  slug: string;
  year: number;
  isNew: boolean;
  isSerial: boolean;
  bySubscription: boolean;
  ageRemark: number;
  treiler?: string;
  imdb?: number;
  rating?: number;
  genres: string[];
  categories: string[];
  acters: string[];
  producers: string[];
  countries: string[];
  createdAt: string;
}

@Injectable()
export class MeiliService implements OnModuleInit {
  private readonly logger = new Logger('MeiliService');
  constructor(private configService: ConfigService) {}

  client: MeiliSearch;
  genresIndex: Index<GenreQueryModel>;
  categoriesIndex: Index<CategoryQueryModel>;
  countriesIndex: Index<CountryQueryModel>;
  actersIndex: Index<ActerQueryModel>;
  producersIndex: Index<ProducerQueryModel>;
  moviesIndex: Index<MovieQueryModel>;

  async onModuleInit() {
    this.client = new MeiliSearch({
      host: this.configService.get('meili').host,
      apiKey: this.configService.get('meili').key,
    });

    this.genresIndex = this.client.index('genres');
    this.categoriesIndex = this.client.index('categories');
    this.countriesIndex = this.client.index('counries');
    this.actersIndex = this.client.index('acters');
    this.producersIndex = this.client.index('producers');
    this.moviesIndex = this.client.index('movies');

    this.logger.log('Meilisearch connected', this.client.config.host);
  }
}
