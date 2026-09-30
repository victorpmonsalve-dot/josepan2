# JOSEPAN + Render + Supabase — versión raíz

Esta versión NO usa carpeta `public`.

GitHub debe mostrar directamente en la raíz:

- index.html
- admin.html
- styles.css
- admin.css
- app.js
- admin.js
- server.js
- package.json
- render.yaml
- README.md
- data/

## Render
Build Command:
`npm install`

Start Command:
`npm start`

Variables:
- ADMIN_PASSWORD
- SUPABASE_URL
- SUPABASE_SECRET_KEY

## Comprobación
Sitio:
`https://TU-SITIO.onrender.com`

Admin:
`https://TU-SITIO.onrender.com/admin.html`

Salud:
`https://TU-SITIO.onrender.com/api/health`

Esta versión evita el error:
`ENOENT ... /public/index.html`
porque sirve `index.html` directamente desde la raíz.
