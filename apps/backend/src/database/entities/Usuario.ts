import { Table, Column, Model, PrimaryKey, DataType, AllowNull, AutoIncrement, HasMany } from "sequelize-typescript";
import { SolicitacaoCarta } from "./SolicitacaoCarta";

export enum TipoUsuario {
  ADMIN = 'ADMIN',
  SH = 'SH'
}

@Table({
  tableName: "usuarios",
  schema: "public",
  timestamps: true
})
export class Usuario extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(18), unique: true })
  declare cnpj: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(255) })
  declare token: string;

  @AllowNull(false)
  @Column({ 
    type: DataType.ENUM(...Object.values(TipoUsuario)),
    defaultValue: TipoUsuario.SH
  })
  declare tipo: TipoUsuario;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare nome_empresa?: string;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare email?: string;

  @Column({ type: DataType.STRING(20), allowNull: true })
  declare telefone?: string;

  @HasMany(() => SolicitacaoCarta)
  declare solicitacoes: SolicitacaoCarta[];
} 