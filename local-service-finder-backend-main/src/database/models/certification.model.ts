import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export type TCertification = {
    id: number;
    userId: number;
    title: string;
    issuer: string;
    earnedOn: string; // DATEONLY
    expiresOn?: string | null; // DATEONLY
    createdAt: Date;
    updatedAt: Date | null;
};

export type TCreateCertificationInput = Optional<TCertification, 'id' | 'expiresOn' | 'createdAt' | 'updatedAt'>;
export type TUpdateCertificationInput = Partial<TCreateCertificationInput>;

class Certification extends Model<TCertification, TCreateCertificationInput> implements TCertification {
    public id!: number;
    public userId!: number;
    public title!: string;
    public issuer!: string;
    public earnedOn!: string;
    public expiresOn!: string | null;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date | null;

    static associate(models: any) {
        Certification.belongsTo(models.User, {
            foreignKey: 'user_id',   // just the column name, allowNull is handled in init()
            as: 'user',              // optional, for eager loading
            onDelete: 'CASCADE',     // now it works correctly
            onUpdate: 'CASCADE',
        });
    }
}

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
    Certification.init(
        {
            id: {
                type: dataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            userId: {
                type: dataTypes.BIGINT,
                allowNull: false,   // mandatory relationship
                field: 'user_id',
            },
            title: {
                type: dataTypes.STRING(255),
                allowNull: false,
            },
            issuer: {
                type: dataTypes.STRING(255),
                allowNull: false,
            },
            earnedOn: {
                type: dataTypes.DATEONLY,
                allowNull: false,
                field: 'earned_on',
            },
            expiresOn: {
                type: dataTypes.DATEONLY,
                allowNull: true,
                field: 'expires_on',
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
            tableName: 'certification',
            modelName: 'Certification',
            timestamps: true,
            underscored: true,
        },
    );

    return Certification;
};
