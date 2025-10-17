import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type TPackage = {
    id: number;
    name: string;
    description: string;
    price: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date | null;
};

export type TCreatePackageInput = Optional<TPackage, 'id' | 'createdAt' | 'updatedAt'>;
export type TUpdatePackageInput = Partial<TCreatePackageInput>;

class Package extends Model<TPackage, TCreatePackageInput> implements TPackage {
    public id!: number;
    public name!: string;
    public description!: string;
    public price!: string;
    public userId!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date | null;

    static associate(models: any) {
        Package.belongsTo(models.User, { foreignKey: 'user_id', as: 'user', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
        Package.hasMany(models.ServiceRequest, { foreignKey: 'package_id', as: 'serviceRequests', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    }
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    Package.init(
        {
            id: { type: dataTypes.BIGINT, autoIncrement: true, primaryKey: true },
            name: { type: dataTypes.STRING(255), allowNull: false },
            description: { type: dataTypes.TEXT, allowNull: false },
            price: { type: dataTypes.DECIMAL(10, 2), allowNull: false },
            userId: { type: dataTypes.BIGINT, allowNull: false, field: 'user_id' },
            createdAt: { type: dataTypes.DATE, allowNull: false, defaultValue: dataTypes.NOW, field: 'created_at' },
            updatedAt: { type: dataTypes.DATE, allowNull: true, field: 'updated_at' },
        },
        { sequelize, tableName: 'package', modelName: 'Package', timestamps: true, underscored: true }
    );

    return Package;
};
