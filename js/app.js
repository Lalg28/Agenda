const formularioContactos = document.querySelector('#contacto'),
    listadoContactos = document.querySelector('#listado-contactos tbody'),
    inputBuscador = document.querySelector('#buscar');

eventListeners();

function eventListeners() {
    // CUANDO EL FORMULARIO DE CREAR O EDITAR SE EJECUTA
    formularioContactos.addEventListener('submit', leerFormulario);

    // Listener para eliminar el boton
    if (listadoContactos) {
        listadoContactos.addEventListener('click', eliminarContacto);
    }

    inputBuscador.addEventListener('input', buscarContactos);

    numeroContactos();
}

function leerFormulario(e) {
    e.preventDefault();

    //Leer los datos de los inputs
    const nombre = document.querySelector('#nombre').value,
        empresa = document.querySelector('#empresa').value,
        telefono = document.querySelector('#telefono').value,
        accion = document.querySelector('#accion').value;


    if (nombre === '' || empresa === '' || telefono === '') {
        //2 parametros: texto y clase
        mostrarNotificacion('Todos los campos son Obligatorios', 'error');
    } else {
        // Pasa la validacion, crear llamado a Ajax
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre); //PARAMETROS: Llave - Valor
        infoContacto.append('empresa', empresa); //PARAMETROS: Llave - Valor
        infoContacto.append('telefono', telefono); //PARAMETROS: Llave - Valor
        infoContacto.append('accion', accion); //PARAMETROS: Llave - Valor


        if (accion === 'crear') {
            //crearemos un nuevo contacto
            insertarBD(infoContacto);
        } else {
            //editar el contacto
            //leer el id
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto);
        }
    }
}

//Insertar en la base de datos via Ajax
function insertarBD(datos) {
    //llamado a ajax

    //crear objeto
    const xhr = new XMLHttpRequest();

    //abrir conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    //pasar lo datos
    xhr.onload = function() {
        if (this.status == 200) {
            //leemos la respuesta de PHP
            const respuesta = JSON.parse(xhr.responseText); //Lo convierte a un objeto

            // Inserta un nuevo elemento a la tabla
            const nuevoContacto = document.createElement('tr');

            nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
            `;

            //Contenedor para los botones
            const contenedorAcciones = document.createElement('td');

            //crear el icono de editar
            const iconoEditar = document.createElement('i');
            iconoEditar.classList.add('far', 'fa-edit');

            //crea el enlace para editar
            const btnEditar = document.createElement('a');
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add('btn', 'btn-editar');

            //Agregarlo al padre
            contenedorAcciones.appendChild(btnEditar);

            //Crear icono de eliminar
            const iconoEliminar = document.createElement('i');
            iconoEliminar.classList.add('far', 'fa-trash-alt');

            //crear el boton de eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
            btnEliminar.classList.add('btn', 'btn-borrar');

            //agregar al padre
            contenedorAcciones.appendChild(btnEliminar);

            // Agregarlo al tr
            nuevoContacto.appendChild(contenedorAcciones);

            //Agregarlo con los contactos
            listadoContactos.appendChild(nuevoContacto);

            //Resetear el formulario
            document.querySelector('form').reset();


            //Mostrar notificacion
            mostrarNotificacion('Contacto creado correctamente', 'correcto');

            //Actualizar numero
            numeroContactos();
        }
    }

    // enviar los datos
    xhr.send(datos);
}

function actualizarRegistro(datos) {
    console.log(...datos);
    // crear objeto
    const xhr = new XMLHttpRequest();

    //abrir conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);

    //leeer respuesta
    xhr.onload = function() {
        if (this.status === 200) {
            const respuesta = JSON.parse(xhr.responseText);

            if (respuesta.respuesta === 'correcto') {
                //mostrar notificacion de correcto
                mostrarNotificacion('Contacto editado con exito', 'correcto');
            } else {
                //Hubo un error
                mostrarNotificacion('Hubo un error...', 'error');
            }
            ///Despues de 3 segundos reedireccionar
            setTimeout(() => {
                window.location.href = 'index.php';
            }, 3000);
        }
    }

    //enviar peticion
    xhr.send(datos);
}

//Eliminar contacto
function eliminarContacto(e) {
    if (e.target.parentElement.classList.contains('btn-borrar')) {
        //Tomar ID
        const id = e.target.parentElement.getAttribute('data-id');

        //Preguntar si esta seguro
        const respuesta = confirm('Esta seguro? ');

        if (respuesta) {
            //llamado a ajax
            // crear objeto
            const xhr = new XMLHttpRequest();
            //abrir conexion
            xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);
            //leer la respuesta
            xhr.onload = function() {
                    if (this.status === 200) {
                        const resultado = JSON.parse(xhr.responseText);

                        console.log(resultado);

                        if (resultado.respuesta === 'correcto') {
                            //eliminar registro del dom
                            e.target.parentElement.parentElement.parentElement.remove();

                            // mostrar notifiacion
                            mostrarNotificacion('Contacto eliminado', 'correcto');
                            numeroContactos();
                        } else {
                            //Mostrar notifiacion
                            mostrarNotificacion('Hubo un error', 'error');
                        }
                    }
                }
                //enviar la aplicacion
            xhr.send();
        }

    }
}

//Notificacion en pantalla
function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement('div'); // Se crea el div
    notificacion.classList.add(clase, 'notificacion', 'sombra'); // Se le agrega la clase
    notificacion.textContent = mensaje; // Se le agrega contenido

    //formulario
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    //ocultar y mostrar la notifiacion
    setTimeout(() => {
        notificacion.classList.add('visible'); //Se agrega la clase 'visible' al div

        setTimeout(() => {
            notificacion.classList.remove('visible');

            setTimeout(() => {
                notificacion.remove(); //Se borra el div
            }, 500);

        }, 3000);
    }, 100);
}

//Buscador de registros
function buscarContactos(e) {
    const expresion = new RegExp(e.target.value, "i"),
        registros = document.querySelectorAll('tbody tr');

    registros.forEach(registro => {
        registro.style.display = 'none';

        if (registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1) {
            registro.style.display = 'table-row';
        }
        numeroContactos();
    })
}

//Muestra el numero de contactos
function numeroContactos() {
    const totalContactos = document.querySelectorAll('tbody tr'),
        contenedorNumero = document.querySelector('.total-contactos span');

    let total = 0;

    totalContactos.forEach(contacto => {
        if (contacto.style.display === '' || contacto.style.display === 'table-row') {
            total++;
        }
    });

    contenedorNumero.textContent = total;
}