# Autenticacion
- Documentar y estudiar mejor las diferencias entre JWT Tokens, Refresh tokens, coockies, LocalStorage, HTTPOnly, Sessions, y ver que conviene para SSR o Front
- Separar mejor la logica referente a session y JWT

# Login
- Mejorar el proyecto de sign in y sign up de usuarios actualmente no hay registro

 # UI backoffice
- mejorar ui del dashboard
- hamburguer y aside por encima del header
- modificar el header de brands que en realidad es solo un button y el titlew


# Arquitectura
- cambiara la url al hacer el fetch a las marcas 
- Con respecto al punto anterior aqui se rompe la arquitectura REST ya que no se cambia la URL y se convierte en un SPA

# Marcas
- Al eliminar una marca deberia mediante Logica de negocio restringir el borrado si esa marca tiene productows asignados.

# Productos
- Crear filtro en el router para traer los productos de ciertas paginas (filtering) o mas bien revisar funcionamient

- tipo de producto (jabon, detergente)
- dropdown con el listado de las marcas disponibles (al ir escribiendo se deberia acotar la lista hasta encontrar la marca que estamos buscando.) Es decir debemos hacer un get Brands.
- Linea: 
- Descripcion
- Precio
- Esta Activo?
- Selector de imagenes. Se pueden meter hasta 4 imagenes, se puede elegir cual es la principal. Sera la que va en la posicion 0 del array. En la base de datos se guarda un string con la direccion a las imagenes que se cargaron.
- Si el backend responde con un error se debe disparar un swal fire de error.

# Usuarios y tickets 
- Se necesitara crear el sistema de registro de usuarios con el guardado de su informacion para gestionar domicilio que el cliente mismo lo pueda modificar
- ticket debera ser modificado para poder poner cliente id sin nulls
Reuitilizar y desacoplar codigo, separar responsabilidades.