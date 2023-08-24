import { DataTypes, Model } from "sequelize";
import db from "../config/database";
import User from "../models/user.model";

interface FileAttributes {
  id: string;
  name: string;
  mimeType: string;
  path: string;
  status: "safe" | "unsafe";
  user: User;
}

class File extends Model<FileAttributes> implements FileAttributes {
  public id!: string;
  public name!: string;
  public mimeType!: string;
  public path!: string;
  public status!: "safe" | "unsafe";
  public user!: User;
}

File.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("safe", "unsafe"),
      defaultValue: "safe",
    },
    user: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: db,
    modelName: "file",
  }
);

export default File;
