<html>
    <head>
        <link href="../../Public/plugins/bootstrap-4.0.0/bootstrap-4.0.0.min.css" rel="stylesheet" id="bootstrap-css">
        <link href="../../Public/css/styles_login.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="../../Public/lib/css/font-awesome.min.css">
        <!------ Include the above in your HEAD tag ---------->
    </head>
    <body>
        <section class="login-block">
            <div class="container">
                <div class="row">
                    <div class="col-md-4 login-sec">
                        <h2 class="text-center">Inicio de Sesión</h2>
                        <form id="login-form" class="login-form">
                            <div class="form-group">
                                <label for="email" class="text-uppercase">Usuario</label>
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" name="email" id="email">
                                    <div class="input-group-append">
                                        <span class="input-group-text"><i class="fa fa-user"></i></span>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="password" class="text-uppercase">Contraseña</label>
                                <div class="input-group mb-3">
                                    <input type="password" class="form-control" name="password" id="password">
                                    <div class="input-group-append">
                                        <span class="input-group-text"><i class="fa fa-unlock"></i></span>
                                    </div>
                                </div>
                            </div>
                            <span id="error-span" style="color:red; font-weight:bold" class="d-none">Ingrese los datos de acceso</span>
                            <div class="form-check">
                                <button type="submit" class="btn btn-login float-right" id="login-btn">Submit</button>
                            </div>
                        </form>
                        <div class="copy-text">Personal System</div>
                    </div>
                    <div class="col-md-8 banner-sec">
                        <div class="banner-text">
                            <h2>This is Heaven</h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </body>
    <script src="../../Public/lib/js/jquery.min.js"></script>
    <script src="../../Public/plugins/bootstrap-4.0.0/bootstrap-4.0.0.min.js"></script>
    <link href="../../Public/plugins/sweetalert/sweetalert.css" rel="stylesheet">
    <script src="../../Public/plugins/sweetalert/sweetalert.js"></script>
    <script src="login-js.js"></script>
</html>