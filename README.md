# StockBot
 Inventario de materiais Escolares(Elétrica)

## Novo Banco
https://dbdiagram.io/d/6861bf81f413ba35086b59b6

## ExcaliDraw

https://excalidraw.com/#room=5b0e2adb7520a5a2fec1,fgHGXLSlJwx7vptKWMn1mg


##Lucide - para icones

https://lucide.dev/icons/circle-user-round

#Apresentação

https://www.canva.com/design/DAGqMScxKQY/j3Q8ZttzbAuP0oYw7vH-XA/edit?utm_content=DAGqMScxKQY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

## Explicação das novas tarefas

Ok, entendi perfeitamente! Minhas desculpas por ter usado datas específicas. O ideal é usar prazos relativos (em dias) para que o README seja atemporal e a equipe possa planejar a partir de qualquer data de início.

Vamos refazer as explicações das tarefas com prazos em dias e garantir que todas as 19 tarefas de backend e documentação estejam cobertas, mantendo as prioridades.

Tarefas do Projeto StockBot Integrado - Detalhamento
Este documento detalha as tarefas do backend e de documentação para o projeto, com foco na integração do módulo de gerenciamento de estoque (StockBot) ao sistema educacional existente, considerando que os únicos tipos de usuário são 'aluno' e 'professor' e que a API existente será revisada e adaptada.

Legenda para Prazos: O prazo indica uma estimativa de dias de trabalho dedicados para a conclusão da tarefa.

I. Configuração e Base do Banco de Dados
1. Geração e Validação das Migrações do DB Consolidado
O que é?
Esta tarefa consiste em criar e testar os "passos" (scripts de migração) que o banco de dados precisa seguir para se adaptar ao novo modelo consolidado. Isso inclui adicionar as novas tabelas do StockBot (Categorias, Materiais, Movimentacoes, Alertas, Configuracoes). Não será necessário alterar a estrutura da tabela Usuarios, que continuará com os tipos existentes ('aluno' e 'professor').

Por que é importante?
As migrações garantem que as alterações no banco de dados sejam aplicadas de forma controlada e rastreável, tanto em ambiente de desenvolvimento quanto em produção. É a base para todas as novas funcionalidades.

Prioridade: Alta

Prazo Previsto: 2 dias

Exemplos de subtarefas:

Definir/revisar a ferramenta de migração a ser utilizada (Ex: Flyway, Alembic, Sequelize Migrations, TypeORM Migrations, etc.).

Criar o script SQL ou a migração via ORM para cada nova tabela do StockBot.

Executar as migrações em um banco de dados de desenvolvimento.

Verificar se todas as tabelas foram criadas corretamente e se as colunas estão com os tipos e restrições esperadas.

II. Gerenciamento de Usuários e Perfis (Backend)
2. Revisão e Adaptação da API para Criação de Usuário
O que é?
Revisar e adaptar a rota da API (endpoint HTTP) existente que permite a criação de novos usuários no sistema. O objetivo é garantir que a atribuição do tipo (aluno ou professor) funcione corretamente e que a API esteja alinhada com as necessidades do sistema integrado, sem a necessidade de novos tipos de usuário específicos para estoque.

Por que é importante?
Assegura que a funcionalidade fundamental de cadastro de usuários esteja robusta e pronta para futuras integrações, mantendo a padronização.

Prioridade: Alta

Prazo Previsto: 1 dia

Exemplos de subtarefas:

Revisar o método no UsuariosController que lida com requisições POST para /usuarios.

Garantir que a lógica no UsuariosService processe os dados do novo usuário, validando o tipo fornecido (que será 'aluno' ou 'professor').

Verificar a integração com o IUsuariosRepository para persistir o novo usuário no banco de dados.

3. Revisão e Adaptação da API para Atualização de Tipo/Perfil de Usuário
O que é?
Revisar e adaptar a rota da API existente que permite a um usuário com permissões de administração (se essa distinção existir na sua aplicação) alterar o tipo (perfil) de um usuário existente (entre 'aluno' e 'professor').

Por que é importante?
Oferece flexibilidade para o gerenciamento de perfis de usuário após a criação, garantindo que as permissões possam ser ajustadas conforme necessário.

Prioridade: Alta

Prazo Previsto: 1 dia

Exemplos de subtarefas:

