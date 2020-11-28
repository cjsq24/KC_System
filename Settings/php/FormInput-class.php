<?php
	class FormInput
	{
		public function label($id, $label, $class = "")
		{
            return '<label for="'.$id.'" class="'.$class.'"> 
                        '.$label.' <span id="required-'.$id.'-span" style="color:red; font-weight:bold; display:none"> * </span> 
                    </label>';
		}
		public function input($input, $tipo = "")
		{
			$tipo = ($tipo == "search") ? "input-search" : "input-form";
			$input = $this -> setDataInput ($input);
			return '
				<input type="'.$input["type"].'" name="'.$input["name-id"].'" id="'.$input["name-id"].'" class="form-control form-control-sm '.$tipo .' '.$input["class"].'" '.$input["attr"].' '.$input["popover"].' />
				<div id="' . $input["name-id"] . '-valid" class="invalid-feedback"> </div>
			';
        }
        
        public function text($input, $tipo = "")
		{
			$tipo = ($tipo == "search") ? "input-search" : "input-form";
			$input = $this->setDataInput($input);
			return '
                <input type="text" name="' . $input["name-id"] . '" id="' . $input["name-id"] . '" class="form-control form-control-sm ' . $tipo . ' ' . $input["class"] . '" ' . $input["attr"] .'" ' . $input["popover"] . ' />
                <!--div id="' . $input["name-id"] . '-valid" class="invalid-tooltip"></div-->
                <!--div id="' . $input["name-id"] . '-valid" class="invalid-feedback"> </div-->
                ' . $this->invalidTooltip($input["name-id"]);
		}

		/*public function text($input, $tipo = "")
		{
			$tipo = ($tipo == "search") ? "input-search" : "input-form";
			$input = $this->setDataInput($input);
			return '
                <input type="text" name="' . $input["name-id"] . '" id="' . $input["name-id"] . '" class="form-control form-control-sm ' . $tipo . ' ' . $input["class"] . '" ' . $input["attr"] .' required="'. $input["required"] .'" ' . $input["popover"] . ' />
                <!--div id="' . $input["name-id"] . '-valid" class="invalid-tooltip"></div-->
                <!--div id="' . $input["name-id"] . '-valid" class="invalid-feedback"> </div-->
                ' . $this->invalidTooltip($input["name-id"]);
		}*/

		public function textarea ($input)
		{
			$input = $this -> setDataInput ($input);
            return '<textarea name="' . $input["name-id"] . '" id="' . $input["name-id"] . '" class="form-control form-control-sm ' . $input["class"] . ' input-form" ' . $input["attr"] .' required="'. $input["required"] .'" ' . $input["popover"] . ' /></textarea>
                ' . $this->invalidTooltip($input["name-id"]);
				/*<!--div id="' . $input["name-id"] . '-valid" class="invalid-tooltip"></div-->
				<div id="' . $input["name-id"] . '-valid" class="invalid-feedback"></div>*/
		}

		public function select($input, $option = '', $tipo = "")
		{
            $st = 0;
			$class = ($tipo == "search") ? "input-search" : "input-form";
            $input = $this->setDataInput($input);
            if ($tipo == 'search') {
                $options = '<option value="">-</option>';
                unset($option['']);
            }
            else {
                if (!empty($option) && $option != '') {
                    $tag    = array_keys($option);
                    $value  = array_values($option);
                    if ($tag[0] != '') {
                        $options = '<option value="">SELECCIONE</option>';
                    }
                    else {
                        $options = '<option value="'.$tag[0].'">'.$value[0].'</option>';
                        $st = 1;
                    }
                }
                else {
                    $options = '<option value="">SELECCIONE</option>';
                }
            }
			//$options = ($tipo == "search") ? '<option value="" selected> TODOS </option>' : '';
			if (!empty($option))
			{
				$tag = array_keys ($option);
				$value = array_values ($option);
				for ($i = $st; $i < count ($tag); $i ++) {
                    $selected = (isset($input['selected']) && $tag[$i] == $input['selected']) ? 'selected' : '';
					$options .= '<option value="' . $tag[$i] . '" '.$selected.'>' . $value[$i] . '</option>';
				}
			}
			return '
				<select name="' . $input["name-id"] . '" id="' . $input["name-id"] . '" class="form-control form-control-sm ' . $class . ' ' . $input["class"] . '" ' . $input["attr"] .' required="'. $input["required"] .'" ' . $input["popover"] . ' style="width:100%;'.$input['style'].'" />
				' . $options . '
                </select>
                ' . $this->invalidTooltip($input["name-id"])
			;
		}

		public function setDataInput ($input)
		{
			if (!isset ($input["class"]))         { $input["class"]         = "";      }
            if (!isset ($input["attr"]))          { $input["attr"]          = "";      }
            if (!isset ($input["style"]))          { $input["style"]          = "";      }
			if (!isset ($input["required"]))     { $input["required"]     = "false"; }
			if (!isset ($input["popover-direc"])) { $input["popover-direc"] = "right"; }

			$input["popover"] = (isset ($input["popover-msj"])) ? 'data-container="body" data-toggle="popover" data-trigger="hover" data-placement="' . $input["popover-direc"] . '" data-content="' . $input["popover-msj"] . '"' : '';

			$input["required-span"] = ($input["required"] == "true") ? '<span class="text-obligatorio"> * </span>' : '';
			return $input;
		}

		public function require_lab ()
		{
			return '<span class="text-obligatorio"> * </span>';
        }
        
        public function invalidTooltip($id)
        {
            return '<div id="' . $id . '-valid" class="invalid-tooltip" style="margin-top:-6px"></div>';
        }

        public function addBtnSelect($idForm, $idInput, $modalSize = 'modal-lg') {
            global $menu, $listModal;
            $cont = count($listModal);
            $listModal[$menu['link']][$cont]['link'] = $idForm;
            $listModal[$menu['link']][$cont]['modalSize'] = $modalSize;
            return '
                <div class="input-group-append" style="width:10%" id="append">
                    <button type="button" idform="'.$idForm.'" idinput="'.$idInput.'" class="btn btn-sm btn-outline-secondary show-modal-form-btn '.$idForm.'-modal-btn" style="width:100%">
                        <i class="fa fa-plus"></i>
                    </button>
                </div>
            ';
        }

        public function addBtnSearch() {
            return '
                <div class="input-group-append" style="width:10%">
                    <button type="button" id="show-icons-btn" class="btn btn-outline-secondary btn-sm" style="width:100%">
                        <span class="fa fa-search"></span>
                    </button>
                </div>
            ';
        }
	}
?>