<div class="col">
    <form id="settings-form">
        <input type="hidden" name="idSetting" id="idSetting">
        <div class="card border-dark mb-3">
            <div class="card-header"><i class="fa <?= $menu['icon'] ?>"></i> <?= $menu['name'] ?></div>
            <div class="card-body text-dark">
                <nav style="background-color:rgba(0,0,0,.03)">
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <a class="nav-item nav-link active" id="nav-setting-tab" data-toggle="tab" href="#security-tab" role="tab" aria-controls="security-tab" aria-selected="true">Seguridad</a>
                        <a class="nav-item nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-profile" role="tab" aria-controls="nav-profile" aria-selected="false">Profile</a>
                        <a class="nav-item nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">Contact</a>
                    </div>
                </nav>
                <div class="tab-content" id="nav-tabContent" style="border:1px solid #EFEFEF; background:#FCFCFC; padding:5px">
                    <div class="tab-pane fade show active" id="security-tab" role="tabpanel" aria-labelledby="security-tab-tab"><br>
                        <?php require('settingsSecurity-form.php') ?>
                    </div>
                    <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">...</div>
                    <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">...</div>
                </div>
            </div>
            <div class="card-footer">
                <div class="pull-right">
                    <button type="button" class="btn btn-success" id="send-btn">Modificar</button>
                </div>
            </div>
        </div>
    </form>
</div>
<?php require('settings/settings-js.php') ?>