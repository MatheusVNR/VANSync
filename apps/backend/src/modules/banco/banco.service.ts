import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Banco } from "src/database/entities/Banco";
import { SolicitacaoCarta } from "src/database/entities/SolicitacaoCarta";
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

    async canDelete(id: number): Promise<{ canDelete: boolean; message?: string }> {
        const banco = await this.bancoModel.findByPk(id, {
            include: [{
                model: SolicitacaoCarta,
                as: 'solicitacoes'
            }]
        });
        
        if (!banco) {
            throw new Error('Banco não encontrado.');
        }

        const hasSolicitacoes = banco.solicitacoes && banco.solicitacoes.length > 0;
        
        if (hasSolicitacoes) {
            return {
                canDelete: false,
                message: 'Não é possível excluir um banco que possua solicitações.'
            };
        }

        return { canDelete: true };
    }

    async delete(id: number): Promise<string> {
        // Verifica se pode excluir antes de tentar
        const canDelete = await this.canDelete(id);
        
        if (!canDelete.canDelete) {
            throw new Error(canDelete.message!);
        }

        const banco = await this.bancoModel.findByPk(id);
        if (!banco) {
            throw new Error('Banco não encontrado.');
        }
        await banco.destroy();
        return `Banco ${id} excluído com sucesso!`;
    }
}