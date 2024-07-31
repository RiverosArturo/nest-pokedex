import { Injectable } from '@nestjs/common';
import { Pokeresponse } from './interfaces/poke-response.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ){}

  async executeSeed(){
    await this.pokemonModel.deleteMany({}); // delete * from Pokemons;
    const data = await this.http.get<Pokeresponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    //Insercion mejorada 1
    // const insertPromisesArray = [];

    //Insercion mejorada 2
    const pokemonToInsert: { name:string, no:number }[] = [];

    data.results.forEach( async({name, url}) => {
      const segments = url.split('/');
      const no = +segments[ segments.length - 2 ];

      //insercion a db comun
      // await this.pokemonModel.create({ name, no });

      //insercion mejorada 1
      // insertPromisesArray.push(
      //   this.pokemonModel.create({ name, no })
      // );

      //Insercion mejorada 2
      pokemonToInsert.push({name, no});
    });

    //Insercion mejorada 1
    //Esperamos a que todas las promesas de nuestro array se inserten en la db
    // await Promise.all( insertPromisesArray );

    //Insercion mejorada 2
    await this.pokemonModel.insertMany( pokemonToInsert );

    return 'Seed executed';
  }
}
