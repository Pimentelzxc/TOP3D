import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
export default function AdminLogin({
  recovery = false,
}: {
  recovery?: boolean;
}) {
  const [mode, setMode] = useState<"login" | "reset" | "password">(
    recovery ? "password" : "login",
  );
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [confirmation, setConfirmation] = useState(""),
    [visible, setVisible] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error)
          throw new Error(
            "Não foi possível entrar. Confira seu e-mail e senha e tente novamente.",
          );
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo: `${window.location.origin}/admin/recuperar` },
        );
        if (error)
          throw new Error(
            "Não foi possível solicitar a recuperação. Tente novamente em alguns instantes.",
          );
        setNotice(
          "Se este e-mail estiver cadastrado, você receberá as instruções para redefinir a senha.",
        );
      } else {
        if (password.length < 12)
          throw new Error("Use uma senha com pelo menos 12 caracteres.");
        if (password !== confirmation)
          throw new Error("As senhas precisam ser iguais.");
        const { data } = await supabase.auth.getUser();
        if (!data.user)
          throw new Error(
            "O link de recuperação expirou. Solicite um novo link.",
          );
        const { error } = await supabase.auth.updateUser({ password });
        if (error)
          throw new Error(
            "Não foi possível atualizar a senha. Solicite um novo link de recuperação.",
          );
        await supabase.auth.signOut();
        setNotice("Senha atualizada. Entre novamente para acessar o painel.");
        setMode("login");
        setPassword("");
        setConfirmation("");
      }
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Não foi possível concluir a operação.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-login-page">
      <div className="admin-login-art">
        <Link to="/" className="admin-back">
          <ArrowLeft size={16} />
          Voltar ao site
        </Link>
        <img
          className="admin-login-logo"
          src="/images/top3d-logo.webp"
          alt="TOP3D Filamentos"
          width="100"
          height="100"
        />
        <div>
          <div className="eyebrow">POR TRÁS DE CADA NOVA POSSIBILIDADE.</div>
          <h1>
            Seu catálogo.
            <br />
            Sua seleção.
            <br />
            <span>Seu próximo passo.</span>
          </h1>
          <p>
            Um espaço para cuidar dos materiais que
            <br />
            vão dar vida às próximas ideias.
          </p>
        </div>
        <span className="admin-art-foot">
          <ShieldCheck size={16} />
          ÁREA EXCLUSIVA TOP3D
        </span>
      </div>
      <div className="admin-login-side">
        <div className="admin-login-card">
          <span className="admin-login-icon">
            {mode === "login" ? (
              <LockKeyhole size={25} />
            ) : (
              <KeyRound size={25} />
            )}
          </span>
          <span className="eyebrow">ESTÚDIO TOP3D</span>
          <h2>
            {mode === "login"
              ? "Bom ter você por aqui."
              : mode === "reset"
                ? "Vamos recuperar seu acesso."
                : "Uma nova senha para continuar."}
          </h2>
          <p>
            {mode === "login"
              ? "Entre para gerenciar o catálogo da loja."
              : mode === "reset"
                ? "Enviaremos as instruções para o seu e-mail."
                : "Defina uma senha com pelo menos 12 caracteres."}
          </p>
          {!supabase && (
            <div className="admin-setup" role="status">
              <strong>Painel aguardando configuração</strong>
              <p>
                Conecte o Supabase e cadastre a administradora conforme as
                instruções em <code>back/README.md</code>. O catálogo online e o
                login serão habilitados após essa etapa.
              </p>
            </div>
          )}
          <form onSubmit={submit}>
            <fieldset disabled={!supabase || busy}>
              {mode !== "password" && (
                <label>
                  E-mail
                  <div className="admin-input-icon">
                    <Mail size={16} />
                    <input
                      type="email"
                      required
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                    />
                  </div>
                </label>
              )}
              {mode !== "reset" && (
                <label>
                  {mode === "password" ? "Nova senha" : "Senha"}
                  <div className="admin-input-icon">
                    <LockKeyhole size={16} />
                    <input
                      type={visible ? "text" : "password"}
                      required
                      minLength={mode === "password" ? 12 : undefined}
                      autoComplete={
                        mode === "password"
                          ? "new-password"
                          : "current-password"
                      }
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setVisible(!visible)}
                      aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {visible ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </label>
              )}
              {mode === "password" && (
                <label>
                  Confirme a senha
                  <input
                    type="password"
                    required
                    minLength={12}
                    autoComplete="new-password"
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                  />
                </label>
              )}
              {error && (
                <p role="alert" className="admin-error">
                  {error}
                </p>
              )}
              {notice && (
                <p role="status" className="admin-success">
                  {notice}
                </p>
              )}
              <button
                className="button button-primary admin-login-submit"
                type="submit"
              >
                {busy ? (
                  <LoaderCircle className="spin" size={18} />
                ) : (
                  <>
                    {mode === "login"
                      ? "Entrar no painel"
                      : mode === "reset"
                        ? "Enviar instruções"
                        : "Atualizar senha"}
                    <ArrowUpRight size={18} />
                  </>
                )}
              </button>
            </fieldset>
          </form>
          <button
            type="button"
            className="text-link admin-forgot"
            onClick={() => {
              setMode(mode === "login" ? "reset" : "login");
              setError("");
              setNotice("");
            }}
          >
            {mode === "login" ? "Esqueci minha senha" : "Voltar para o login"}
          </button>
          <p className="admin-login-foot">
            <ShieldCheck size={14} />
            Acesso restrito à administração da TOP3D.
          </p>
        </div>
      </div>
    </div>
  );
}
