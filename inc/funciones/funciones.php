<?php

function obtenerContactos(){
    include 'db.php';
    try{
        return $conexion->query("SELECT id_contacto, nombre, empresa, telefono FROM contactos");
    }catch(Exception $e){
        echo "Error" . $e->getMessage() . "<br>";
        echo "Error";
        return false;
    }
}

// Obtenie un contacto y toma un id
function obtenerContacto($id){
    include 'db.php';
    try{
        return $conexion->query("SELECT id_contacto, nombre, empresa, telefono FROM contactos WHERE id_contacto = $id");
    }catch(Exception $e){
        echo "Error" . $e->getMessage() . "<br>";
        return false;
    }
}


?>