window.onload = function() {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');
    
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    // Set rectangle default color black
    let color = [0.0, 0.0, 0.0, 1.0];
    
    // Vertex shader program
    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;
    
    // Fragment shader program
    const fsSource = `
        precision mediump float;
            uniform vec4 uColor;
            void main(void) {
                gl_FragColor = uColor;
            }
    `;
    
    // Compile shader
    function compileShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    
    // Initialize shaders
    const vertexShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
    
    // Create shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    gl.useProgram(shaderProgram);
    
    // Create an array of positions for the rectangle.
    const positions = [
        -0.5,  0.5, 
         0.5,  0.5, 
        -0.5, -0.5, 
         0.5, -0.5  
    ];
    
    // Create a buffer for the rectangle's vertices
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    // Bind the vertex buffer to the shader
    const position = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(position);
    
    // Get the uniform location for color
    const colorUniformLocation = gl.getUniformLocation(shaderProgram, 'uColor');
    
    // Function to draw the rectangle
    function drawRectangle() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform4fv(colorUniformLocation, color);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    
    // Set clear color and draw the initial rectangle
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // White background
    drawRectangle();

    // Change rectangle color
    document.getElementById('red').addEventListener('click', function() {
        color = [1.0, 0.0, 0.0, 1.0];
        drawRectangle();
    });

    document.getElementById('green').addEventListener('click', function() {
        color = [0.0, 1.0, 0.0, 1.0]; 
        drawRectangle();
    });

    document.getElementById('blue').addEventListener('click', function() {
        color = [0.0, 0.0, 1.0, 1.0]; 
        drawRectangle();
    });

    document.getElementById('reset').addEventListener('click', function() {
        color = [0.0, 0.0, 0.0, 1.0];  
        drawRectangle();
    });
}


