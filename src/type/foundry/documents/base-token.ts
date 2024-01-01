import { Permission, User } from '../foundry'

export declare class BaseToken {
  testUserPermission: (user: User, permission: Permission) => boolean
}
