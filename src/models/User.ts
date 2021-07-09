import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';

// These are all the attributes in the User model
type gender = 'male' | 'female';

interface UserAttributes {
  id: number;
  name: string;
  preferredName: string | null;
  gender: gender;
}

// Some attributes are optional in `User.build` and `User.create` calls
type UserCreationAttributes = Optional<UserAttributes, 'id' | 'preferredName'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public name!: string;
  public preferredName!: string | null; // for nullable fields
  public gender!: gender;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    preferredName: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(10),
    },
  },
  {
    tableName: 'users',
    sequelize, // passing the `sequelize` instance is required
  },
);

export default User;
