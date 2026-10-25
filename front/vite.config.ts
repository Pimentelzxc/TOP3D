import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const key =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    env.VITE_SUPABASE_ANON_KEY ||
    "";
  let privateKey = key.startsWith("sb_secret_");
  if (key.startsWith("eyJ")) {
    try {
      privateKey =
        JSON.parse(Buffer.from(key.split(".")[1], "base64url").toString())
          .role !== "anon";
    } catch {
      privateKey = true;
    }
  }
  if (privateKey)
    throw new Error(
      "Use somente a chave publicável/anon do Supabase em VITE_SUPABASE_PUBLISHABLE_KEY. Chaves secretas não podem entrar no frontend.",
    );
  return {
    plugins: [react(), tailwindcss()],
    build: {
      target: "es2022",
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: "react",
                test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
                priority: 20,
              },
              { name: "supabase", test: /node_modules[\\/]@supabase[\\/]/ },
              {
                name: "react-router",
                test: /node_modules[\\/](react-router|react-router-dom)[\\/]/,
              },
            ],
          },
        },
      },
    },
  };
});