Revisar o método no UsuariosController que lida com requisições PUT ou PATCH para /usuarios/{id}/perfil.

Adaptar a lógica no UsuariosService para buscar o usuário, validar a permissão do solicitante e atualizar o tipo do usuário no banco.

Assegurar que apenas usuários autorizados (Ex: se apenas certos professores podem fazer isso) possam usar este endpoint.

4. Ajuste da Lógica de Autorização para Acesso a Módulos de Estoque
O que é?
Revisar e adaptar o sistema de segurança do backend para que somente usuários com o perfil de Professor (ou Aluno, se eles também gerenciarem estoque) possam acessar as funcionalidades (endpoints) relacionadas ao novo módulo de estoque (como adicionar materiais, registrar movimentações, ver alertas).

Por que é importante?
Garante a segurança e a integridade dos dados do estoque, evitando que usuários não autorizados façam alterações ou visualizem informações restritas.

Prioridade: Alta

Prazo Previsto: 2 dias

Exemplos de subtarefas:

Identificar todos os endpoints relacionados ao módulo de estoque.

Aplicar "middlewares", "interceptors" ou "guards" de segurança a esses endpoints para verificar se o tipo do usuário logado é professor (e/ou aluno, dependendo de quem terá acesso ao estoque).

Definir quais operações específicas cada perfil pode realizar (ex: Professor pode fazer movimentações, Aluno pode só ver o histórico).

5. Revisão e Adaptação da Lógica para Visualização de Perfis Relacionados (Alunos/Professores)
O que é?
Revisar e adaptar a lógica existente que, ao consultar detalhes de um Usuario, carrega as informações específicas de Aluno (matrícula, data de ingresso) ou Professor (CPF, titulação, data de nascimento) junto com os dados básicos do usuário. Isso é fundamental para manter a visão unificada dos usuários.

Por que é importante?
Oferece uma visão completa do usuário, unificando as informações da "escola" com os possíveis responsáveis pelo "almoxarifado".

Prioridade: Média

Prazo Previsto: 1 dia

Exemplos de subtarefas:

Revisar o método GET /usuarios/{id} no UsuariosService para garantir que, ao buscar um usuário, ele também verifique se esse usuário tem um registro em Alunos ou Professores e inclua esses dados na resposta da API.

Otimizar o uso de joins ou sub-consultas no IUsuariosRepository para a busca desses dados relacionados.

6. Escrita de Testes Unitários para Gerenciamento de Usuários
O que é?
Criar pequenos códigos de teste (testes unitários) para cada pedacinho da lógica dos endpoints e serviços relacionados ao gerenciamento de usuários. Isso significa testar a criação e atualização de perfis, e a lógica de autorização de forma isolada.

Por que é importante?
Garante que cada parte do código de gerenciamento de usuários funcione corretamente por si só, facilitando a identificação de bugs e a manutenção futura.

Prioridade: Média

Prazo Previsto: 1.5 dias

Exemplos de subtarefas:

Escrever testes para o UsuariosService (verificando se a criação e atualização funcionam como esperado, se as validações de tipo são aplicadas).

Escrever testes para os middlewares/guards de autorização (verificando se usuários com tipo inadequado são bloqueados e usuários com tipo permitido são liberados para funcionalidades de estoque).

Simular chamadas aos repositórios para garantir que o serviço interaja corretamente com a camada de dados.

IV. Módulo de Gerenciamento de Estoque (Backend)
7. Implementação da API para CRUD de Categorias
O que é?
Desenvolver todas as partes do backend necessárias para gerenciar as categorias de materiais:

CategoriasController: Responsável por receber as requisições HTTP (criação, leitura, atualização, exclusão de categorias).

CategoriasService: Contém a lógica de negócio para as categorias (validações, regras).

ICategoriasRepository: Interface/classe responsável pela interação direta com o banco de dados para a tabela Categorias.

Por que é importante?
Permite organizar os materiais em grupos lógicos, facilitando a busca e o gerenciamento.

Prioridade: Alta

Prazo Previsto: 2 dias

Exemplos de subtarefas:

Criar endpoints: POST /categorias, GET /categorias, GET /categorias/{id}, PUT /categorias/{id}, DELETE /categorias/{id}.

Implementar validações no serviço (ex: nome da categoria único).

Aplicar as regras de autorização: Apenas usuários com tipo 'professor' (e/ou 'aluno') ou um perfil específico designado, se houver, podem acessar esses endpoints.

