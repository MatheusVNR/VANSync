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
        // Processa o campo produtos: converte string para array se necessário
        const bancoData: any = { ...createBancoDto };
        
        if (bancoData.produtos && typeof bancoData.produtos === 'string') {
            // Se produtos vier como string (ex: "Pagamentos, DDA, Extrato"), converte para array
            if (bancoData.produtos.trim()) {
                bancoData.produtos = bancoData.produtos.split(',').map((p: string) => p.trim());
            } else {
                bancoData.produtos = [];
            }
        }
        
        return this.bancoModel.create(bancoData);
    }

    async update(id: number, updateBancoDto: BancoDTO): Promise<Banco> {
        const banco = await this.bancoModel.findByPk(id);
        if (!banco) {
            throw new Error('Banco não encontrado.');
        }
        
        // Processa o campo produtos: converte string para array se necessário
        const bancoData: any = { ...updateBancoDto };
        
        if (bancoData.produtos && typeof bancoData.produtos === 'string') {
            // Se produtos vier como string (ex: "Pagamentos, DDA, Extrato"), converte para array
            if (bancoData.produtos.trim()) {
                bancoData.produtos = bancoData.produtos.split(',').map((p: string) => p.trim());
            } else {
                bancoData.produtos = [];
            }
        }
        
        return banco.update(bancoData);
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