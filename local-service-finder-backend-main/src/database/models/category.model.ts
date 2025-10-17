import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type TCategory = {
  id: number;
  name: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TCreateCategoryInput = Optional<TCategory, 'id' | 'createdAt' | 'updatedAt'>;
export type TUpdateCategoryInput = Partial<TCreateCategoryInput>;

class Category extends Model<TCategory, TCreateCategoryInput> implements TCategory {
  public id!: number;
  public name!: string;
  public icon!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Category.hasMany(models.SubCategory, { foreignKey: 'category_id', as: 'subCategories' });
    Category.hasMany(models.User, { foreignKey: 'category_id', as: 'users' });

  }
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  Category.init(
    {
      id: {
        type: dataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      icon: {
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
      tableName: 'category',
      modelName: 'Category',
      timestamps: true,
      underscored: true,
    },
  );

  return Category;
};
