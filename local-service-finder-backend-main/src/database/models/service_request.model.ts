import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import models from '.';

export type TServiceRequest = {
  id: number;
  userId: number; // NEW: the customer who created the request
  serviceProviderId: number;
  packageId: number;
  urgentLevel: number;
  description: string;
  address: string;
  contactNumber: string;
  preferredDate: string; // DATEONLY as 'YYYY-MM-DD'
  preferredTime: string; // TIME as 'HH:MM:SS'
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date | null;
};

export type TCreateServiceRequestInput = Optional<
  TServiceRequest,
  'id' | 'createdAt' | 'updatedAt'
>;
export type TUpdateServiceRequestInput = Partial<TCreateServiceRequestInput>;

class ServiceRequest extends Model<TServiceRequest, TCreateServiceRequestInput> implements TServiceRequest {
  public id!: number;
  public userId!: number; // NEW
  public serviceProviderId!: number;
  public packageId!: number;
  public urgentLevel!: number;
  public description!: string;
  public address!: string;
  public contactNumber!: string;
  public preferredDate!: string;
  public preferredTime!: string;
  public status!: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date | null;

  static associate(models: any) {
    ServiceRequest.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' }); // NEW
    ServiceRequest.belongsTo(models.User, { foreignKey: 'service_provider_id', as: 'serviceProvider' });
    ServiceRequest.belongsTo(models.Package, { foreignKey: 'package_id', as: 'package' });
    ServiceRequest.hasMany(models.RequestModification, { foreignKey: 'service_request_id', as: 'modifications' });
    ServiceRequest.hasMany(models.Review, { foreignKey: 'service_request_id', as: 'reviews' });
  }
}


export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  ServiceRequest.init(
    {
      id: {
        type: dataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: { // NEW FIELD
        type: dataTypes.BIGINT,
        allowNull: true,
        field: 'user_id',
      },
      serviceProviderId: {
        type: dataTypes.BIGINT,
        allowNull: false,
        field: 'service_provider_id',
      },
      packageId: {
        type: dataTypes.BIGINT,
        allowNull: false,
        field: 'package_id',
      },
      urgentLevel: {
        type: dataTypes.TINYINT,
        allowNull: false,
        field: 'urgent_level',
      },
      description: {
        type: dataTypes.TEXT,
        allowNull: false,
      },
      address: {
        type: dataTypes.STRING(255),
        allowNull: false,
      },
      contactNumber: {
        type: dataTypes.STRING(50),
        allowNull: false,
        field: 'contact_number',
      },
      preferredDate: {
        type: dataTypes.DATEONLY,
        allowNull: false,
        field: 'preferred_date',
      },
      preferredTime: {
        type: dataTypes.TIME,
        allowNull: false,
        field: 'preferred_time',
      },
      status: {
        type: dataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'),
        allowNull: false,
        defaultValue: 'PENDING',
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
      tableName: 'service_request',
      modelName: 'ServiceRequest',
      timestamps: true,
      underscored: true,
    },
  );

  return ServiceRequest;
};
