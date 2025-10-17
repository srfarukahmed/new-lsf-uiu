import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type TReview = {
  id: number;
  userId: number;
  providerId: number;
  serviceRequestId: number;
  rating: number;
  comment?: string | null;
  createdAt: Date;
  updatedAt: Date | null;
};

export type TCreateReviewInput = Optional<TReview, 'id' | 'comment' | 'createdAt' | 'updatedAt'>;
export type TUpdateReviewInput = Partial<TCreateReviewInput>;

class Review extends Model<TReview, TCreateReviewInput> implements TReview {
  public id!: number;
  public userId!: number;
  public providerId!: number;
  public serviceRequestId!: number;
  public rating!: number;
  public comment?: string | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date | null;

  static associate(models: any) {
    // A review belongs to a user (the one who gave the review)
    Review.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });

    // A review belongs to a provider
    Review.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });

    // A review belongs to a service request
    Review.belongsTo(models.ServiceRequest, { foreignKey: 'service_request_id', as: 'serviceRequest' });
  }
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  Review.init(
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
      providerId: {
        type: dataTypes.BIGINT,
        allowNull: false,
        field: 'provider_id',
      },
      serviceRequestId: {
        type: dataTypes.BIGINT,
        allowNull: false,
        field: 'service_request_id',
      },
      rating: {
        type: dataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: dataTypes.TEXT,
        allowNull: true,
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
      tableName: 'review',
      modelName: 'Review',
      timestamps: true,
      underscored: true,
    },
  );

  return Review;
};
