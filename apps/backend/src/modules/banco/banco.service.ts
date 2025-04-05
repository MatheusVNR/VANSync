import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Banco } from "src/database/entities/Banco";
import { BancoDTO } from "./banco.dto";

@Injectable()
export class BancoService{
    constructor(@InjectModel(Banco) private bancoModel: typeof Banco){}

    async findAll(): Promise<Banco[]> {
        return await this.bancoModel.findAll({
            order: [['codigo', 'ASC']]
        });
    }

    async create(createBancoDto: BancoDTO): Promise<Banco> {
        return this.bancoModel.create(createBancoDto as any);
    }

    async update(id: number, updateBancoDto: BancoDTO): Promise<Banco> {
        const banco = await this.bancoModel.findByPk(id);
        if (!banco) {
            throw new Error('Banco não encontrado.');
        }
        return banco.update(updateBancoDto as any);
    }

    async delete(id: number): Promise<string> {
        const banco = await this.bancoModel.findByPk(id);
        if (!banco) {
            throw new Error('Banco não encontrado.');
        }
        await banco.destroy();
        return `Banco ${id} excluído com sucesso!`;
    }
}