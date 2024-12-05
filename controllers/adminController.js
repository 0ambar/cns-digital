const vistaTemporal = (req, res) => {
    res.render('admin/adminDashboard', {
        pagina: 'Panel de Administración',
    });
}

export { 
    vistaTemporal 
}