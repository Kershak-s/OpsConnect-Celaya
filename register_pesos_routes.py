from flask import Flask, redirect, url_for
from datetime import datetime
from pesos_routes_updated import pesos_list, pesos_create, pesos_edit, pesos_delete

def register_pesos_routes(app):
    """
    Registra todas las rutas relacionadas con el módulo de control de pesos
    """
    
    # Ruta principal para listar los registros
    @app.route('/pesos/<category>')
    def pesos_list_route(category):
        # Inyectar la fecha actual para los templates
        return pesos_list(category)
    
    # Ruta para listar con el registro activo (usado para redirecciones)
    @app.route('/pesos/<category>/register')
    def pesos_list_route_register(category):
        # Inyectar la fecha actual para los templates
        return pesos_list(category)
    
    # Ruta para crear un nuevo registro
    @app.route('/pesos/<category>/create', methods=['POST'])
    def pesos_create_route(category):
        return pesos_create(category)
    
    # Ruta para editar un registro existente
    @app.route('/pesos/<category>/edit/<int:registro_id>', methods=['POST'])
    def pesos_edit_route(category, registro_id):
        return pesos_edit(category, registro_id)
    
    # Ruta para eliminar un registro
    @app.route('/pesos/<category>/delete/<int:registro_id>', methods=['POST'])
    def pesos_delete_route(category, registro_id):
        return pesos_delete(category, registro_id)
