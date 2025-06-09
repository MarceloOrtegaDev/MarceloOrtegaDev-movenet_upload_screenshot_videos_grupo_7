# Detección de Poses con MoveNet

Este proyecto implementa un sistema de detección de poses humanas utilizando el modelo **MoveNet (Lightning)** de TensorFlow.js. Permite cargar un video desde el dispositivo del usuario, procesarlo fotograma a fotograma y mostrar los puntos clave del cuerpo humano sobre un lienzo (`canvas`), utilizando técnicas de inteligencia artificial en el navegador.
### Se inicializó el proyecto con vite como una primera intención de poder subir el build del proyecto a vercel lo cual no pudimos concretar aún.

## 🧠 Tecnologías utilizadas

- HTML5 y JavaScript moderno (ES Modules)
- TensorFlow.js
- @tensorflow-models/pose-detection (MoveNet)
- Canvas para renderizado

## 📂 Estructura del proyecto
📁 Raiz/
└── index.html # HTML principal con input de video y canvas

📁 src/

├── index.js # Lógica principal de detección y control

├── camera.js # Clase para manejar canvas, video y dibujo de resultados

└── params.js # Configuración del modelo y constantes

📄 package.json # Dependencias y scripts del proyecto


## 🚀 Instalación y uso local

1. Cloná el repositorio:

```bash
git clone https://github.com/MarceloOrtegaDev/movenet_upload_screenshot_videos_grupo_7.git
```
2. Dirígete a la carpeta donde se encuentra el modelo
```bash
cd movenet-practico
```
3. Instala las dependencias
```bash
npm install
```
4. Corre el proyecto
```bash
npm run dev
```
Abrí tu navegador en http://localhost:5173 y cargá un video para detectar poses.

### 🎯 Funcionalidades
1. Carga de video desde el dispositivo

2. Procesamiento frame por frame en tiempo real

3. Dibujo de puntos clave y esqueleto en canvas

4. Colores diferenciados para lado izquierdo, derecho y centro del cuerpo

5. Screenshot de frame que deseas


### 🎓 Créditos
* Desarrollado como parte de un práctico para la asignatura de seminario de actualización por los alumnos.
- Lucianno Roa Alexander
- Emilio Ortiz Malich
- Marcelo David Ortega

* Utiliza TensorFlow.js y el modelo MoveNet.

