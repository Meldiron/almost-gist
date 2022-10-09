import { createContext, useEffect, useState } from "react";
import { AppwriteService } from "../services/appwrite";
import type { Models } from "appwrite";

const AccountContext = createContext<any>([null, () => {}]);

export const AccountProvider = ({ children }: any) => {
  const [account, setAccount] = useState<null | Models.Account<any>>(null);

  useEffect(() => {
    async function updateAccount() {
      setAccount(await AppwriteService.getAccount());
    }

    updateAccount();
  });

  return (
    <AccountContext.Provider value={[account, setAccount]}>
      {children}
    </AccountContext.Provider>
  );
};

export default AccountContext;
