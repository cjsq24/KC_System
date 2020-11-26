<?php
    $config = $General->getArr(
        "SELECT 
            minLongPass, 
            maxLongPass, 
            minNumPass, 
            minUpperPass, 
            minLowerPass, 
            minSpecialCharsPass, 
            charsAllowedPass, 
            keyExpirDatePass, 
            daysWarningExpPass, 
            userFailedAttempts 
        FROM settings
    ");
    $inpCls = 'form-control form-control-sm';
?>
    <div class="form-row">
        <div class="form-group px-2 col-lg-4 col-md-4 col-sm-6 col-xs-3">
            <label>Longitud de la Clave</label>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text form-control-sm">min</span>
                </div>
                <input type="number" class="<?= $inpCls ?>" name="minLongPass" id="minLongPass" value="<?= $config['minLongPass'] ?>">
                <div class="input-group-prepend">
                    <span class="input-group-text form-control-sm">max</span>
                </div>
                <input type="number" class="<?= $inpCls ?>" name="maxLongPass" id="maxLongPass" value="<?= $config['maxLongPass'] ?>">
            </div>
        </div>
        <div class="form-group px-2 col-lg-3 col-md-3 col-sm-3">
            <label> Números </label>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text form-control-sm">min</span>
                </div>
                <input type="number" class="<?= $inpCls ?>" name="minNumPass" id="minNumPass" value="<?= $config['minNumPass'] ?>">
            </div>
        </div>
        <div class="form-group px-2 col-lg-3 col-md-3 col-sm-3">
            <label> Mayúsculas </label>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text form-control-sm">min</span>
                </div>
                <input type="number" class="<?= $inpCls ?>" name="minUpperPass" id="minUpperPass" value="<?= $config['minUpperPass'] ?>">
            </div>
        </div>
        <div class="form-group px-2 col-lg-2 col-md-2 col-sm-6">
            <label> Minúsculas </label>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text form-control-sm">min</span>
                </div>
                <input type="number" class="<?= $inpCls ?>" name="minLowerPass" id="minLowerPass" value="<?= $config['minLowerPass'] ?>">
            </div>
        </div>
        <!--div class="form-group col-md-6">
            <label for="inputPassword4">Acepta Números</label>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="option1" checked>
                <label class="form-check-label" for="gridRadios1"> Sí </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="option2">
                <label class="form-check-label" for="gridRadios2"> No </label>
            </div>
        </div-->
    </div>

    <div class="form-row">
        <div class="form-group px-2 col-lg-4 col-md-4 col-sm-6">
            <label> C. Especiales </label>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text form-control-sm">min</span>
                </div>
                <input type="number" class="<?= $inpCls ?> col-lg-3 col-md-3" name="minSpecialCharsPass" id="minSpecialCharsPass" value="<?= $config['minSpecialCharsPass'] ?>">
                <div class="input-group-prepend">
                    <span class="input-group-text form-control-sm">caract.</span>
                </div>
                <input type="text" class="<?= $inpCls ?>" name="charsAllowedPass" id="charsAllowedPass" value="<?= $config['charsAllowedPass'] ?>">
            </div>
        </div>
        <!--div class="form-group px-2 col-lg-3 col-md-4 col-sm-6">
            <label> C. Especiales </label>
            <input type="text" class="<?= $inpCls ?>" name="charsAllowedPass" id="charsAllowedPass" value="<?= $config['charsAllowedPass'] ?>">
        </div-->
        <div class="form-group px-2 col-lg-3 col-md-4 col-sm-6">
            <label>Caducidad</label>
            <div class="input-group mb-3">
                <input type="number" class="<?= $inpCls ?>" name="keyExpirDatePass" id="keyExpirDatePass" value="<?= $config['keyExpirDatePass'] ?>">
                <div class="input-group-append">
                    <span class="input-group-text form-control-sm">Días</span>
                </div>
            </div>
        </div>
        <div class="form-group px-2 col-lg-3 col-md-4 col-sm-6">
            <label>Notif. Caducidad</label>
            <div class="input-group mb-3">
                <input type="number" class="<?= $inpCls ?>" name="daysWarningExpPass" id="daysWarningExpPass" value="<?= $config['daysWarningExpPass'] ?>">
                <div class="input-group-append">
                    <span class="input-group-text form-control-sm">Días Antes</span>
                </div>
            </div>
        </div>
        <div class="form-group px-2 col-lg-3 col-md-4 col-sm-6">
            <label>Int. Fallidos</label>
            <div class="input-group mb-3">
                <input type="number" class="<?= $inpCls ?>" name="userFailedAttempts" id="userFailedAttempts" value="<?= $config['userFailedAttempts'] ?>">
                <div class="input-group-append">
                    <span class="input-group-text form-control-sm">Días Antes</span>
                </div>
            </div>
        </div>
    </div>

<!--ARCHIVO QUE CONTIENE LAS FUNCIONES BASE DEL FORMULARIO, INCLUYENDO LA DE LOS BOTONES-->
<?php //require(RUTA_SETTINGS.'/php/footFile.php'); ?>