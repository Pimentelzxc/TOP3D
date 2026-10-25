import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lightbulb,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { materials } from "../../data/materials";
import { recommend } from "../../lib/recommend.mjs";
import { Reveal, SectionHeading, ContactButton } from "../ui/Primitives";
import { Modal } from "../ui/Modal";
const questions = [
  {
    key: "purpose",
    question: "O que você pretende imprimir?",
    options: [
      "Decoração ou arte",
      "Protótipo visual",
      "Peça funcional",
      "Ainda estou explorando",
    ],
  },
  {
    key: "resistant",
    question: "A peça precisa suportar esforço mecânico?",
    options: ["Sim", "Não", "Não sei ainda"],
  },
  {
    key: "flexible",
    question: "Ela precisa ser flexível?",
    options: ["Sim", "Não", "Não sei ainda"],
  },
  {
    key: "outdoor",
    question: "Será utilizada em ambiente externo?",
    options: ["Sim", "Não", "Não sei ainda"],
  },
  {
    key: "experience",
    question: "Qual é sua experiência com impressão 3D?",
    options: ["Iniciante", "Já imprimo com frequência", "Profissional"],
  },
];
export default function MaterialGuide({
  active,
  setActive,
}: {
  active: string;
  setActive: (id: string) => void;
}) {
  const [quiz, setQuiz] = useState(false),
    [step, setStep] = useState(0),
    [answers, setAnswers] = useState<Record<string, string>>({});
  const material = materials.find((m) => m.id === active) || materials[0];
  const suggestion = recommend(answers);
  const question = questions[step];
  function openQuiz() {
    setQuiz(true);
    setStep(0);
    setAnswers({});
  }
  return (
    <section id="guia" className="section container guide-section">
      <Reveal>
        <div className="section-row">
          <SectionHeading
            eyebrow="MENOS DÚVIDAS. MAIS POSSIBILIDADES."
            title={
              <>
                Cada projeto merece
                <br />o material certo.
              </>
            }
            description="Uma boa impressão começa com uma boa escolha. Compare as características e encontre seu ponto de partida."
          />
          <span className="guide-kicker">
            <Lightbulb size={19} />
            CONHECIMENTO QUE
            <br />
            VIRA CRIAÇÃO
          </span>
        </div>
        <div className="guide-panel">
          <div
            className="guide-tabs"
            role="tablist"
            aria-label="Comparação de materiais"
          >
            {materials.map((m) => (
              <button
                id={`tab-${m.id}`}
                role="tab"
                aria-selected={active === m.id}
                aria-controls="material-panel"
                tabIndex={active === m.id ? 0 : -1}
                key={m.id}
                onClick={() => setActive(m.id)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    const next =
                      materials[
                        (materials.indexOf(m) +
                          (e.key === "ArrowRight" ? 1 : 3)) %
                          4
                      ];
                    setActive(next.id);
                    document.getElementById(`tab-${next.id}`)?.focus();
                  }
                }}
              >
                {m.name}
                <span>{m.subtitle}</span>
              </button>
            ))}
          </div>
          <div
            id="material-panel"
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                className="guide-content"
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div>
                  <span className="eyebrow">CONHEÇA O {material.name}</span>
                  <h3>{material.subtitle}</h3>
                  <p>{material.description}</p>
                  <div className="guide-applications">
                    <Check size={16} />
                    <span>{material.uses}</span>
                  </div>
                  <ContactButton
                    className="button-outline material-consult"
                    intent="material"
                    material={material.name}
                  >
                    Consultar {material.name}
                  </ContactButton>
                </div>
                <dl className="material-specs">
                  {[
                    ["Facilidade de impressão", material.ease],
                    ["Resistência mecânica", material.strength],
                    ["Flexibilidade", material.flexibility],
                    ["Resistência térmica", material.heat],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="guide-note">{material.note}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="quiz-banner">
          <div className="quiz-icon">
            <Sparkles size={24} />
          </div>
          <div>
            <h3>Uma ideia na cabeça. Qual material usar?</h3>
            <p>Responda 5 perguntas e descubra por onde começar.</p>
          </div>
          <button className="button button-outline" onClick={openQuiz}>
            Descobrir meu material
            <ArrowUpRightIcon />
          </button>
        </div>
        <p className="section-note">
          Comparativo educativo. A escolha final depende da aplicação, da
          formulação e das especificações do equipamento.{" "}
          <a
            href="https://help.prusa3d.com/category/material-guide_220"
            target="_blank"
            rel="noopener noreferrer"
          >
            Fonte técnica: Prusa.
          </a>
        </p>
      </Reveal>
      {quiz && (
        <Modal
          title={
            question
              ? "Vamos dar forma à sua ideia."
              : "Um ponto de partida para criar."
          }
          onClose={() => setQuiz(false)}
        >
          <div
            className="quiz-progress"
            aria-label={`Etapa ${Math.min(step + 1, 5)} de 5`}
          >
            {questions.map((q, i) => (
              <span key={q.key} className={i <= step ? "filled" : ""} />
            ))}
          </div>
          {question ? (
            <>
              <p className="eyebrow">PERGUNTA {step + 1} DE 5</p>
              <h3 className="quiz-question">{question.question}</h3>
              <div className="quiz-options">
                {question.options.map((option) => (
                  <button
                    key={option}
                    aria-pressed={answers[question.key] === option}
                    className={answers[question.key] === option ? "chosen" : ""}
                    onClick={() =>
                      setAnswers({ ...answers, [question.key]: option })
                    }
                  >
                    {option}
                    {answers[question.key] === option && <Check size={18} />}
                  </button>
                ))}
              </div>
              <div className="quiz-navigation">
                <button
                  className="button button-quiet"
                  disabled={step === 0}
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft size={16} />
                  Voltar
                </button>
                <button
                  disabled={!answers[question.key]}
                  className="button button-primary"
                  onClick={() => setStep(step + 1)}
                >
                  {step === 4 ? "Ver sugestão" : "Continuar"}
                  <ArrowRight size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="quiz-result">
              <Sparkles size={32} />
              <span className="eyebrow">SUGESTÃO EDUCATIVA</span>
              <h3>{suggestion.material}</h3>
              <p>{suggestion.reason}</p>
              <p className="section-note">
                Para: {answers.purpose}.{" "}
                {Object.values(answers).includes("Não sei ainda") &&
                  "Alguns requisitos ainda estão indefinidos; confirme-os antes da escolha. "}
                A indicação não garante compatibilidade, segurança ou
                disponibilidade comercial.
              </p>
              <ContactButton
                className="button-primary"
                intent="project"
                material={suggestion.material}
                answers={answers}
              >
                Conversar sobre meu projeto
              </ContactButton>
              <button className="text-link" onClick={openQuiz}>
                <RotateCcw size={16} />
                Refazer assistente
              </button>
            </div>
          )}
        </Modal>
      )}
    </section>
  );
}
function ArrowUpRightIcon() {
  return <ArrowRight size={17} />;
}
