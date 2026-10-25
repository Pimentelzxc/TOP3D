import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
type Access = {
  status: "loading" | "anonymous" | "admin" | "denied" | "error";
  session: Session | null;
};
export function useAdminSession() {
  const [access, setAccess] = useState<Access>({
    status: supabase ? "loading" : "anonymous",
    session: null,
  });
  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let disposed = false,
      revision = 0;
    const verify = async (session: Session | null) => {
      const current = ++revision;
      if (!session) {
        if (!disposed) setAccess({ status: "anonymous", session: null });
        return;
      }
      if (!disposed)
        setAccess((previous) =>
          previous.status === "admin"
            ? previous
            : { status: "loading", session },
        );
      const { data, error } = await client.rpc("top3d_is_catalog_admin");
      if (!disposed && current === revision)
        setAccess({
          status: error ? "error" : data === true ? "admin" : "denied",
          session,
        });
    };
    client.auth.getSession().then(({ data, error }) => {
      if (error) {
        if (!disposed) setAccess({ status: "error", session: null });
      } else void verify(data.session);
    });
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => {
        if (!disposed) void verify(session);
      }, 0);
    });
    return () => {
      disposed = true;
      revision++;
      data.subscription.unsubscribe();
    };
  }, []);
  return access;
}
