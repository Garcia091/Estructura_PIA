/*Variables */
let fruta = [];
let id;
let nombre;
let imagen;

/*Etiquetas HTML */
const formulario = document.getElementById('form')
const editar = document.getElementById('Editar')
const eliminar = document.getElementById('Eliminar')

const actualizar = document.getElementById('Actualizar')
const crear = document.getElementById('Enviar')
const cerrar = document.getElementById('Cerrar')

/*Insertar Contenido*/
const items = document.getElementById('items');
const templateCard = document.getElementById('template-card').content;
const fragment = document.createDocumentFragment();

/*Funcion para reiniciar la pagina*/
document.addEventListener('DOMContentLoaded', () => {
    handleGet()
    actualizar.style.display = 'none';
    cerrar.style.display = 'none';
   
})

/*Funcion para enviar los datos del botón Enviar*/
formulario.addEventListener('submit', (e) => {
    e.preventDefault()
    Add()
})

/*Función para mostrar los datos de la base de datos*/

const handleGet = async () => {
    try {
        const respuesta = await axios.get('http://localhost:3002/')
        fruta = respuesta.data
        Card(fruta)
        console.log(fruta)
    } catch (error) {
        console.log(error)
    }
}


/*Función para insertar las nuevas tarjetas con datos */
const Card = (fruta) => {
    fruta.forEach(data => {
        const { id, nombre, img } = data
        templateCard.querySelector('span').textContent = id;
        templateCard.querySelector('.titulo').textContent = nombre;
        templateCard.querySelector('img').setAttribute('src', img);

        templateCard.getElementById('Editar').dataset.id = id
        templateCard.getElementById('Editar').dataset.name = nombre
        templateCard.getElementById('Editar').dataset.image = img

        templateCard.getElementById('Eliminar').dataset.id = id
        templateCard.getElementById('Eliminar').dataset.name = nombre

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    items.appendChild(fragment);
}

/*Función insertar datos en el servidor */
const Add = () => {
    console.log('Insertar')
    id = Number(document.getElementById('idFruta').value)
    nombre = document.getElementById('nomFruta').value
    imagen = document.getElementById('imgFruta').value

    axios.post('http://localhost:3002/create', {
        id: id,
        nombre: nombre,
        imagen: imagen,
    }).then(() => {
        Swal.fire({
            position: 'top-center',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false
        })
    })
    location.reload()
}

items.addEventListener('click',(e)=>{
    if (e.target.classList.contains('eliminar')){
        console.log(e.target.parentElement);
        handleDelete(e.target.parentElement)
    }
    else if(e.target.classList.contains('editar')){
        console.log(e.target.parentElement);
        Editar(e.target.parentElement);
    }
})

/*Función Editar */
const Editar = (data)=>{
    actualizar.style.display = 'block';
    cerrar.style.display = 'block';
    crear.style.display = 'none';

    console.log('Editar')
    const info = {
        id: data.querySelector('#Editar').dataset.id,
        nombre: data.querySelector('#Editar').dataset.name,
        img: data.querySelector('#Editar').dataset.image,
    }

    const {id,nombre,img} = info
    
    document.getElementById('idFruta').value = id
    document.getElementById('nomFruta').value = nombre
    document.getElementById('imgFruta').value = img

}


/*Función Eliminar */
const handleDelete = (data) => {
    console.log('Eliminar')

    const info = {
        id: data.querySelector('#Eliminar').dataset.id,
        nombre: data.querySelector('#Eliminar').dataset.name,
    }

    console.log('id',info)

    Swal.fire({
        title: 'Eliminar?',
        text: `Deseas eliminar la fruta ${info.nombre}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'

    }).then((result) => {
        if (result.isConfirmed) {

            axios.delete(`http://localhost:3002/delete/${info.id}`).then(() => {
                console.log('Fruta eliminada', info.nombre)
                handleGet()
            })

            Swal.fire(
                'Deleted!',
                info.nombre + ' Ha sido eleminada',
                'success'
            )
        }
        location.reload()
    })

}
