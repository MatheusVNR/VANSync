import { Table, Column, Model, PrimaryKey, DataType, AllowNull, AutoIncrement, HasMany } from "sequelize-typescript";
import { SolicitacaoCarta } from "./SolicitacaoCarta";

@Table({
  tableName: "bancos",
  schema: "public",
  timestamps: false
})

export class Banco extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare codigo: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(255) })
  declare nome: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(50) })
  declare padrao_van: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  declare cnab240?: boolean;
  
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  declare cnab400?: boolean;
  
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  declare cnab444?: boolean;

  @Column({ type: DataType.JSON, allowNull: true })
  declare produtos?: string[];

  @Column({ type: DataType.BOOLEAN, defaultValue: true })
  declare ativo: boolean;

  @HasMany(() => SolicitacaoCarta)
  declare solicitacoes: SolicitacaoCarta[];
}