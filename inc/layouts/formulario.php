<div class="campos"> <!-- Todos los campos -->
            <div class="campo">
                <label for="nombre">Nombre: </label> <!-- Campo individual -->
                <input 
                    type="text" 
                    placeholder="Nombre Contacto" 
                    id="nombre"
                    value="<?php echo ($contacto['nombre']) ? $contacto['nombre'] : ''; ?>">
            </div>
            <div class="campo">
                <label for="empresa">Empresa: </label> <!-- Campo individual -->
                <input type="text" placeholder="Nombre Empresa" id="empresa" value="<?php echo ($contacto['empresa']) ? $contacto['empresa'] : ''; ?>">
            </div>
            <div class="campo">
                <label for="telefono">Telefono: </label> <!-- Campo individual -->
                <input type="tel" placeholder="Numero de telefono" id="telefono" value="<?php echo ($contacto['telefono']) ? $contacto['telefono'] : ''; ?>">
            </div>
        </div>
        <div class="campo enviar">
                <?php 
                    $textoBtn = ($contacto['telefono']) ? 'Editar' : 'Guardar';

                    $accion = ($contacto['telefono']) ? 'editar' : 'crear';
                ?>
                <input type="hidden" id="accion" value="<?php echo $accion; ?>">
                <?php if(isset($contacto['id_contacto'])) { ?>
                    <input type="hidden" id="id" value="<?php echo $contacto['id_contacto']; ?>">
                <?php } ?>
                <input type="submit" value="<?php echo $textoBtn; ?>">
        </div>
