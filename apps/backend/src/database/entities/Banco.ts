import { Table, Column, Model, PrimaryKey, DataType, AllowNull, AutoIncrement } from "sequelize-typescript";

@Table({
  tableName: "bancos",
  schema: "public",
  timestamps: false
})

export class Banco extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  codigo!: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(255) })
  nome: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(50) })
  padrao_van: string;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  cnab240?: boolean;
  
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  cnab400?: boolean;
  
  @Column({ type: DataType.BOOLEAN, allowNull: true })
  cnab444?: boolean;

  @Column({ type: DataType.STRING(255), allowNull: true })
  produtos?: string;
}