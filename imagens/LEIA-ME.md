# Pasta de imagens do site

Regras gerais para os nomes dos arquivos: **letras minúsculas, sem acento, sem espaço** (use hífen).
Exemplo: `instituto-arvores.png` ✅, `Logo Árvores Vivas.PNG` ❌. O GitHub diferencia maiúsculas de minúsculas.

| Pasta | O que vai aqui | Formato e tamanho sugeridos |
|---|---|---|
| `marca/` | Logos do Beabá (horizontal, vertical, negativo) | PNG com fundo transparente |
| `equipe/` | Fotos da equipe | JPG quadrado, 400×400 px |
| `parceiros/` | Logos dos parceiros | PNG transparente, ~400 px de largura |
| `clientes/` | Logos dos clientes | PNG transparente, ~400 px de largura |
| `servicos/` | Fotos dos 3 serviços | JPG 800×600 px (4:3) |
| `cursos/` | Capas dos cursos (quando lançar) | JPG 800×450 px |

Tente manter cada imagem abaixo de 300 KB. Sites como <https://squoosh.app> comprimem imagens grátis.

---

## Trocar uma imagem existente

Salve o arquivo novo **com o mesmo nome** do antigo, na mesma pasta. Não precisa mexer no código.

## Fotos da equipe

Salve como `equipe/gustavo.jpg` e `equipe/renato.jpg`. Enquanto a foto não existir, o site mostra as iniciais.

## Fotos dos serviços

Salve como `servicos/consultoria.jpg`, `servicos/palestras.jpg` e `servicos/conteudo.jpg`.
Enquanto não existirem, o site usa as fotos atuais do Unsplash. Se elas falharem, usa as ilustrações (`*-ilustracao.jpg`).

## Capas dos cursos

`cursos/curso_1.jpg`, `curso_2.jpg`, `curso_3.jpg` (na ordem da lista `COURSES` do `script.js`).

## Adicionar um parceiro ou cliente novo

1. Coloque o logo em `parceiros/` ou `clientes/` (ex.: `clientes/natura.png`).
2. No `index.html`, procure a seção **Parcerias Estratégicas** ou **Nossos Clientes** e copie uma linha
   como esta, trocando o site, o arquivo e o nome:

```html
<a href="https://www.natura.com.br/" target="_blank" rel="noopener" class="partner-logo"><img src="imagens/clientes/natura.png" alt="Natura"></a>
```

Para remover, apague a linha correspondente (e o arquivo, se quiser).

**Logo com letras brancas** (como o da É Conosco): acrescente `partner-logo--dark` na classe,
assim: `class="partner-logo partner-logo--dark"`. A caixa fica azul-escura e o logo aparece.

**Dica:** recorte as margens vazias do logo antes de salvar. Margem sobrando deixa o logo pequeno na caixa.

A pasta `_originais/` guarda as versões originais das imagens que foram otimizadas.
Ela não vai para o site (está no `.gitignore`).
