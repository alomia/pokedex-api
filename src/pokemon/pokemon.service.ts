import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreatePokemonDto } from "./dto/create-pokemon.dto";
import { UpdatePokemonDto } from "./dto/update-pokemon.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Pokemon } from "./entities/pokemon.entity";
import { isValidObjectId, Model, mongo } from "mongoose";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const [total, data] = await Promise.all([
      this.pokemonModel.countDocuments(),
      this.pokemonModel.find()
        .limit(limit)
        .skip(offset)
        .sort({ no: 1 })
        .select("-__v"),
    ]);

    return {
      total,
      limit,
      offset,
      data,
    };
  }

  async findOne(term: string) {
    let pokemon;

    if (!isNaN(+term)) pokemon = await this.pokemonModel.findOne({ no: +term });

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id, name or no "${term} not found."`,
      );
    }

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const pokemon = await this.pokemonModel.findByIdAndDelete(id);

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id "${id}" not found.`);
    }

    return pokemon;
  }

  private handleExceptions(error: any) {
    if (error instanceof mongo.MongoServerError && error.code === 11000) {
      throw new ConflictException(
        `Pokemon already exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }

    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check server logs`,
    );
  }
}
