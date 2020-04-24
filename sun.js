const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');

// clear screen

gl.clearColor(0, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);

//Declare shader

const vertexShader = `#version 300 es
    precision mediump float;
    in vec2 position;
    in vec3 color;
    out vec3 vColor;
    void main()
    {
        gl_Position = vec4(position, 0, 1);
        vColor = color;
    }
`;

const fragmentShader = `#version 300 es
    precision mediump float;
    out vec4 fragColor;
    in vec3 vColor;
    void main()
    {
        fragColor = vec4(vColor, 1);
    }
`;

//Compile shader

const vs = gl.createShader(gl.VERTEX_SHADER);
const fs = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vs, vertexShader);
gl.shaderSource(fs, fragmentShader);
gl.compileShader(vs);
gl.compileShader(fs);

if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)){
    console.error(gl.getShaderInfoLog(vs));
}

if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS)){
    console.error(gl.getShaderInfoLog(fs));
}

const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);

if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
    console.error(gl.getProgramInfoLog(program));
}

gl.useProgram(program);

//circulo
const circleInfo = {
    radius: 0.5,
    vertices: 35,
    coords: [],
    color: []
}

for(i = 0; i < circleInfo.vertices; i++){
    const circumference = 2 * Math.PI * (i / circleInfo.vertices);
    const x = circleInfo.radius * Math.cos(circumference);
    const y = circleInfo.radius * Math.sin(circumference);
    circleInfo.coords.push(x, y);
    circleInfo.color.push(1, 1, 0);
}

//triangulos
const triangleCoords = [
    0.0, 0.85,
    -0.75, -0.4,
    0.75, -0.4,

    0.0, -0.85,
    0.75, 0.4,
    -0.75, 0.4
];

const vertexColor = [
    1.0, 0.5, 0.0,
    1.0, 0.5, 0.0,
    1.0, 0.5, 0.0,

    1.0, 0.5, 0.0,
    1.0, 0.5, 0.0,
    1.0, 0.5, 0.0,
];


const positionBufferT = gl.createBuffer();
const colorBufferT = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferT);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleCoords), gl.STATIC_DRAW);

const positionT = gl.getAttribLocation(program, 'position');

gl.enableVertexAttribArray(positionT);
gl.vertexAttribPointer(positionT, 2, gl.FLOAT, gl.FALSE, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferT);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColor), gl.STATIC_DRAW);

const colorT = gl.getAttribLocation(program, 'color');

gl.enableVertexAttribArray(colorT);
gl.vertexAttribPointer(colorT, 3, gl.FLOAT, gl.FALSE, 0, 0);

gl.drawArrays(gl.TRIANGLES, 0, 6)


const positionBufferC = gl.createBuffer();
const colorBufferC = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferC);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleInfo.coords), gl.STATIC_DRAW);
const positionC = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionC);
gl.vertexAttribPointer(positionC, 2, gl.FLOAT, gl.FALSE, 0, 0);

gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferC);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(circleInfo.color), gl.STATIC_DRAW);
const colorC = gl.getAttribLocation(program, 'color');
gl.enableVertexAttribArray(colorC);
gl.vertexAttribPointer(colorC, 3, gl.FLOAT, gl.FALSE, 0, 0);

gl.drawArrays(gl.TRIANGLE_FAN, 0, circleInfo.vertices);