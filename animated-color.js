const canvas = document.getElementById('glCanvas');
const gl = canvas.getContext('webgl2');

const render = ()=>{
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

const vertexShader = `#version 300 es
    precision mediump float;
    in vec2 position;
    in vec3 color;
    out vec3 vColor;
    uniform float iTime;
    void main()
    {
        gl_Position = vec4(position, 0, 1);
        vColor = vec3(abs(sin(iTime)), color.y, color.z);
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

const triangleCoords = [
    -0.5, -0.5, 
    0.5, -0.5, 
    0.0, 0.5
];

const vertexColor = [
    0, 0, 1, 
    0, 0, 1, 
    0, 0, 1,
    0, 0, 1
];

const positionBuffer = gl.createBuffer();
const colorBuffer = gl.createBuffer();

const now = Date.now();

const update = ()=>{

    render();

    const deltaTime = Date.now() - now;

    console.log(deltaTime);


    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleCoords), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, gl.FALSE, 0, 0);

    const iTime = gl.getUniformLocation(program, 'iTime');
    gl.uniform1f(iTime, deltaTime / 1000);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColor), gl.STATIC_DRAW);
    const color = gl.getAttribLocation(program, 'color');
    gl.enableVertexAttribArray(color);
    gl.vertexAttribPointer(color, 3, gl.FLOAT, gl.FALSE, 0, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);

    requestAnimationFrame(update, 1000 / 60);
}
requestAnimationFrame(update);