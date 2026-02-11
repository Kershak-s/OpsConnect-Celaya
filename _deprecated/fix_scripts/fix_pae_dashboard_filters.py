#!/usr/bin/env python3
"""
Agrega campos de fecha personalizada al dashboard PAE
"""

# Leer archivo
with open('templates/pae/dashboard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Backup
with open('templates/pae/dashboard.html.backup_filters', 'w', encoding='utf-8') as f:
    f.write(content)
print("✅ Backup creado: templates/pae/dashboard.html.backup_filters")

# 1. Actualizar el select de periodo para incluir "Personalizado"
old_periodo = """                            <label class="form-label" for="filter-periodo">Periodo</label>
                            <select class="form-select" id="filter-periodo">
                                <option value="turno" selected>Turno Actual</option>
                                <option value="hoy">Hoy</option>
                                <option value="ayer">Ayer</option>
                                <option value="semana">Última Semana</option>
                            </select>"""

new_periodo = """                            <label class="form-label" for="filter-periodo">Periodo</label>
                            <select class="form-select" id="filter-periodo">
                                <option value="turno" selected>Turno Actual</option>
                                <option value="hoy">Hoy</option>
                                <option value="ayer">Ayer</option>
                                <option value="semana">Última Semana</option>
                                <option value="personalizado">Personalizado</option>
                            </select>"""

if old_periodo in content:
    content = content.replace(old_periodo, new_periodo)
    print("✅ Opción 'Personalizado' agregada al select de periodo")
else:
    print("⚠️  No se encontró el select de periodo")

# 2. Agregar campos de fecha personalizada después del select de producto
old_producto_section = """                        <div class="col-md-3">
                            <label class="form-label" for="filter-producto">Producto</label>
                            <select class="form-select" id="filter-producto">
                                <option value="all">Todos</option>
                            </select>
                        </div>
                    </div>"""

new_producto_section = """                        <div class="col-md-3">
                            <label class="form-label" for="filter-producto">Producto</label>
                            <select class="form-select" id="filter-producto">
                                <option value="all">Todos</option>
                            </select>
                        </div>
                    </div>
                    <!-- Campos de fecha personalizada (ocultos por defecto) -->
                    <div class="row g-3 mt-2" id="date-range-container" style="display: none;">
                        <div class="col-md-6">
                            <label class="form-label" for="filter-fecha-inicio">Fecha Inicio</label>
                            <input type="date" class="form-control" id="filter-fecha-inicio">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label" for="filter-fecha-fin">Fecha Fin</label>
                            <input type="date" class="form-control" id="filter-fecha-fin">
                        </div>
                    </div>"""

if old_producto_section in content:
    content = content.replace(old_producto_section, new_producto_section)
    print("✅ Campos de fecha personalizada agregados")
else:
    print("⚠️  No se encontró la sección de producto")

# Guardar cambios
with open('templates/pae/dashboard.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Dashboard actualizado con campos de fecha personalizada")
print("📁 Backup guardado en: templates/pae/dashboard.html.backup_filters")