8. Implementação da API para CRUD de Materiais
O que é?
Desenvolver todas as partes do backend necessárias para gerenciar os materiais no estoque:

MateriaisController: Receber requisições HTTP para materiais.

MateriaisService: Lógica de negócio para materiais (validações, regras).

IMateriaisRepository: Interagir com a tabela Materiais no banco de dados.

Por que é importante?
É a funcionalidade central do módulo de estoque, permitindo cadastrar, consultar e atualizar os itens.

Prioridade: Alta

Prazo Previsto: 3 dias

Exemplos de subtarefas:

Criar endpoints: POST /materiais, GET /materiais, GET /materiais/{id}, PUT /materiais/{id}, DELETE /materiais/{id}.

Implementar validações: codigo único, quantidade não negativa, quantidade_minima não negativa, data_validade não pode ser no passado na criação.

Garantir que a categoria_id referencie uma categoria existente.

Aplicar as regras de autorização: Apenas usuários com tipo 'professor' (e/ou 'aluno') ou um perfil específico designado podem acessar esses endpoints.

9. Implementação da API para Registro de Movimentações (Entrada/Saída)
O que é?
Desenvolver a API para registrar quando um material entra ou sai do estoque. Quando uma movimentação é registrada, a quantidade atual do material deve ser automaticamente atualizada. Esta API também registrará qual usuario_id (Professor/Aluno logado) fez a movimentação.

Por que é importante?
Essencial para rastrear o fluxo dos materiais, manter o estoque atualizado e ter um histórico completo das operações.

Prioridade: Alta

Prazo Previsto: 2 dias

Exemplos de subtarefas:

Criar endpoints: POST /movimentacoes/entrada e POST /movimentacoes/saida.

No MovimentacoesService, implementar a lógica que:

Recebe o código do material, tipo (entrada/saída), quantidade, motivo, detalhes e usuario_id (do usuário logado que está realizando a ação).

Busca o material e verifica se existe.

Calcula a nova quantidade (quantidade_atualizada).

Verifica se há estoque suficiente para saídas.

Persiste o registro na tabela Movimentacoes.

Atualiza a quantidade e data_ultima_movimentacao na tabela Materiais dentro da mesma transação (isso substitui o trigger after_movimentacao_insert).

Aciona a lógica de geração de alertas (Tarefa 11).

Aplicar as regras de autorização: Apenas usuários com tipo 'professor' (e/ou 'aluno') ou um perfil específico designado podem realizar movimentações.

10. Implementação da API para Consulta de Histórico de Movimentações
O que é?
Desenvolver uma rota da API que permita consultar todas as movimentações (entrada, saída, ajuste) de um material específico, geralmente ordenadas por data.

Por que é importante?
Permite visualizar o histórico completo de um material, auxiliando na auditoria e no entendimento do seu uso.

Prioridade: Média

Prazo Previsto: 1 dia

Exemplos de subtarefas:

Criar endpoint: GET /materiais/{codigo}/historico (com parâmetro limit opcional).

No MovimentacoesService, implementar a lógica para buscar no IMovimentacoesRepository todas as movimentações de um material_id específico, ordenadas cronologicamente.

Aplicar as regras de autorização: Define quem pode consultar o histórico (ex: usuários com tipo 'professor', ou qualquer usuário logado que tenha acesso a essa parte da aplicação).

11. Implementação da Lógica de Geração de Alertas (Estoque Baixo/Validade Próxima)
O que é?
Integrar as verificações de "estoque baixo" e "validade próxima" diretamente na lógica do backend. Essas verificações serão realizadas por métodos dentro dos Services (principalmente no MovimentacoesService ou MateriaisService) sempre que uma quantidade de material for alterada ou um material for consultado.

Por que é importante?
Notifica os usuários sobre situações críticas do estoque em tempo real (ou quase real), permitindo ações preventivas.

Prioridade: Média

Prazo Previsto: 2 dias

Exemplos de subtarefas:

No MovimentacoesService (após uma movimentação) ou MateriaisService (após uma atualização de material):

Verificar se a quantidade atual do material está abaixo da quantidade_minima. Se sim, criar um registro de alerta na tabela Alertas (se um alerta pendente do mesmo tipo para o mesmo material não existir).

