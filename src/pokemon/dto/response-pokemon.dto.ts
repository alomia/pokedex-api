import { IsInt } from "class-validator";

export class ResponsePokemonDto {
  count!: number;
  results!: ResponsePokemonDto[];
}
