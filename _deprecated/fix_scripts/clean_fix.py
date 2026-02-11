# Removedor de función problemática
import re

with open('app.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Remover la función problemática completamente
pattern = r'@app\.route\(\'/analisis_fisicoquimicos/descargar-excel\'\).*?(?=\n    @|\n    def|\nif __name__|$)'

# Si encuentra la función problemática, la elimina
if re.search(pattern, content, re.DOTALL):
    content = re.sub(pattern, '', content, flags=re.DOTALL)
    print("✅ Función problemática removida")
else:
    print("❌ No se encontró la función")

# Limpiar líneas vacías consecutivas
content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

# Asegurar que termina correctamente
if not content.strip().endswith("app.run(debug=True)"):
    if "if __name__ == '__main__':" not in content:
        content += '\n\nif __name__ == "__main__":\n    app = create_app()\n    app.run(debug=True)'

with open('app.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("🔧 Archivo limpiado. Ahora puedes ejecutar python app.py")
