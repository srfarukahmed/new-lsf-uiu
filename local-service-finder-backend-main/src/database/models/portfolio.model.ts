import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type TPortfolio = {
  id: number;
  userId: number;
  title: string;
  description: string;
  startDate: string; // DATEONLY
  endDate: string; // DATEONLY
  createdAt: Date;
  updatedAt: Date | null;
};

export type TCreatePortfolioInput = Optional<TPortfolio, 'id' | 'createdAt' | 'updatedAt'>;
export type TUpdatePortfolioInput = Partial<TCreatePortfolioInput>;

class Portfolio extends Model<TPortfolio, TCreatePortfolioInput> implements TPortfolio {
  public id!: number;
  public userId!: number;
  public title!: string;
  public description!: string;
  public startDate!: string;
  public endDate!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date | null;

  static associate(models: any) {
    Portfolio.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Portfolio.hasMany(models.PortfolioAttachment, { foreignKey: 'portfolio_id', as: 'attachments' });
  }
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  Portfolio.init(
    {
      id: {
        type: dataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: dataTypes.BIGINT,
        allowNull: false,
        field: 'user_id',
      },
      title: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: dataTypes.TEXT,
        allowNull: false,
      },
      startDate: {
        type: dataTypes.DATEONLY,
        allowNull: false,
        field: 'start_date',
      },
      endDate: {
        type: dataTypes.DATEONLY,
        allowNull: false,
        field: 'end_date',
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
      tableName: 'portfolio',
      modelName: 'Portfolio',
      timestamps: true,
      underscored: true,
    },
  );

  return Portfolio;
};
