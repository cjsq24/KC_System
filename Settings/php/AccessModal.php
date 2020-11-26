<?php
    $modal = true;
    if (!empty($listModal[$menu['link']])) {
        $formParent = strtolower($menu['link']);
        foreach ($listModal[$menu['link']] as $key => $list) {    
            $menu = $Access->accessCreate($list['link']);
            if ($menu != false) {
                echo '
                    <script>
                        $(document).ready(function() {
                            startValidation("'.$list['link'].'");
                        });
                    </script>
                ';
?>

                <div class="modal fade" id="<?= $list['link'] ?>-modal" data-backdrop="static">
                    <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered <?= $list['modalSize'] ?>">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title"><?= $menu['name'] ?></h4>
                                <button type="button" class="close hide-modal-form-btn" form-modal="<?= $list['link'] ?>">&times;</button>
                            </div>
                            <div class="modal-body" id="<?= $list['link'] ?>-modal-body">
                                <?php require($list['link'].'/'.$list['link'].'-form.php') ?>
                            </div>
                        </div>
                    </div>
                </div>
<?php
            }
            else {
                echo '
                    <script>
                        $(".'.$list['link'].'-form-modal-btn").addClass("d-none");
                        /*let div = $(".'.$list['link'].'-form-modal-btn").closest(".input-group");
                        $(div+" .select2").css("width", "100% !important");
                        console.log(div);*/
                    </script>';
            }
        }
    }
?>