# Glosario

# Conceptos
Como usar data que tenemos en el ejs:
<p>Bienvenido, <%= admin.firstName %>, <%= admin.lastName %></p>

como servir archivos adicionales (css, js) haciendo SSR
la carpeta public sera la raiz del proyecto asi que desde la view la ruta hacia nuestros archivos sera: 
    <script type="module" src="/scripts/backoffice.js"></script>

Defer script
    descarga el script en pararlelo pero ejecutalo cuando el html este listo, seguir investigando

PATH PARAMETER:
    para aidentificar la entidad a la cual voy a hacer referencia para eliminar, o actualizar.
    Tambien le dice al router que lo que viene a continuacion es una variable
QUERY PARAMS:
    el proposito es enviar strings para filtro, ordenamiento o paginar recursos