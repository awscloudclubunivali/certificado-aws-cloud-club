/**
 * Configuração do evento.
 * Edite este arquivo para cada novo evento — o restante do sistema é genérico.
 */
module.exports = {
  // Nome do evento
  nomeEvento: "1º Meetup AWS Cloud Club Univali",

  // Localização exibida no rodapé do certificado
  local: "Itajaí - SC",

  // Configurações de email
  email: {
    assunto: "Seu Certificado - 1º Meetup AWS Cloud Club Univali",
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
    participante: `Participou com êxito do evento de lançamento <strong>1º Meetup AWS Cloud Club Univali: O Ecossistema AWS: Operação Diária e Estratégia de Arquitetura</strong>. O encontro proporcionou uma imersão na prática do dia a dia com a visão estratégica de arquitetura na nuvem, contemplando as palestras <em>"Como eu utilizo AWS no meu dia a dia como Analista de Dados"</em> (por Diego Silva) e <em>"Decisões Arquiteturais: Projetando Soluções de Alto Valor na AWS"</em> (por Regis Dias).`,

    organizador: `Participou como <strong>Membro da Organização Voluntário(a)</strong> na realização do evento de lançamento <strong>1º Meetup AWS Cloud Club Univali: O Ecossistema AWS: Operação Diária e Estratégia de Arquitetura</strong>. O encontro e as atividades de organização totalizaram uma carga horária de <strong>4 horas</strong>, sendo a sua dedicação fundamental para viabilizar as palestras <em>"Como eu utilizo AWS no meu dia a dia como Analista de Dados"</em> e <em>"Decisões Arquiteturais: Projetando Soluções de Alto Valor na AWS"</em>.`,
  },
};
