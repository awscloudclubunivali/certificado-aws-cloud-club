/**
 * Configuração do evento.
 * Edite este arquivo para cada novo evento — o restante do sistema é genérico.
 */
module.exports = {
  // Nome do evento
  nomeEvento: "2º Meetup AWS Cloud Club Univali",

  // Data do evento exibida no rodapé do certificado
  dataEvento: "29 de abril de 2026",

  // Localização exibida no rodapé do certificado
  local: "Itajaí - SC",

  // Configurações de email
  email: {
    assunto: "Seu Certificado - 2º Meetup AWS Cloud Club Univali",
    nomeRemetente: "AWS Cloud Club Univali",
  },

  // Assinante do certificado
  assinante: {
    nome: "Henrique Zimermann",
    cargo: "AWS Cloud Club Captain",
    // PNG com fundo transparente
    imagemUrl:
      "https://aws-cloud-club-univali.s3.sa-east-1.amazonaws.com/imagens/assinatura-henrique.png",
  },

  // Logo/mascote exibido no canto do certificado
  logoUrl:
    "https://aws-cloud-club-univali.s3.sa-east-1.amazonaws.com/imagens/logo-mascote.png",

  /**
   * Corpo do certificado por modo.
   * Suporta tags HTML: <strong>, <em>, etc.
   * Disponível para cada modo: "participante" e "organizador".
   */
  corpoTexto: {
    participante: `Participou com êxito do <strong>2º Meetup AWS Cloud Club Univali: O Futuro do Desenvolvimento com IA e Fundamentos da Nuvem</strong>. O encontro de duração de <strong>2 horas</strong> proporcionou uma imersão nos fundamentos da computação em nuvem e nos desafios reais do desenvolvimento de software com inteligência artificial, contemplando as palestras <em>"Proibido vibe codar: Desenvolvimento assistido por IA"</em> (por Alex Rese e Renato Costa) e <em>"AWS: Serviços Essenciais"</em> (por Fabricio Bortoluzzi).`,

    organizador: `Participou como <strong>Membro da Organização Voluntário(a)</strong> na realização do <strong>2º Meetup AWS Cloud Club Univali: O Futuro do Desenvolvimento com IA e Fundamentos da Nuvem</strong>. O encontro e as atividades de organização totalizaram uma carga horária de <strong>6 horas</strong>, sendo a sua dedicação fundamental para viabilizar as palestras <em>"Proibido vibe codar: Desenvolvimento assistido por IA"</em> e <em>"AWS: Serviços Essenciais"</em>.`,
  },
};
