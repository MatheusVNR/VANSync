import { Controller, Get, Post, Body, Put, Delete, Param } from '@nestjs/common';
import { BancoService } from './banco.service';
import { Banco } from "src/database/entities/Banco";
import { BancoDTO } from "./banco.dto";

@Controller('banco')
export class BancoController {
    constructor(private readonly bancoService: BancoService) { }

    @Get()
    async getBancos() : Promise<Banco[]> {
        return this.bancoService.findAll();
    }

    @Get(':id/can-delete')
    async canDelete(@Param('id') id: number) {
        return this.bancoService.canDelete(id);
    }

    @Post()
    async create(@Body() createBancoDto: BancoDTO): Promise<Banco> {
        return this.bancoService.create(createBancoDto);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateBancoDto: BancoDTO): Promise<Banco> {
        return this.bancoService.update(id, updateBancoDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<string> {
        return this.bancoService.delete(id);
    }
}