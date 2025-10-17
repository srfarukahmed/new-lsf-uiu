import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type TRequestModification = {
    id: number;
    serviceRequestId: number;
    userId: number;
    reason: string;
    price: string; // DECIMAL
    timeRequired?: string | null;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: Date;
    updatedAt: Date | null;
};

export type TCreateRequestModificationInput = Omit<
    TRequestModification,
    'id' | 'status' | 'serviceRequestId' | 'createdAt' | 'updatedAt'
>;
export type TUpdateRequestModificationInput = Partial<TCreateRequestModificationInput>;

class RequestModification extends Model<TRequestModification, TCreateRequestModificationInput> implements TRequestModification {
    public id!: number;
    public serviceRequestId!: number;
    public userId!: number;
    public reason!: string;
    public price!: string;
    public timeRequired!: string | null;
    public status!: 'PENDING' | 'APPROVED' | 'REJECTED';

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date | null;

    static associate(models: any) {
        RequestModification.belongsTo(models.ServiceRequest, { foreignKey: 'service_request_id', as: 'serviceRequest' });
        RequestModification.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    RequestModification.init(
        {
            id: {
                type: dataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            serviceRequestId: {
                type: dataTypes.BIGINT,
                allowNull: false,
                field: 'service_request_id',
            },
            userId: {
                type: dataTypes.BIGINT,
                allowNull: false,
                field: 'user_id',
            },
            reason: {
                type: dataTypes.TEXT,
                allowNull: false,
            },
            price: {
                type: dataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            timeRequired: {
                type: dataTypes.STRING(100),
                allowNull: true,
                field: 'time_required',
            },
            status: {
                type: dataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
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
            tableName: 'request_modification',
            modelName: 'RequestModification',
            timestamps: true,
            underscored: true,
        },
    );

    return RequestModification;
};
