import "next-auth";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      type?: string;
    };
  }

  interface User {
    id: string;
    type: string;
    name?:string;
    email?:string;
    image?:string;
  }

interface JWT {
    id?: string;
    type?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}
