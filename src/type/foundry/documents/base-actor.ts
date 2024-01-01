import { Document } from '../abstract/document'
import { Permission, User } from '../foundry'

export declare class BaseActor extends Document {
  testUserPermission: (user: User, permission: Permission) => boolean
}
