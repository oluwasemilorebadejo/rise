import { DataTypes, Model } from "sequelize";
import db from "../config/database";

interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: string;
  firstName!: string;
  lastName!: string;
  public email!: string;
  public password!: string;
  public role!: "admin" | "user";
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value: string) {
        this.setDataValue("firstName", value.toLowerCase());
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value: string) {
        this.setDataValue("lastName", value.toLowerCase());
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      set(value: string) {
        this.setDataValue("email", value.toLowerCase());
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    sequelize: db,
    modelName: "user",
  }
);

export default User;
