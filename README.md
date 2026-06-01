# Site CPAP Minas

Site estático responsivo em HTML, CSS e JavaScript, pensado para campanhas de Google Ads com foco em contato via WhatsApp.

## Estrutura

```txt
cpap-minas-site/
├── index.html
├── privacidade.html
├── robots.txt
├── sitemap.xml
├── css/
│   └── style.css
├── js/
│   ├── config.js
│   └── script.js
└── assets/
    ├── images/
    │   ├── logo-cpap-minas.webp
    │   ├── aparelho-cpap-resmed.webp
    │   └── favicon.png
    └── video/
        ├── manutencao-cpap-minas.mp4
        └── poster-manutencao.webp
```

## Como publicar

1. Envie todo o conteúdo da pasta `cpap-minas-site` para a hospedagem.
2. A página principal é o arquivo `index.html`.
3. Mantenha os caminhos das pastas `css`, `js` e `assets` exatamente como estão.
4. Depois de publicar, teste todos os botões de WhatsApp e o formulário.

## Configuração do WhatsApp

O número está no arquivo:

```txt
js/config.js
```

Valor atual:

```js
whatsappNumber: "5531983818037"
```

Para trocar o número, mantenha o formato com DDI + DDD + número, sem espaços, parênteses ou traços.

## Google Ads / GTM

No `index.html`, há um comentário no `<head>` indicando onde inserir a tag do Google Tag Manager ou Google Ads.

O JavaScript já dispara eventos para facilitar o rastreamento:

- `whatsapp_click`
- `lead_form_submit`

Esses eventos também são enviados para `dataLayer`, caso o GTM esteja instalado.

## Conversões recomendadas para Google Ads

- Clique em botão de WhatsApp
- Envio do formulário, que abre mensagem pronta no WhatsApp
- Clique em telefone, se desejar configurar via GTM

## Observações importantes

- O site não faz diagnóstico médico e inclui aviso de que as informações não substituem orientação médica.
- A página de privacidade foi incluída por boas práticas, especialmente para campanhas pagas e coleta de dados de contato.
- O vídeo foi otimizado em MP4 para reduzir o peso e melhorar carregamento.
- Todos os links de WhatsApp usam a mensagem inicial padronizada: "Olá, vim do Google e...".


## Revisão desta versão
- Logo substituída pela versão escolhida pelo cliente.
- Hero simplificado com imagem única do CPAP.
- Título reduzido para deixar a primeira dobra mais objetiva.
- Animações automáticas reduzidas; mantidos apenas hovers leves.
