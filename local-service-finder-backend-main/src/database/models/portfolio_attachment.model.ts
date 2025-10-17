import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type TPortfolioAttachment = {
  id: number;
  fileName: string;
  portfolioId: number;
  createdAt: Date;
  updatedAt: Date | null;
};

export type TCreatePortfolioAttachmentInput = Optional<TPortfolioAttachment, 'id' | 'createdAt' | 'updatedAt'>;
export type TUpdatePortfolioAttachmentInput = Partial<TCreatePortfolioAttachmentInput>;

class PortfolioAttachment extends Model<TPortfolioAttachment, TCreatePortfolioAttachmentInput> implements TPortfolioAttachment {
  public id!: number;
  public fileName!: string;
  public portfolioId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date | null;

  static associate(models: any) {
    PortfolioAttachment.belongsTo(models.Portfolio, { foreignKey: 'portfolio_id', as: 'portfolio' });
  }
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  PortfolioAttachment.init(
    {
      id: {
        type: dataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      fileName: {
        type: dataTypes.STRING(255),
        allowNull: false,
        field: 'file_name',
      },
      portfolioId: {
        type: dataTypes.BIGINT,
        allowNull: false,
        field: 'portfolio_id',
      },
      createdAt: {
        type: dataTypes.DATE,
        allowNull: false,
        defaultValue: dataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: dataTypes.DATE,
        allowNull: true,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'portfolio_attachment',
      modelName: 'PortfolioAttachment',
      timestamps: true,
      underscored: true,
    },
  );

  return PortfolioAttachment;
};
