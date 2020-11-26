/*function startValidation(form = '') {
    form = (form != '') ? '#'+form+' ' : '';
    $(form+'.input-form').each(function() {
        var validate = $(this).attr('validate');
        if (validate) {
            validate = validate.split("|");
            if (validate[0] == 'required') {
                $(form+'#required-'+this.id+'-span').css('display','');
                if (validate[1]) {
                    var funct = validate[1].split(":");
                    this.onkeypress = function(event) { return self[funct[0]](event); }
                }
            }
            else {
                var funct = validate[0].split(":");
                this.onkeypress = function(event) { return self[funct[0]](event); }
            }
        }
    });
}*/

function startValidation(form = '') {
    let a = form;
    form = (form != '') ? '#'+form+' ' : '';
    /*for (i in rules) {
        $(form+'#'+i).attr('validate', rules[i]);
        let validate = rules[i].split("|");
        for (j in validate) {
            if (validate[j] == 'required') {
                $(form+'#required-'+i+'-span').css('display','');
            }
            else if (validate[j] == 'unique') {
                $(form+'#'+i).attr('checkIfExist','');
            }
            else {
                let funct = validate[j].split(':');
                $(form+'#'+i)[0].onkeypress = function(event) { return self[funct[0]](event); }
            }
        }
    }*/
}

startValidation();

/*function submitValidate(idForm = '')
{
    idForm = (idForm != '') ? '#'+idForm+' ' : '';
    let cont = 0;
    $(idForm+'.input-form').each(function() {
        var validate = $(this).attr('validate');
        if (validate) {
            validate = validate.split("|");
            if (validate[0] == 'required' && $(this).val() == '') {
                cont ++;
                $(this).addClass("is-invalid");
            }
        }
    });
    return cont;
}*/

function submitValidate(form = '')
{
    idForm = (form != '') ? '#'+form+' ' : '';
    let errors = 0;
    /*$(idForm+'.input-form').each(function() {
        console.log('asdf');
        let validate = $(this).attr('validate');
        if (validate) {
            console.log('2');
            validate = validate.split("|");
            for (i in validate) {
                if (validate[i] == 'required') {
                    console.log('3');
                    if ($(this).val() == '') {
                        console.log('4');
                        $(this).addClass("is-invalid");
                        errors ++;
                    }
                }
                else if (validate[i] == 'unique' && $(this).val() != '') {
                    let obj = new FormConfig(form);
                    let a = obj.verifyIfExist(this.id, this.value);
                    console.log(a);
                }
                else if (validate[i] != 'unique') {
                    let funct = validate[i].split(':');
                    errors += self[funct[0]]($(this).val(), true);
                }
            }
        }
    });*/
    return errors;
}

function int(val)
{//Solo numeros
	var out = '';
    var filtro = '1234567890';
	//Recorrer el texto y verificar si el caracter se encuentra en la lista de validos 
    for (var i = 0; i < val.length; i ++)
        if (filtro.indexOf(val.charAt(i)) != -1)
		   //Se añaden a la salida los caracteres validos
		   out += val.charAt(i);
	//Retornar valor filtrado
    return out;
}

var lae = function(e, submit = false) {
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    caracter = "áéíóúabcdefghijklmnñopqrstuvwxyz ";
    if (submit) {
        if (caracter.indexOf(tecla) == -1) {
            return 1;
        }
        else {
            return 0;
        }
    }
    else if(caracter.indexOf(tecla) == -1) {
        return !1;
    }
};

var lae2 = function(e,input) {
    key = e.keyCode || e.which;
    console.log(key);
    tecla = String.fromCharCode(key).toLowerCase();
    caracter = "áéíóúabcdefghijklmnñopqrstuvwxyz ";
    //especiales = [8,35,36,37,39,9];
    //tecla_especial = !1;    
    /*for (var i in especiales) {
        if (key == especiales[i]) {
            tecla_especial = true;
            break;
        }
    }*/
    /*si no pulse una tecla valida, y la tecla_especial no se pulso*/
    if(caracter.indexOf(tecla) == -1) {
        return!1;
    }
};

var l = function(e,input) { // Sólo letras
    key = e.keyCode || e.which;
    tecla = String.fromCharCode(key).toLowerCase();
    caracter = "abcdefghijklmnñopqrstuvwxyz";
    especiales = [8,35,36,37,46,39,9];
    tecla_especial = !1;    
    for(var i in especiales) {
        if(key == especiales[i]) {
            if(charKey==0){
                tecla_especial = true;
                break;    
            }
        }
    }
    /*si no pulse una tecla valida, y la tecla_especial no se pulso*/
    if(caracter.indexOf(tecla) == -1 && !tecla_especial) {
        return!1;
    }
};

function laenc(string) //Letras, acentos y espacios.
{
	var out = '';
    var filtro = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóúÁÉÍÓÚ ';
    for (var i = 0; i< string.length; i ++)
       if (filtro.indexOf(string.charAt(i)) != -1) 
		   out += string.charAt(i);
    return out;
}

function textarea(string) //Letras, acentos y espacios.
{
	var out = '';
    var filtro = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZáéíóúÁÉÍÓÚ,.;:-_!¡¿?()%$# ';
    for (var i = 0; i< string.length; i ++)
       if (filtro.indexOf(string.charAt(i)) != -1) 
		   out += string.charAt(i);
    return out;
}

function NumText(string){//solo letras y numeros
	var out = '';
	//Se añaden las letras validas
    var filtro = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890';//Caracteres validos
	
    for (var i=0; i<string.length; i++)
       if (filtro.indexOf(string.charAt(i)) != -1) 
		   out += string.charAt(i);
    return out;
}

function NumText(string){//solo letras y numeros
	var out = '';
	//Se añaden las letras validas
    var filtro = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890';//Caracteres validos
	
    for (var i=0; i<string.length; i++)
       if (filtro.indexOf(string.charAt(i)) != -1) 
		   out += string.charAt(i);
    return out;
}

//19 con 17 y 18