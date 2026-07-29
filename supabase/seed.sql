insert into public.ifa_events (
  slug, title, summary, description, starts_at, venue, city, state,
  external_url, featured, status
) values
(
  'e-depois-de-nos',
  'E depois de nós? Uma conversa sobre o futuro das famílias atípicas',
  'Um encontro de acolhimento, orientação e reflexão para pais e responsáveis.',
  E'💙 Olá, famílias!\n\nSabemos que a jornada de uma família atípica é feita de muito amor, dedicação e também de muitos desafios. Pensando nisso, gostaríamos de compartilhar um evento que pode ser muito enriquecedor para vocês.\n\nO Instituto Futuro Atípico promoverá um encontro voltado especialmente para pais e responsáveis, trazendo informações, orientação e reflexões importantes sobre o presente e, principalmente, sobre o futuro das pessoas atípicas e de suas famílias.\n\nSerá um momento de muito aprendizado, acolhimento e troca de experiências com profissionais e outras famílias que vivem essa mesma realidade.\n\nAcreditamos que conhecimento e apoio fazem toda a diferença nessa caminhada e, por isso, queremos deixar esse convite a todos vocês.\n\n💙 Esperamos que, se for possível, vocês participem.',
  null,
  'Local a confirmar',
  '',
  '',
  'https://www.sympla.com.br/evento/e-depois-de-nos-uma-conversa-sobre-o-futuro-das-familias-atipicas/3503308?share_id=copiarlink',
  true,
  'draft'
),
(
  'demo-continuidade-do-cuidado',
  '[DEMONSTRAÇÃO] Continuidade do cuidado na prática',
  'Evento demonstrativo editável sobre planejamento familiar e proteção da rotina.',
  'Conteúdo demonstrativo para organização inicial do painel. Revise todos os dados antes de publicar.',
  null,
  'Local a definir',
  'Belo Horizonte',
  'MG',
  '',
  false,
  'draft'
),
(
  'demo-rede-de-apoio',
  '[DEMONSTRAÇÃO] Construindo uma rede de apoio',
  'Encontro demonstrativo para conversar sobre acolhimento e suporte especializado.',
  'Conteúdo demonstrativo para organização inicial do painel. Revise todos os dados antes de publicar.',
  null,
  'Local a definir',
  'São Paulo',
  'SP',
  '',
  false,
  'draft'
)
on conflict (slug) do nothing;

insert into public.ifa_partners (
  slug, name, category, specialty, summary, description, city, state,
  external_url, discount_details, featured, status
) values
(
  'demo-medico-desenvolvimento',
  '[DEMONSTRAÇÃO] Profissional de Desenvolvimento Infantil',
  'medico',
  'Desenvolvimento infantil',
  'Perfil demonstrativo para configurar a rede de profissionais.',
  'Conteúdo fictício e editável. Substitua por dados verificados antes de publicar.',
  'Belo Horizonte',
  'MG',
  '',
  '',
  false,
  'draft'
),
(
  'demo-medico-psiquiatria',
  '[DEMONSTRAÇÃO] Profissional de Psiquiatria',
  'medico',
  'Psiquiatria',
  'Perfil demonstrativo para configurar a rede de profissionais.',
  'Conteúdo fictício e editável. Substitua por dados verificados antes de publicar.',
  'São Paulo',
  'SP',
  '',
  '',
  false,
  'draft'
),
(
  'demo-instituto-acolhimento',
  '[DEMONSTRAÇÃO] Instituto de Acolhimento',
  'instituto',
  'Acolhimento familiar',
  'Instituto demonstrativo para testar filtros e apresentação.',
  'Conteúdo fictício e editável. Substitua por dados verificados antes de publicar.',
  'Curitiba',
  'PR',
  '',
  '',
  false,
  'draft'
),
(
  'demo-instituto-terapias',
  '[DEMONSTRAÇÃO] Instituto de Terapias Integradas',
  'instituto',
  'Terapias integradas',
  'Instituto demonstrativo para testar filtros e apresentação.',
  'Conteúdo fictício e editável. Substitua por dados verificados antes de publicar.',
  'Rio de Janeiro',
  'RJ',
  '',
  '',
  false,
  'draft'
),
(
  'demo-estabelecimento-beneficio',
  '[DEMONSTRAÇÃO] Estabelecimento Parceiro',
  'estabelecimento_desconto',
  'Serviços para famílias',
  'Estabelecimento demonstrativo para validar a exibição de benefícios.',
  'Conteúdo fictício e editável. Substitua por dados e condições verificadas antes de publicar.',
  'Belo Horizonte',
  'MG',
  '',
  'Benefício demonstrativo — não publicar sem validação.',
  false,
  'draft'
)
on conflict (slug) do nothing;
