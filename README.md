# Site — O Beabá da Sustentabilidade

Site estático (HTML + CSS + JS), sem build. Publicado pelo GitHub Pages.

## Onde fica cada coisa

| Arquivo | O que tem | Quando mexer |
|---|---|---|
| `index.html` | Página inicial, em blocos numerados (`<!-- 1. CABEÇALHO -->`, `<!-- 2. HERO -->`…) | Mudar textos, links, parceiros, matérias |
| `episodios.html` | Página com todos os episódios e filtros | Raramente: o conteúdo vem da planilha |
| `na-midia.html` | Lista completa de matérias | Adicionar matéria nova |
| `cursos.html` | Página de cursos (desligada) | Quando lançar os cursos |
| `script.js` | Comportamento do site, em 12 seções numeradas. **A seção 1 (CONFIGURAÇÃO) é a única que você normalmente edita** | Planilha, ligar cursos, categorias novas |
| `style.css` | Visual do site, em 18 seções numeradas. A seção 1 tem as cores da marca | Mudar cores, tamanhos, espaçamentos |
| `imagens/` | Fotos e logos (veja `imagens/LEIA-ME.md`) | Trocar ou adicionar imagens |

Cabeçalho e rodapé se repetem nas 4 páginas: ao mudar um link do menu, altere em todas.
Use Ctrl+F com o número da seção (ex.: `5. LEITURA`) para achar um trecho.

---

## 1. Publicar no GitHub Pages

1. Crie um repositório no GitHub (ex.: `site-beaba`).
2. Envie o conteúdo **desta pasta** para a raiz do repositório.
   - Pelo Git: `.gitignore` já deixa de fora os rascunhos do Claude Design
     (`uploads/`, `screenshots/`, `design-canvas.jsx`, `opcoes-contraste.html`).
   - Pelo site do GitHub ("Add file › Upload files"): o `.gitignore` não vale,
     então **não arraste** esses arquivos de rascunho.
3. No repositório: **Settings › Pages › Source: Deploy from a branch ›
   `main` / `(root)`** › Save. Em ~1 minuto o site fica em
   `https://SEU-USUARIO.github.io/site-beaba/`.

### Domínio próprio (obeabadasustentabilidade.com.br)

1. Em **Settings › Pages › Custom domain**, digite `www.obeabadasustentabilidade.com.br` e salve
   (o GitHub cria o arquivo `CNAME`). Marque **Enforce HTTPS** quando liberar.
2. No painel DNS do domínio (Registro.br ou onde estiver):
   - `www` → **CNAME** → `SEU-USUARIO.github.io`
   - raiz (`@`) → **A** → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. **Não mexa nos registros MX** (Zoho): são eles que fazem o e-mail
   `contato@obeabadasustentabilidade.com.br` funcionar.

---

## 2. Contato (e-mail e WhatsApp)

O site não tem formulário e não depende de nenhum serviço externo, como no site da SG Alvera.
A seção **Contato** do `index.html` tem:

- **Enviar e-mail:** abre o programa de e-mail do visitante (Gmail, Outlook…) já com o destinatário
  `contato@obeabadasustentabilidade.com.br` e o assunto preenchidos. A mensagem chega no Zoho.
- **Chamar no WhatsApp:** abre uma conversa com (16) 98145-7448 com uma mensagem inicial pronta.
- **Copiar endereço de e-mail:** para quem não tem programa de e-mail configurado no computador.

Os cards de **Serviços** também abrem o e-mail com o assunto do serviço clicado
(ex.: "Palestras - via site"), então você sabe de onde veio o contato.

Para mudar o assunto ou a mensagem pronta, edite no `index.html` o texto depois de `subject=` (e-mail)
ou `text=` (WhatsApp). Nesses links, espaço vira `%20`, `&` vira `%26` e acentos ficam codificados
(ex.: `á` = `%C3%A1`). Sites como <https://www.urlencoder.org> fazem a conversão.

---

## 3. Episódios e filtro (planilha do Google)

O site lê a planilha toda vez que alguém abre a página. Para publicar um episódio novo, basta
adicionar uma linha. Colunas lidas (pelo nome do cabeçalho, em qualquer ordem):
`Ordem Publicação`, `N°`, `Nome`, `Data`, `Duração Spotify`, `Categoria`, `Programa`, `Tipo`,
`Link Episódio Spotify`, `Link Episódio YouTube`, `Convidado`, `Empresa`.

- **Categoria:** uma ou várias, entre aspas: `"Clima e Mudanças Climáticas", "ODS e Agenda 2030"`.
  Para criar uma categoria nova, inclua o nome em `KNOWN_CATEGORIES` no `script.js`.
- A capa vem do link do YouTube. Sem YouTube, aparece uma capa colorida e o play abre o Spotify.
- O filtro também funciona por link, ex.: `episodios.html?categoria=ODS e Agenda 2030&programa=ESG no Agro`.

### ⚠️ Privacidade: a coluna "Contato"

Para o site conseguir ler, a planilha precisa estar como "Qualquer pessoa com o link pode ver".
Como o ID dela fica visível no código do site, **qualquer pessoa consegue baixar a planilha
inteira, inclusive os e-mails da coluna "Contato"** (hoje são 57). O site em si não mostra essa
coluna, mas o arquivo fica acessível.

Solução (5 minutos):
1. Crie uma planilha nova, ex.: "Episódios — Site (pública)".
2. Na célula A1, cole (trocando `ID_DA_PLANILHA_ORIGINAL`):
   ```
   =IMPORTRANGE("ID_DA_PLANILHA_ORIGINAL"; "A:M")
   ```
   e clique em **Permitir acesso**. As colunas A a M vão até "Empresa" e deixam "Contato" (N) de fora.
3. Compartilhe **só a planilha nova** como "Qualquer pessoa com o link: Leitor".
4. Mude a planilha original para **Restrito**.
5. Em `script.js`, troque `SHEET_ID` pelo ID da planilha nova (o trecho entre `/d/` e `/edit` na URL).

Você continua editando só a planilha original; a pública se atualiza sozinha.

---

## 4. Cursos (desligado)

Os cursos estão escondidos: menu, rodapé, destaques na home e em Episódios, e a página
`cursos.html` (que redireciona para a home). Para lançar, em `script.js`:

```js
const FEATURES = {
  cursos: true
};
```

Para esconder outro bloco com a mesma chave, adicione `data-feature="cursos"` ao elemento HTML.
Os cursos ficam no array `COURSES` do `script.js`.

---

## Testar no computador

Abra um terminal nesta pasta e rode `python -m http.server 8000`. Depois acesse <http://localhost:8000>.
