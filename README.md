# Ferreira Neves Advogados — prévia do redesign

Site estático (HTML/CSS/JS, sem build) com a proposta de redesign do site do
escritório Ferreira Neves Advogados.

- **Prévia online:** https://dsalladino.github.io/ferreira-neves-preview/
- **Produção atual:** https://ferreiranevesadvogados.com.br/

> Esta prévia está marcada com `noindex, nofollow` e `robots.txt` bloqueando
> indexação. O conteúdo não deve ser indexado pelo Google enquanto não for
> aprovado e publicado no domínio definitivo.

## Estrutura

- `index.html` — página inicial
- `o-escritorio.html`, `areas-de-atuacao.html`, `equipe.html`, `contato.html`
- `familia.html`, `sucessoes.html`, `consumidor.html`,
  `responsabilidade-civil.html`, `imobiliario.html`, `empresarial.html`,
  `tributario.html`
- `privacidade.html`, `alerta-de-fraude.html`, `404.html`
- `styles.css`, `main.js`, `assets/` (imagens, fontes locais e favicon)

## Como visualizar localmente

```bash
npx serve .
# ou
python -m http.server 8080
```

Abra `http://localhost:8080` (ou a porta indicada).

## Publicação

O site é publicado automaticamente pelo **GitHub Pages** a cada push na branch
`main` (publicação a partir da raiz do repositório). Não há etapa de build.

Para publicar uma alteração:

```bash
git add .
git commit -m "descrição da alteração"
git push origin main
```

A atualização leva cerca de um minuto para aparecer em
https://dsalladino.github.io/ferreira-neves-preview/.

## Observações

- O formulário de contato não envia dados para servidor: abre o aplicativo de
  e-mail do visitante já preenchido (`mailto:`).
- O mapa do Google só é carregado após consentimento explícito do visitante.
- O arquivo `_headers` (cabeçalhos de segurança) é usado por hospedagens como
  Cloudflare Pages/Netlify; o GitHub Pages não o aplica.
