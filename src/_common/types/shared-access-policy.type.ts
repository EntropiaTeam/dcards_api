type AccessPolicy = {
  Start: Date;
  Expiry: Date;
  Permissions: string;
};

type SharedAccessPolicy = {
  AccessPolicy: AccessPolicy;
};

export { SharedAccessPolicy };
