class ShaderProgram{constructor(e,t={}){t=Object.assign({antialias:!1,depthTest:!1,mousemove:!1,autosize:!0,msaa:0,vertex:`
          precision highp float;
  
          attribute vec4 a_position;
          attribute vec4 a_color;
  
          uniform float u_time;
          uniform vec2 u_resolution;
          uniform vec2 u_mousemove;
          uniform mat4 u_projection;
  
          varying vec4 v_color;
  
          void main() {
  
            gl_Position = u_projection * a_position;
            gl_PointSize = (10.0 / gl_Position.w) * 100.0;
  
            v_color = a_color;
  
          }`,fragment:`
          precision highp float;
  
          uniform sampler2D u_texture;
          uniform int u_hasTexture;
  
          varying vec4 v_color;
  
          void main() {
  
            if ( u_hasTexture == 1 ) {
  
              gl_FragColor = v_color * texture2D(u_texture, gl_PointCoord);
  
            } else {
  
              gl_FragColor = v_color;
  
            }
  
          }`,uniforms:{},buffers:{},camera:{},texture:null,onUpdate(){},onResize(){}},t);let i=Object.assign({time:{type:"float",value:0},hasTexture:{type:"int",value:0},resolution:{type:"vec2",value:[0,0]},mousemove:{type:"vec2",value:[0,0]},projection:{type:"mat4",value:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}},t.uniforms),a=Object.assign({position:{size:3,data:[]},color:{size:4,data:[]}},t.buffers),r=Object.assign({fov:60,near:1,far:1e4,aspect:1,z:100,perspective:!0},t.camera),s=document.createElement("canvas"),o=s.getContext("webgl",{antialias:t.antialias});if(!o)return!1;this.count=0,this.gl=o,this.canvas=s,this.camera=r,this.holder=e,this.msaa=t.msaa,this.onUpdate=t.onUpdate,this.onResize=t.onResize,this.data={},e.appendChild(s),this.createProgram(t.vertex,t.fragment),this.createBuffers(a),this.createUniforms(i),this.updateBuffers(),this.updateUniforms(),this.createTexture(t.texture),o.enable(o.BLEND),o.enable(o.CULL_FACE),o.blendFunc(o.SRC_ALPHA,o.ONE),o[t.depthTest?"enable":"disable"](o.DEPTH_TEST),t.autosize&&window.addEventListener("resize",e=>this.resize(e),!1),t.mousemove&&window.addEventListener("mousemove",e=>this.mousemove(e),!1),this.resize(),this.update=this.update.bind(this),this.time={start:performance.now(),old:performance.now()},this.update()}mousemove(e){let t=e.pageX/this.width*2-1,i=e.pageY/this.height*2-1;this.uniforms.mousemove=[t,i]}resize(e){let t=this.holder,i=this.canvas,a=this.gl,r=this.width=t.offsetWidth,s=this.height=t.offsetHeight,o=this.aspect=r/s,n=this.dpi=Math.max(this.msaa?2:1,devicePixelRatio);i.width=r*n,i.height=s*n,i.style.width=r+"px",i.style.height=s+"px",a.viewport(0,0,r*n,s*n),a.clearColor(0,0,0,0),this.uniforms.resolution=[r,s],this.uniforms.projection=this.setProjection(o),this.onResize(r,s,n)}setProjection(e){let t=this.camera;if(!t.perspective)return[2/this.width,0,0,0,0,-2/this.height,0,0,0,0,1,0,-1,1,0,1,];{t.aspect=e;let i=t.fov*(Math.PI/180),a=Math.tan(.5*Math.PI-.5*i),r=1/(t.near-t.far),s=[a/t.aspect,0,0,0,0,a,0,0,0,0,(t.near+t.far)*r,-1,0,0,t.near*t.far*r*2,0];return s[14]+=t.z,s[15]+=t.z,s}}createShader(e,t){let i=this.gl,a=i.createShader(e);if(i.shaderSource(a,t),i.compileShader(a),i.getShaderParameter(a,i.COMPILE_STATUS))return a;console.log(i.getShaderInfoLog(a)),i.deleteShader(a)}createProgram(e,t){let i=this.gl,a=this.createShader(i.VERTEX_SHADER,e),r=this.createShader(i.FRAGMENT_SHADER,t),s=i.createProgram();i.attachShader(s,a),i.attachShader(s,r),i.linkProgram(s),i.getProgramParameter(s,i.LINK_STATUS)?(i.useProgram(s),this.program=s):(console.log(i.getProgramInfoLog(s)),i.deleteProgram(s))}createUniforms(e){let t=this.gl,i=this.data.uniforms=e,a=this.uniforms={};Object.keys(i).forEach(e=>{let r=i[e];r.location=t.getUniformLocation(this.program,"u_"+e),Object.defineProperty(a,e,{set:t=>{i[e].value=t,this.setUniform(e,t)},get:()=>i[e].value})})}setUniform(e,t){let i=this.gl,a=this.data.uniforms[e];switch(a.value=t,a.type){case"int":i.uniform1i(a.location,t);break;case"float":i.uniform1f(a.location,t);break;case"vec2":i.uniform2f(a.location,...t);break;case"vec3":i.uniform3f(a.location,...t);break;case"vec4":i.uniform4f(a.location,...t);break;case"mat2":i.uniformMatrix2fv(a.location,!1,t);break;case"mat3":i.uniformMatrix3fv(a.location,!1,t);break;case"mat4":i.uniformMatrix4fv(a.location,!1,t)}}updateUniforms(){this.gl;let e=this.data.uniforms;Object.keys(e).forEach(t=>{let i=e[t];this.uniforms[t]=i.value})}createBuffers(e){this.gl;let t=this.data.buffers=e,i=this.buffers={};Object.keys(t).forEach(e=>{let a=t[e];a.buffer=this.createBuffer("a_"+e,a.size),Object.defineProperty(i,e,{set:i=>{t[e].data=i,this.setBuffer(e,i),"position"==e&&(this.count=t.position.data.length/3)},get:()=>t[e].data})})}createBuffer(e,t){let i=this.gl,a=this.program,r=i.getAttribLocation(a,e),s=i.createBuffer();return i.bindBuffer(i.ARRAY_BUFFER,s),i.enableVertexAttribArray(r),i.vertexAttribPointer(r,t,i.FLOAT,!1,0,0),s}setBuffer(e,t){let i=this.gl,a=this.data.buffers;(null!=e||i.bindBuffer(i.ARRAY_BUFFER,null))&&(i.bindBuffer(i.ARRAY_BUFFER,a[e].buffer),i.bufferData(i.ARRAY_BUFFER,new Float32Array(t),i.STATIC_DRAW))}updateBuffers(){this.gl;let e=this.buffers;Object.keys(e).forEach(t=>e[t]=buffer.data),this.setBuffer(null)}createTexture(e){let t=this.gl,i=t.createTexture();t.bindTexture(t.TEXTURE_2D,i),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,new Uint8Array([0,0,0,0])),this.texture=i,e&&(this.uniforms.hasTexture=1,this.loadTexture(e))}loadTexture(e){let t=this.gl,i=this.texture,a=new Image;a.onload=()=>{t.bindTexture(t.TEXTURE_2D,i),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)},a.src=e}update(){let e=this.gl,t=performance.now(),i=(t-this.time.start)/5e3,a=t-this.time.old;this.time.old=t,this.uniforms.time=i,this.count>0&&(e.clear(e.COLORBUFFERBIT),e.drawArrays(e.POINTS,0,this.count)),this.onUpdate(a),requestAnimationFrame(this.update)}}