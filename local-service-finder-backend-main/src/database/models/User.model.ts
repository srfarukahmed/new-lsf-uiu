import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type TUser = {
  id: number;
  firstName: string;
  lastName?: string | null;
  email: string;
  phone?: string | null;
  password: string;
  address?: string | null;
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  about?: string | null;
  signUpType: 'EMAIL' | 'GOOGLE' | 'FACEBOOK';
  status: 'APPROVE' | 'PENDING' | 'BLOCKED';
  categoryId?: number | null;
  activeStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type TCreateUserInput = Optional<
  TUser,
  'id' | 'lastName' | 'phone' | 'address' | 'about' | 'activeStatus' | 'createdAt' | 'updatedAt' | 'categoryId'
>;
export type TUpdateUserInput = Partial<TCreateUserInput>;

class User extends Model<TUser, TCreateUserInput> implements TUser {
  public id!: number;
  public firstName!: string;
  public lastName!: string | null;
  public email!: string;
  public phone!: string | null;
  public password!: string;
  public address!: string | null;
  public role!: 'CUSTOMER' | 'PROVIDER' | 'ADMIN';
  public about!: string | null;
  public signUpType!: 'EMAIL' | 'GOOGLE' | 'FACEBOOK';
  public status!: 'APPROVE' | 'PENDING' | 'BLOCKED';
  public categoryId!: number | null;
  public activeStatus!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    User.hasMany(models.Package, { foreignKey: 'user_id', as: 'packages' });
    User.hasMany(models.Portfolio, { foreignKey: 'user_id', as: 'portfolios' });
    User.hasMany(models.Certification, { foreignKey: 'user_id', as: 'certifications' });
    User.hasMany(models.RequestModification, { foreignKey: 'user_id', as: 'requestModifications' });
    User.hasMany(models.ServiceRequest, { foreignKey: 'service_provider_id', as: 'serviceRequestsAsProvider' });
    User.hasMany(models.ServiceRequest, { as: 'serviceRequestsAsCustomer', foreignKey: 'userId' });
    User.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
    User.hasMany(models.Review, { foreignKey: 'user_id', as: 'givenReviews' });
    User.hasMany(models.Review, { foreignKey: 'provider_id', as: 'receivedReviews' });

  }
}


export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  User.init(
    {
      id: {
        type: dataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: dataTypes.STRING(255),
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: dataTypes.STRING(255),
        allowNull: true,
        field: 'last_name',
      },
      email: {
        type: dataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: dataTypes.STRING(50),
        allowNull: true,
      },
      password: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      address: {
        type: dataTypes.STRING(255),
        allowNull: true,
      },
      role: {
        type: dataTypes.ENUM('CUSTOMER', 'PROVIDER', 'ADMIN'),
        allowNull: false,
      },
      about: {
        type: dataTypes.TEXT,
        allowNull: true,
      },
      signUpType: {
        type: dataTypes.ENUM('EMAIL', 'GOOGLE', 'FACEBOOK'),
        allowNull: false,
        defaultValue: 'EMAIL',
        field: 'sign_up_type',
      },
      status: {
        type: dataTypes.ENUM('APPROVE', 'PENDING', 'BLOCKED'),
        allowNull: false,
        defaultValue: 'APPROVE',
      },
      categoryId: {
        type: dataTypes.BIGINT,
        allowNull: true,
        field: 'category_id',
        references: {
          model: 'category',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      activeStatus: {
        type: dataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'active_status',
      },
      createdAt: {
        type: dataTypes.DATE,
        allowNull: false,
        defaultValue: dataTypes.NOW,
        field: 'created_at',
      },
      updatedAt: {
        type: dataTypes.DATE,
        allowNull: false,
        defaultValue: dataTypes.NOW,
        field: 'updated_at',
      },
    },
    {
      sequelize,
      tableName: 'user',
      modelName: 'User',
      timestamps: true,
      underscored: true,
    },
  );

  return User;
};