Verificar se a data_validade do material está próxima (ex: dentro de 30 dias). Se sim, criar um alerta (se um alerta pendente do mesmo tipo para o mesmo material não existir).

Criar um AlertasService para gerenciar a criação e verificação de alertas.

12. Implementação da Lógica de Geração de Alerta de Inatividade (Agendamento)
O que é?
Desenvolver uma funcionalidade no backend que, em intervalos regulares (ex: uma vez por dia), verifica quais materiais não tiveram movimentação por um longo período (ex: 180 dias) e gera um alerta de "inativo". Isso substituirá o EVENT do banco de dados.

Por que é importante?
Ajuda a identificar materiais obsoletos ou esquecidos no estoque, otimizando o uso do espaço e recursos.

Prioridade: Média

Prazo Previsto: 2 dias

Exemplos de subtarefas:

Implementar um método no AlertasService ou um serviço dedicado (InatividadeService) que:

Consulta a tabela Materiais por itens com data_ultima_movimentacao muito antiga.

Cria registros de alerta de tipo 'inativo' na tabela Alertas para esses materiais (se um alerta pendente do mesmo tipo não existir).

Configurar um mecanismo de agendamento (cron job no sistema operacional, ou uma funcionalidade de agendamento no próprio framework/linguagem do backend) para chamar este método periodicamente.

13. Implementação da API para Resolução de Alertas
O que é?
Criar uma rota da API que permita marcar um alerta específico como "resolvido", atualizando o campo resolvido para TRUE e preenchendo a data_resolucao e, opcionalmente, o usuario_resolucao_id (o Professor/Aluno que resolveu o alerta) na tabela Alertas.

Por que é importante?
Permite que a equipe de gestão de estoque registre que um problema alertado foi endereçado, mantendo a lista de alertas pendentes limpa e relevante.

Prioridade: Média

Prazo Previsto: 1 dia

Exemplos de subtarefas:

Criar endpoint: PUT /alertas/{id}/resolver.

No AlertasService, implementar a lógica para buscar o alerta, atualizar seus campos e persistir a alteração.

Aplicar as regras de autorização: Apenas usuários com tipo 'professor' (e/ou 'aluno') ou um perfil específico designado podem resolver alertas.

14. Implementação da API para Listagem de Alertas Pendentes
O que é?
Desenvolver uma rota da API que retorna apenas os alertas que ainda não foram resolvidos (resolvido = FALSE).

Por que é importante?
Fornece aos usuários uma visão clara das pendências e problemas atuais do estoque que precisam de atenção.

Prioridade: Média

Prazo Previsto: 1 dia

Exemplos de subtarefas:

Criar endpoint: GET /alertas/pendentes.

No AlertasService, implementar a lógica para consultar a tabela Alertas filtrando por resolvido = FALSE.

Pode incluir opções de filtro por tipo de alerta ou material_id.

Aplicar as regras de autorização: Apenas usuários com tipo 'professor' (e/ou 'aluno') ou um perfil específico designado podem visualizar alertas.

15. Implementação da API para CRUD de Configurações do Sistema
O que é?
Desenvolver todas as partes do backend para gerenciar as configurações gerais do sistema de estoque:

ConfiguracoesController: Receber requisições HTTP para configurações.

ConfiguracoesService: Lógica de negócio para configurações.

IConfiguracoesRepository: Interagir com a tabela Configuracoes no banco de dados.

Por que é importante?
Permite ajustar parâmetros importantes do sistema (como valores padrão para estoque mínimo ou dias para alertas) sem necessidade de alterar o código diretamente.

Prioridade: Média

Prazo Previsto: 1.5 dias

Exemplos de subtarefas:

Criar endpoints: GET /configuracoes, GET /configuracoes/{chave}, PUT /configuracoes/{chave}.

Implementar validações para garantir que as chaves de configuração sejam válidas e os valores sejam do tipo esperado.

Aplicar as regras de autorização: Geralmente, apenas um subconjunto de usuários 'professor' (aqueles com privilégios de administração) deve ter acesso a essas configurações.

16. Escrita de Testes Unitários para Módulo de Estoque (Geral)
O que é?
Criar pequenos códigos de teste (testes unitários) para cada pedacinho da lógica dos endpoints, services e repositories de todas as entidades do módulo de estoque (Categorias, Materiais, Movimentacoes, Alertas, Configuracoes). Isso significa testar as funções de criação, busca, atualização e exclusão de forma isolada para cada um desses componentes.

