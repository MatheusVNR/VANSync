import { Table, Column, Model, PrimaryKey, DataType, AllowNull, AutoIncrement, ForeignKey, BelongsTo } from "sequelize-typescript";
import { CreationOptional } from "sequelize";
import { Usuario } from "./Usuario";
import { Banco } from "./Banco";

export enum StatusSolicitacao {
  EM_ABERTO = 'em_aberto',
  EM_ANALISE = 'em_analise',
  APROVADA = 'aprovada',
  REJEITADA = 'rejeitada'
}

export enum FornecedorVan {
  NEXXERA = 'Nexxera',
  FINNET = 'Finnet'
}

@Table({
  tableName: "solicitacoes_carta",
  schema: "public",
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})
export class SolicitacaoCarta extends Model<SolicitacaoCarta> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: CreationOptional<number>;

  @ForeignKey(() => Usuario)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  declare usuario_id: number;

  @ForeignKey(() => Banco)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  declare banco_id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(255) })
  declare produto: string;

  @AllowNull(false)
  @Column({ type: DataType.JSON })
  declare dados_carta: any;

  @AllowNull(false)
  @Column({ 
    type: DataType.ENUM(...Object.values(FornecedorVan))
  })
  declare fornecedor_van: FornecedorVan;

  @AllowNull(false)
  @Column({ 
    type: DataType.ENUM(...Object.values(StatusSolicitacao)),
    defaultValue: StatusSolicitacao.EM_ABERTO
  })
  declare status: StatusSolicitacao;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare observacoes?: string;

  @BelongsTo(() => Usuario)
  declare usuario: Usuario;

  @BelongsTo(() => Banco)
  declare banco: Banco;
} 