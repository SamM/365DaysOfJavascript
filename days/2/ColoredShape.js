///
/*/
    ColoredShape
    /// Written by: Sam Mulqueen
    (
        vertices,
        /// An array of vertices or an object of named vertices
        
        colors,     
        /// An array of colors or an object of named colors
        
        triangles,  
        /// An array of triangles, which are made of an array containing two arrays, of vertices and colors
        
        lines,      
        /// An array of lines, which are made of an array containing 2-3 arguments:
        /// an array of vertices, an array colors and optionally a weight

        points,      
        /// An array of points, which are made of an array containing 2-3 arguments:
        /// a vertex, a color and optionally a weight

        lineWidth,  /// The default line width used when drawing lines

        pointSize   /// The default point size used when drawing points
    )
/*/
/// Usage:
/*/
 - A ColoredShape is used to define a three dimensional shape made up of colored points, lines and triangles.
 - If you have `common/lightgl.js` loaded you can draw to the webGL drawing context using the `draw` method
   of a ColoredShape instance.
/*/
///

var module, define, require, ColoredShape, GL;

if(typeof define != "function"){
    define = function(definition){
        ColoredShape = definition(require);
        if(typeof module == "object") module.exports = ColoredShape;
    }
}

define(function(require){
    var ColoredShape = function(vertices, colors, triangles, lines, points, lineWidth, pointSize){
        this.vertices = [];
        this.vertexNames = {};
        this.colors = [];
        this.colorNames = {};
        this.triangles = [];
        this.lines = [];
        this.points = [];
        this.lineWidth = typeof lineWidth == "number" ? lineWidth : 2;
        this.pointSize = typeof pointSize == "number" ? pointSize : 2;
        if(typeof vertices == 'object'){
            if(Array.isArray(vertices)){
                vertices.forEach(function(vertex){
                    if(ColoredShape.isVertex(vertex)){
                        shape.vertex(vertex);
                    }
                });
            }else{
                Object.keys(vertices).forEach(function(name){
                    var vertex = vertices[name];
                    if(ColoredShape.isVertex(vertex)){
                        shape.vertex(vertex, name);
                    }
                });
            }
        }
        if(typeof colors == 'object'){
            if(Array.isArray(colors)){
                colors.forEach(function(color){
                    if(ColoredShape.isColor(color)){
                        shape.color(color);
                    }
                });
            }else{
                Object.keys(colors).forEach(function(name){
                    var color = colors[name];
                    if(ColoredShape.isColor(color)){
                        shape.color(color, name);
                    }
                });
         
            }
        }
        if(Array.isArray(triangles)){
            triangles.forEach(function(triangle){
                if(Array.isArray(triangle) && Array.isArray(triangle[0]) && Array.isArray(triangle[1])){
                    shape.triangle(triangle[0], triangle[1]);
                }
            });
        }
        if(Array.isArray(lines)){
            lines.forEach(function(line){
                if(Array.isArray(line) && Array.isArray(line[0]) && Array.isArray(line[1])){
                    shape.line(line[0], line[1], line[2]);
                }
            });
        }
        if(Array.isArray(points)){
            points.forEach(function(point){
                if(Array.isArray(point) && ColoredShape.isVertex(point[0]) && ColoredShape.isColor(point[1])){
                    shape.point(point[0], point[1], point[2]);
                }
            });
        }
    };
    ColoredShape.isVertex = function(a){
        if(Array.isArray(a)){
            for(var i=0; i<a.length; i++){
                if(typeof a[i] != 'number') return false;
            }
        }
        return false;
    };
    ColoredShape.isColor = function(a){
        if(Array.isArray(a)){
            for(var i=0; i<a.length; i++){
                if(typeof a[i] != 'number') return false;
            }
        }
        return false;
    };
    ColoredShape.prototype.hasVertex = function(x,y,z){
        if(arguments.length == 1){
            if(ColoredShape.isVertex(x)){
                z = x[2];
                y = x[1];
                x = x[0];
            }else{
                throw new Error("Unknown single argument format");
            }
        }
        x = typeof x == "number" ? x : 0;
        y = typeof y == "number" ? y : 0;
        z = typeof z == "number" ? z : 0;
        var vertex, i;
        for(i = 0; i<this.vertices.length; i++){
            vertex = this.vertices[i];
            if(vertex[0] == x && vertex[1] == y && vertex[2] == z){
                return i;
            }
        }
        return -1;
    };
    ColoredShape.prototype.hasColor = function(r,g,b){
        if(arguments.length == 1){
            if(ColoredShape.isColor(r)){
                b = r[2];
                g = r[1];
                r = r[0];
            }else{
                throw new Error("Unknown single argument format");
            }
        }
        r = typeof r == "number" ? r : 0;
        g = typeof g == "number" ? g : 0;
        b = typeof b == "number" ? b : 0;
        r = r > 1 ? r / 255 : r;
        g = g > 1 ? g / 255 : g;
        b = b > 1 ? b / 255 : b;
        var color, i;
        function round(color){
            return Math.round(color * 255);
        }
        for(i = 0; i<this.colors.length; i++){
            color = this.colors[i];
            if(round(color[0]) == round(r) && round(color[1]) == round(g) && round(color[2]) == round(b)){
                return i;
            }
        }
        return -1;
    };

    ColoredShape.prototype.hasTriangle = function(a,b,c){
        if(arguments.length == 1){
            if(Array.isArray(a) && a.length == 3){
                var invalid = false;
                for(var i=0; i<3; i++){
                    if(typeof a[i] != "number") invalid = true;
                }
                if(invalid) throw new Error("Invalid single argument format");
                c = a[2];
                b = a[1];
                a = a[0];
            }else{
                throw new Error("Unknown single argument format");
            }
        }
        if(typeof a != "number"|| typeof b != "number"||typeof c != "number") throw "All arguments must be numerical indexes";
        var triangle, i;
        for(i = 0; i<this.triangles.length; i++){
            triangle = this.triangles[i][0];
            if(triangle.indexOf(a)>-1 && triangle.indexOf(b)>-1 && triangle.indexOf(c)>-1){
                return i;
            }
        }
        return -1;
    };

    ColoredShape.prototype.hasPoint = function(point){
        var i;
        for(i = 0; i<this.points.length; i++){
            if(this.points[i][0] == p){
                return i;
            }
        }
        return -1;
    };

    ColoredShape.prototype.hasLine = function(a,b){
        if(arguments.length == 1){
            if(Array.isArray(a) && a.length == 2){
                var invalid = false;
                for(var i=0; i<2; i++){
                    if(typeof a[i] != "number") invalid = true;
                }
                if(invalid) throw new Error("Invalid single argument format");
                b = a[1];
                a = a[0];
            }else{
                throw new Error("Unknown single argument format");
            }
        }
        if(typeof a != "number"|| typeof b != "number") throw "All arguments must be numerical indexes";
        var i, line;
        for(i = 0; i<this.lines.length; i++){
            line = this.lines[i][0];
            if(line.indexOf(a)>-1 && line.indexOf(b)>-1){
                return i;
            }
        }
        return -1;
    };
    ColoredShape.prototype.vertex = function(x,y,z){
        var names = [], shape = this;

        if(Array.isArray(x)){
            if(ColoredShape.isVertex(x)){
                z = x[2];
                y = x[1];
                x = x[0];
                names = [].slice.call(arguments, 1);
            }else{
                throw new Error("Unknown single argument format");
            }
        }else if(arguments.length>3){
            names = [].slice.call(arguments, 3);
        }

        x = typeof x == "number" ? x : 0;
        y = typeof y == "number" ? y : 0;
        z = typeof z == "number" ? z : 0;

        var i = this.hasVertex(x,y,z);
        if(i==-1){
            i = this.vertices.length;
            this.vertices.push([x,y,z]);
        }
        names.forEach(function(name){
            if(typeof name == "string") shape.vertexNames[name] = i;
        });
        return i;
    };
    ColoredShape.prototype.color = function(r,g,b){
        var names = [], shape = this;
        if(Array.isArray(r)){
            if(ColoredShape.isColor(r)){
                b = r[2];
                g = r[1];
                r = r[0];
                names = [].slice.call(arguments, 1);
            }else{
                throw new Error("Unknown single argument format");
            }
        }else if(arguments.length>3){
            names = [].slice.call(arguments, 3);
        }
        r = typeof r == "number" ? r : 0;
        g = typeof g == "number" ? g : 0;
        b = typeof b == "number" ? b : 0;
        r = r > 1 ? r / 255 : r;
        g = g > 1 ? g / 255 : g;
        b = b > 1 ? b / 255 : b;
        var i = this.hasColor(r,g,b);
        if(i==-1){
            i = this.colors.length;
            this.colors.push([r,g,b]);
        }
        names.forEach(function(name){
            if(typeof name == "string") shape.colorNames[name] = i;
        });
        return i;
    };

    ColoredShape.prototype.triangle = function(vertices, colors){
        var shape = this;
        if(!Array.isArray(vertices)) throw new Error("first argument must be an array of three vertices");
        if(!Array.isArray(colors)) throw new Error("first argument must be an array of three colors");
        vertices = vertices.filter(function(vertex){
            if(typeof vertex == "number" && vertex >= 0 && vertex < shape.vertices.length && !!shape.vertices[vertex]){
                return true;
            }else if(Array.isArray(vertex) && ColoredShape.isVertex(vertex)){
                return true;
            }else if(typeof vertex == "string" && typeof shape.vertexNames[vertex] == 'number'){
                return true;
            }else{
                return false;
            }
        });
        if(vertices.length !== 3){
            throw new Error('Insufficient valid vertices supplied in first argument. '+vertices.length+' supplied...');
        }
        colors = colors.filter(function(color){
            if(typeof color == "number" && color >= 0 && color < shape.colors.length && !!shape.colors[color]){
                return true;
            }else if(Array.isArray(colors) && ColoredShape.isColor(color)){
                return true;
            }else if(typeof color == "string" && typeof shape.colorNames[color] == 'number'){
                return true;
            }else{
                return false;
            }
        });
        if(colors.length !== 3){
            throw new Error('Insufficient valid colors supplied in first argument');
        }
        vertices = vertices.map(function(vertex){
            if(Array.isArray(vertex)){
                return shape.vertex(vertex);
            }
            if(typeof vertex == "string"){
                return shape.vertexNames[vertex];
            }
            return vertex;
        });
        colors = colors.map(function(color){
            if(Array.isArray(color)){
                return shape.color(color);
            }
            if(typeof color == "string"){
                return shape.colorNames[color];
            }
            return color;
        });
        
        var i = this.hasTriangle(vertices[0],vertices[1],vertices[2]);

        if(i>-1){
            this.triangles[i][1] = colors;
        }else{
            i = this.triangles.length;
            var pair = [vertices, colors];
            this.triangles.push(pair);
        }
        
        return i;
    };

    ColoredShape.prototype.line = function(vertices, colors, width){
        var shape = this;
        if(!Array.isArray(vertices)) throw new Error("first argument must be an array of three vertices");
        if(!Array.isArray(colors)) throw new Error("first argument must be an array of three colors");
        if(typeof width != "number"){
            width = this.lineWidth;
        }
        vertices = vertices.filter(function(vertex){
            if(typeof vertex == "number" && vertex >= 0 && vertex < shape.vertices.length && !!shape.vertices[vertex]){
                return true;
            }else if(Array.isArray(vertex) && ColoredShape.isVertex(vertex)){
                return true;
            }else if(typeof vertex == "string" && typeof shape.vertexNames[vertex] == 'number'){
                return true;
            }else{
                return false;
            }
        });
        if(vertices.length !== 2){
            throw new Error('Insufficient valid vertices supplied in first argument');
        }
        colors = colors.filter(function(color){
            if(typeof color == "number" && color >= 0 && color < shape.colors.length && !!shape.colors[color]){
                return true;
            }else if(Array.isArray(colors) && ColoredShape.isColor(color)){
                return true;
            }else if(typeof color == "string" && typeof shape.colorNames[color] == 'number'){
                return true;
            }else{
                return false;
            }
        });
        if(colors.length !== 2){
            throw new Error('Insufficient valid colors supplied in first argument');
        }
        
        vertices = vertices.map(function(vertex){
            if(Array.isArray(vertex)){
                return shape.vertex(vertex);
            }
            if(typeof vertex == "string"){
                return shape.vertexNames[vertex];
            }
            return vertex;
        });
        colors = colors.map(function(color){
            if(Array.isArray(color)){
                return shape.color(color);
            }
            if(typeof color == "string"){
                return shape.colorNames[color];
            }
            return color;
        });
        

        var i = this.hasLine(vertices[0],vertices[1]);

        if(i>-1){
            this.lines[i][1] = colors;
        }else{
            i = this.lines.length;
            var info = [vertices, colors, width];
            this.lines.push(info);
        }
        
        return i;
    };

    ColoredShape.prototype.point = function(vertex, color, width){
        var shape = this;
        if(ColoredShape.isVertex(vertex)){
            vertex = this.vertex(vertex);
        }else if(typeof vertex == 'string'){
            vertex = this.vertexNames[vertex];
            if(typeof vertex != "number") throw new Error("invalid vertex name as first argument");
        }else if(typeof vertex == "number"){
            if(vertex < 0 || vertex >= this.vertices.length){
                throw new Error("index is out of range in first argument");
            }
        }else{
            throw new Error("first argument must be a vertex, name or index");
        }
        if(ColoredShape.isColor(color)){
            color = this.color(color);
        }else if(typeof color == 'string'){
            color = this.colorNames[color];
            if(typeof color != "number") throw new Error("invalid color name as second argument");
        }else if(typeof color == "number"){
            if(color < 0 || color >= this.colors.length){
                throw new Error("index is out of range for second argument");
            }
        }else{
            throw new Error("first argument must be a color, name or index");
        }
        if(typeof width != "number"){
            width = this.pointSize;
        }

        var i = this.hasPoint(vertex);

        if(i>-1){
            this.points[i][1] = color;
        }else{
            i = this.points.length;
            var info = [vertex, point, width];
            this.points.push(info);
        }
        
        return i;
    };

    ColoredShape.prototype.rotate = function(){

    };

    /*/
    /// Draw shape using WebGL methods

            WORK IN PROGRESS

    /*/

    function clone(v){ return v }

    ColoredShape.prototype.draw = function(gl, clear){
        if(clear){
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }
        if(!this.vertices.length) return;

        var output = {
            index: {},
            vertex: {}
        }

        var draw = [];
        this.vertices.forEach(function(vertex){
            draw = draw.concat(vertex.map(clone));
        });
        draw = new Float32Array(draw);
        

        var drawBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, drawBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

        output.vertex.gl_Vertex = drawBuffer;

        if(this.triangles.length){
            /// Draw triangles
            var triangles = [];
            var triangleColors = [];
            this.triangles.forEach(function(triangle){
                triangles = triangles.concat(triangle[0].map(clone));
                triangleColors = triangleColors.conact(triangle[1].map(clone));
            });
            triangles = new Uint16Array(triangles);
            triangleColors = new Uint16Array(triangleColors);

            var triangleBuffer = gl.createBuffer();
            triangleBuffer.length = triangles.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangles, gl.STATIC_DRAW);

            output.index.triangles = triangleBuffer;

            var triangleColorBuffer = gl.createBuffer();
            triangleColorBuffer.length = triangleColors.length;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, triangleColorBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleColors, gl.STATIC_DRAW);

            output.index.triangleColors = triangleColorBuffer;
        }
    };

    /*/
    /// Draw shape using the LightGL webgl drawing context
    /?/ Requires: lightgl.js
    /*/
    ColoredShape.prototype.drawImmediate = function(gl, clear, transform){
        if(clear){
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        }

        if(!this.vertices.length) return;

        /*/
        /// Immediate Mode
        /*/
        
        var lineWidth = this.lineWidth;
        var pointSize = this.pointSize;
        var vertices, colors, vertex, color, width;

        if(this.points.length){
            /*/
            /// Draw Points
            /*/
            gl.begin(gl.POINTS);
            for (var i = 0; i < this.points.length; i++) {
                vertex = this.points[i][0];
                color = this.points[i][1];
                color = this.colors[color];
                vertex = this.vertices[vertex];
                width = this.points[i][2];

                gl.pointSize(width);

                gl.color(color[0],color[1],color[2]);
                gl.vertex(vertex[0],vertex[1],vertex[2]);
            }
            gl.pointSize(pointSize);
            gl.end();
        }
        

        if(this.lines.length){
            /*/
            /// Draw Lines
            /*/
            var lineWidth = this.lineWidth;
            var color, vertex, width;

            gl.begin(gl.LINES);
            for (var i = 0; i < this.lines.length; i++) {
                vertices = this.lines[i][0];
                colors = this.lines[i][1];
                width = this.lines[i][2];

                gl.lineWidth(width);

                color = this.colors[colors[0]];
                gl.color(color[0],color[1],color[2]);
                vertex = this.vertices[vertices[0]];
                gl.vertex(vertex[0],vertex[1],vertex[2]);

                color = this.colors[colors[1]];
                gl.color(color[0],color[1],color[2]);
                vertex = this.vertices[vertices[1]];
                gl.vertex(vertex[0],vertex[1],vertex[2]);
            }
            gl.lineWidth(lineWidth);
            gl.end();
        }

        if(this.triangles.length){
            /*/
            /// Draw Triangles
            /*/
            gl.begin(gl.TRIANGLES);
            
            for (var i = 0; i < this.triangles.length; i++) {
                vertices = this.triangles[i][0];
                colors = this.triangles[i][1];

                color = this.colors[colors[0]];
                gl.color(color[0],color[1],color[2]);
                
                vertex = this.vertices[vertices[0]];
                gl.vertex(vertex[0],vertex[1],vertex[2]);

                color = this.colors[colors[1]];
                gl.color(color[0],color[1],color[2]); 

                vertex = this.vertices[vertices[1]];
                gl.vertex(vertex[0],vertex[1],vertex[2]);

                color = this.colors[colors[2]];
                gl.color(color[0],color[1],color[2]); 

                vertex = this.vertices[vertices[2]];
                gl.vertex(vertex[0],vertex[1],vertex[2]);
            }
            gl.end();
        }

    };

    /*/
    /// Draw shape using lightgl GL.Mesh

            WORK IN PROGRESS

    /*/

    ColoredShape.prototype.drawMesh = function(shader){
        if(typeof GL == "object" && typeof GL.Mesh == 'function'){
            var mesh = new GL.Mesh({ colors: true, triangles: this.triangles.length>0, lines: this.lines.length>0 });
            mesh.vertices = this.vertices.map(function(vertex){
                return vertex.map(function(v){return v;});
            });
            mesh.colors = this.colors.map(function(color){
                return color.map(function(v){return v;});
            });
            mesh.triangles = this.triangles.map(function(triangle){
                return triangle[0].map(function(v){return v});
            });
            
            shader.draw(mesh)
            return mesh;
        }else{
            return null;
        }
    }

    return ColoredShape;
});