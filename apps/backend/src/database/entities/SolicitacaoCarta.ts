import { Table, Column, Model, PrimaryKey, DataType, AllowNull, AutoIncrement, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Usuario } from "./Usuario";
import { Banco } from "./Banco";

export enum StatusSolicitacao {
  EM_ABERTO = 'em_aberto',
  EM_ANALISE = 'em_analise',
  APROVADA = 'aprovada',
  REJEITADA = 'rejeitada',
  FINALIZADA = 'finalizada'
}

export enum FornecedorVan {
  NEXXERA = 'Nexxera',
  FINNET = 'Finnet'
}

@Table({
  tableName: "solicitacoes_carta",
  schema: "public",
  timestamps: true
})
export class SolicitacaoCarta extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @ForeignKey(() => Usuario)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  usuario_id: number;

  @ForeignKey(() => Banco)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  banco_id: number;

  @AllowNull(false)
  @Column({ type: DataType.JSON })
  produtos: string[];

  @AllowNull(false)
  @Column({ type: DataType.JSON })
  dados_carta: {
    nome_empresa: string;
    cnpj_cliente: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    telefone: string;
    email: string;
    gerente_nome: string;
    gerente_telefone: string;
    gerente_email: string;
    cnab: string;
    padrao_van: string;
  };

  @AllowNull(false)
  @Column({ 
    type: DataType.ENUM(...Object.values(FornecedorVan))
  })
  fornecedor_van: FornecedorVan;

  @Column({ type: DataType.JSON, allowNull: true })
  pdfs?: string[];

  @AllowNull(false)
  @Column({ 
    type: DataType.ENUM(...Object.values(StatusSolicitacao)),
    defaultValue: StatusSolicitacao.EM_ABERTO
  })
  status: StatusSolicitacao;

  @Column({ type: DataType.TEXT, allowNull: true })
  observacoes?: string;

  @BelongsTo(() => Usuario)
  usuario: Usuario;

  @BelongsTo(() => Banco)
  banco: Banco;
} 