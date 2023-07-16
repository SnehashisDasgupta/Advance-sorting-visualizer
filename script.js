myCanvas.width = 400;
myCanvas.height = 300;
const margin = 3
const length_of_array = 20;
const array = [];
let moves = [];
const cols = [];
const spacing = (myCanvas.width - margin * 2)/length_of_array;
const ctx = myCanvas.getContext("2d");

const maxColumnHeight = 200;

init();

let audioCtx = null;

function playNote(freq, type){
    // if audio context is null then it will put a sound in animation
    if (audioCtx == null){
        audioCtx = new (AudioContext || webkitAudioContext || window.webkitAudioContext)();
    }
    const dur = 0.2;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.type = type; //different type of sound for comparing and swapping
    osc.stop(audioCtx.currentTime + dur);

    //to avoid the clicking noise in the audio
    const node = audioCtx.createGain();
    node.gain.value = 0.4;
    node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
    osc.connect(node);
    node.connect(audioCtx.destination);

}

//storing random values in array
function init(){
    for (let i=0; i<length_of_array; i++){
        array[i] = Math.random();
    }
    moves = [];
    //creating the columns/cylinders
    for(let i=0; i<length_of_array; i++){
        // x and y are co-ordinates of centre of the base of cylinderical elements
        const x = i * spacing + spacing/2 + margin;
        const y = myCanvas.height - margin - i * 3; 
        const width = spacing - 5; //diameter of each cylinder element
        const height = maxColumnHeight * array[i]; //height of each cylinder element
        cols[i] = new Column(x, y, width, height);
    }
}

//play the sorting function
function playBubble(){
    moves = bubbbleSort(array);
}

animate();

//animation for swapping two values
function animate(){
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    let changed = false; 
    for (let i=0; i<cols.length; i++){
        // return true until the respective cylinder is not in proper place
        changed = cols[i].draw(ctx) || changed;
    }

    // if there is not change happening then only this function will run
    if(!changed && moves.length > 0){
        const move = moves.shift();
        const [i,j] = move.indices;
        // used to produce different sound in swapping and comparing
        const waveformType = move.swap? "square" : "sine";
        //produce sound on the basis of the height of the cylinder
        playNote(cols[i].height + cols[j].height, waveformType);
        //animation for cylinders swapping
        if (move.swap){
            cols[i].moveTo(cols[j]);
            cols[j].moveTo(cols[i], -1);
            [cols[i], cols[j]] = [cols[j], cols[i]];
        }else{
            //columns/cylinders will jumps a littie-bit when comparing but not swapping
            cols[i].jumps();
            cols[j].jumps();
        }
    }
    requestAnimationFrame(animate);
}

// algorithm for bubble sort
function bubbbleSort(array){
    // SWAP array to store current two elemets which are swapping.It will be used in doing animation
    const moves = [];
    
    for(let i=0; i<length_of_array; i++){
        for(let j=0; j<(length_of_array - i - 1); j++){

            if(array[j] > array[j+1]){
                //it shows which indices is involved in the move and what type of move it is. (SWAP)
                moves.push({indices: [j, j+1], swap: true});

                let temp = array[j];
                array[j] = array[j+1];
                array[j+1] = temp;
            }else{
                moves.push({indices: [j, j+1], swap: false});
            }
        }
    }
    return moves;
}



