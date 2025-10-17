import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type TSubCategory = {
  id: number;
  categoryId: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TCreateSubCategoryInput = Optional<TSubCategory, 'id' | 'createdAt' | 'updatedAt'>;
export type TUpdateSubCategoryInput = Partial<TCreateSubCategoryInput>;

class SubCategory extends Model<TSubCategory, TCreateSubCategoryInput> implements TSubCategory {
  public id!: number;
  public categoryId!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    SubCategory.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
  }
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  SubCategory.init(
    {
      id: {
        type: dataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      categoryId: {
        type: dataTypes.BIGINT,
        allowNull: false,
        field: 'category_id',
      },
      name: {
        type: dataTypes.STRING(255),
        allowNull: false,
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
      tableName: 'sub_category',
      modelName: 'SubCategory',
      timestamps: true,
      underscored: true,
    },
  );

  return SubCategory;
};
