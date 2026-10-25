export function recommend({ flexible, outdoor, resistant, experience }) {
  if (flexible === "Sim")
    return {
      material: "TPU",
      reason:
        "A flexibilidade é o requisito principal. Confira a dureza e a compatibilidade do extrusor.",
    };
  if (outdoor === "Sim")
    return {
      material: "Avaliação técnica",
      reason:
        "Exposição ao sol, umidade e calor pede uma avaliação específica. ASA pode ser uma opção educativa, mas a disponibilidade na TOP3D não está confirmada.",
    };
  if (resistant === "Sim")
    return {
      material: "PETG",
      reason:
        "Pode ser um bom ponto de partida para peças funcionais. Valide cargas, temperatura e orientação das camadas.",
    };
  return {
    material: "PLA",
    reason:
      experience === "Iniciante"
        ? "Um ponto de partida acessível para aprender e criar modelos visuais."
        : "Uma opção para modelos visuais e peças decorativas sem exigência térmica.",
  };
}
