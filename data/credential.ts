type User = {
  email: string;
  password: string;
  name: string;
  role: string;
  other: any;
};

const user: User[] = [
  {
    email: "68081509@company.com",
    password: "pass",
    name: "นายพงศกร คายโส",
    role: "admin",
    other: "...",
  },

  {
    email: "admin@company.com",
    password: "pass",
    name: "นายยิ่งใหญ่ มโหฬาร",
    role: "admin",
    other: "...",
  },

  {
    email: "user@company.com",
    password: "pass",
    name: "นายใช้งาน",
    role: "user",
    other: "...",
  },

  {
    email: "manager@company.com",
    password: "pass",
    name: "นางจัดการ",
    role: "manager",
    other: "...",
  },
];

export type Credential = {
  token: string;
  email: string;
  name: string;
  role: string;
};

export const login = (
  email: string,
  pass: string,
): Promise<Credential | string> => {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        if (Math.random() < 0.8) {
          // find user by email,pass
          const u = user.find((u) => u.email === email && u.password === pass);
          //user not found
          if (u === undefined) {
            reject("user not found");
            return;
          }
          //user found
          const newCredential: Credential = {
            token: crypto.randomUUID(),
            email: u.email,
            name: u.name,
            role: u.role,
          };
          // ... store credential
          resolve(newCredential);
        } else {
          reject("connection refused");
        }
      },
      1000 + Math.random() * 2000,
    );
  });
};

export const logout = (token: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
        if (Math.random() < 0.8) {
          // ... remove credential
          resolve("success");
        } else {
          reject("connection refused");
        }
      },
      1000 + Math.random() * 2000,
    );
  });
};
