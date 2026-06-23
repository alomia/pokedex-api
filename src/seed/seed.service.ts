import {
  Injectable,
  Logger,
} from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { PokeResponse } from "./interfaces/poke-response.interface";
import { Pokemon } from "src/pokemon/entities/pokemon.entity";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { AxiosAdapter } from "src/common/adapters/axios.adapter";

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios.create({
    baseURL: "https://pokeapi.co/api/v2",
  });

  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter,
  ) {}

  async seed() {
    await this.pokemonModel.deleteMany({}); // limpia antes de re-seedear
    const data  = await this.http.get<PokeResponse>("/pokemon?limit=650");

    const pokemonToInsert = data.results.map(({ name, url }) => {
      const segments = url.split("/");
      const no = Number(segments[segments.length - 2]);
      return { name, no };
    });

    await this.pokemonModel.insertMany(pokemonToInsert);
    return { success: true, count: pokemonToInsert.length };
  }
}
