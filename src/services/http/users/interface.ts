interface InterfaceListUsers {
  id: number;
  email: string;
  name: string;
  publicId: string;
  preferredName: string;
  createdAt: Date;
  updatedAt: Date;
  colaboratorId: number;
}

export type {
  InterfaceListUsers,
};
