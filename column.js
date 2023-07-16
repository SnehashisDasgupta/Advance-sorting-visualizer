class Column{
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.queue = [];
        this.color = {r: 150, g: 150, b: 150}
    }

    /*  loc: The target location or position where the object should move.
        framecount: The number of frames or steps it should take to reach the target location. 
        t: This t value represents the fraction of the movement completed.*/
    moveTo(loc, yOffset = 1, frameCount = 20){
        //yOffset is used to pop-up the 2nd cylinder which is used in swapping with the primary cylinder
        for(let i=1; i<=frameCount; i++){
            const t = i/frameCount;
            //it pop-up the cylinder which is being swapped
            const u = Math.sin(t * Math.PI);
            this.queue.push({
                x: lerp(this.x, loc.x, t),
                y: lerp(this.y, loc.y, t) + u * this.width/2 * yOffset,
                r: lerp(150, 255, u), //when moving ,colour increase in redness
                g: lerp(150, 0, u), //colour decrease in green-ness
                b: lerp(150, 0, u), //colour decrease in blue-ness
            });
        }
    }

    // the cylinder will bounce/jump when placed at correct place
    jumps(frameCount = 20){
        for(let i=1; i<=frameCount; i++){
            const t = i/frameCount;
            const u = Math.sin(t * Math.PI);
            this.queue.push({
                x: this.x, 
                y: this.y - u*this.width,
                // coloured the cylinder 'green' when comparing but not swapping
                r: lerp(150, 77, u), 
                g: lerp(150, 77, u), 
                b: lerp(150, 77, u), 
            });
        }
    }

    //construction of the shape of cylinder to represent each element of array
    draw(ctx){
        // changed variable is used to stop animation of other cylinders while 2 cylinders are swapping
        let changed = false;
        if (this.queue.length > 0){
            const {x, y, r, g ,b} = this.queue.shift();
            this.x = x;
            this.y = y;
            this.color = {r, g, b}; //draws color in cylinder
            changed = true;
        }

        const left = this.x - this.width/2; //left side of each cylinder element
        const top = this.y - this.height; // top side 
        const right = this.x + this.width/2; //right side of each cylinder element

        ctx.beginPath();
        const {r, g, b} = this.color;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`; // gray colour of the cylinder
        ctx.moveTo(left, top);
        ctx.lineTo(left, this.y); //left to bottom
        
        ctx.ellipse(this.x, this.y,
            this.width/2, this.width/4, 0, 
            Math.PI, Math.PI*2, true);
        ctx.lineTo(right, top) // right to top
        // construction of the top curve of the cylinder 
        ctx.ellipse(this.x, top,
            this.width/2, this.width/4, 0,
            0, Math.PI*2, true);
            ctx.fill();
            ctx.stroke();
            return changed; 
    }
}