Por que é importante?
Garante que cada parte do código do backend do estoque funcione corretamente por si só, facilitando a identificação de bugs e a manutenção futura.

Prioridade: Média

Prazo Previsto: 2 dias

Exemplos de subtarefas:

Testes para os métodos de CRUD de cada Service (verificando se a criação, busca, atualização e exclusão funcionam como esperado).

Testes para as validações de entrada de dados em cada Service.

Simular chamadas aos Repositories para garantir que o Service interaja corretamente com a camada de dados.

17. Escrita de Testes de Integração para Módulo de Estoque (Fluxos)
O que é?
Criar testes que verificam se diferentes partes do módulo de estoque interagem corretamente entre si, simulando fluxos completos de uso. Ao contrário dos testes unitários, que testam partes isoladas, os testes de integração verificam a comunicação entre elas.

Por que é importante?
Assegura que as funcionalidades combinadas funcionem como esperado no sistema como um todo. Por exemplo, uma movimentação de saída deve não apenas registrar a saída, mas também diminuir a quantidade do material e, se for o caso, gerar um alerta de estoque baixo.

Prioridade: Média

Prazo Previsto: 3 dias

Exemplos de subtarefas:

Testar o fluxo de registro de uma "saída" de material e verificar se:

A quantidade no Materiais foi atualizada corretamente.

Um registro em Movimentacoes foi criado.

(Se aplicável) Um alerta de "estoque_baixo" foi gerado se a quantidade atingiu o mínimo.

Testar se uma movimentação de saída, ao atingir o estoque mínimo, gera um alerta de "estoque_baixo".

Testar se a atualização da data_validade de um material dispara um alerta de "validade_proxima".

Testar o fluxo de resolução de um alerta e verificar se ele é marcado como resolvido.

VI. Qualidade e Documentação
18. Revisão de Código Geral do Projeto
O que é?
Processo onde os membros da equipe revisam o código uns dos outros. Analisam a qualidade do código, buscam por erros, sugerem melhorias, garantem que as boas práticas e padrões de codificação sejam seguidos. Isso é tipicamente feito através de "Pull Requests" ou "Merge Requests" em ferramentas como Gitlab, GitHub ou Bitbucket.

Por que é importante?
Melhora a qualidade do código, compartilha conhecimento na equipe (todos aprendem com os acertos e erros uns dos outros), detecta bugs mais cedo e garante a padronização do desenvolvimento, tornando o código mais fácil de entender e manter no futuro.

Prioridade: Média

Prazo Previsto: 2 dias

Exemplos de subtarefas:

Realizar revisões detalhadas de Pull/Merge Requests antes de mesclar o código para a branch principal.

Utilizar ferramentas de análise estática de código (linters) para identificar problemas automaticamente.

Realizar sessões de pareamento para revisar códigos mais complexos ou críticos em conjunto.

19. Atualização/Criação da Documentação Técnica (API, DB)
O que é?
Criar e manter documentos que descrevem como o sistema foi construído e como suas partes se comunicam. Isso inclui:

Documentação da API: Detalhes sobre cada endpoint (o que ele faz, quais dados ele espera receber, quais dados ele retorna, exemplos de uso, códigos de status de erro). Ferramentas como Swagger/OpenAPI podem gerar isso automaticamente a partir do código.

Documentação do Banco de Dados: Explicar cada tabela, seus campos, os relacionamentos entre as tabelas e o propósito geral de cada uma.

Documentação de Lógica de Negócio: Explicar como funcionalidades complexas (como a geração de alertas) funcionam internamente.

Por que é importante?
Facilita a vida de novos desenvolvedores que entram no projeto, ajuda a equipe atual a resolver problemas, e serve como uma referência clara para futuras extensões ou integrações com outros sistemas. Garante que o conhecimento sobre o sistema não se perca.

Prioridade: Alta

Prazo Previsto: 3 dias

Exemplos de subtarefas:

Gerar ou escrever manualmente a documentação da API para todos os novos endpoints do módulo de estoque.

Atualizar o diagrama do banco de dados (usando o script do DBdiagram.io) e incluir uma explicação das tabelas novas e seus relacionamentos.

Documentar as regras de negócio de como os alertas são gerados e resolvidos.
