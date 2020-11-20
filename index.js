let cvs = document.createElement('canvas');
cvs.width = document.body.clientWidth;
cvs.height = document.body.clientHeight;
document.getElementById('container').appendChild(cvs);
var ctx = cvs.getContext('2d');

const colors = [ // bg, main, spike
    ['#FFFFFF', '#2B2B2B', '#F15050'], // normal
    ['#2C2B2B', '#FF1DBD', '#FAFF12'], // shockin' pink
    ['#F1F0FE', '#443366', '#8C499E'], // weak purple
    ['#7ABA7A', '#008482', '#B76EB8'], // dark green
    ['#FFFFFF', '#B76EB8', '#FF3E12'], // blue yellow
    ['#FA2C5F', '#FFFFFF', '#00ACFF'], // red and white
    ['#86FA0B', '#C00000', '#2933FE'], // green and brown
    ['#FFCC00', '#6600CC', '#CC0000'], // purple and yellow
    ['#1E6EF0', '#FFFFFF', '#FFAB00'], // summer
];
let colorID = null;
let color = null;
function setColor() {
    colorID = Math.floor(Math.random()*colors.length);
    color = colors[colorID];
}

/**
 * change color button
 */
let changeBtn = document.getElementById('change');
changeBtn.style.top = 'calc(50% - 16vh)';
changeBtn.style.left = '50%';
changeBtn.addEventListener('click', () => {
    setColor();
    draw();
});
let ghostIsHere = false;
document.body.addEventListener('keydown', e => {
    if (e.key === 'c' && !ghostIsHere) {
        setColor();
        draw();
    }
});

/** 
 * show modal button
*/
let showBtn = document.getElementById('show');
showBtn.style.top = 'calc(50% + ' + 1/2 * 16 + 'vh)';
showBtn.style.left = 'calc(50% - ' + 1.73/2 * 16 + 'vh)';
// show modal
showBtn.addEventListener('click', () => {
    let modalText = document.getElementById('modal-contents');
    let modalOverlay = document.getElementById('modal-overlay');
    modalText.style.display = 'block';
    modalOverlay.style.display = 'block';
});
// delete modal
document.addEventListener('click', e => {
    if (e.target.id === 'modal-overlay') {
        document.getElementById('modal-contents').style.display = 'none';
        document.getElementById('modal-overlay').style.display = 'none';
    }
});

/**
 * ??? button 
 */
let consoleID;
let faceBtn = document.getElementById('face');
faceBtn.style.top = 'calc(50% + ' + 1/2 * 16 + 'vh)';
faceBtn.style.left = 'calc(50% + ' + 1.73/2 * 16 + 'vh)';
let faceCount = 0;
function consoleFace() {
    switch (faceCount++%8) {
        case 0: console.log('--------■■■■■■■■--------'); break;
        case 1: console.log('------■   ■■■■   ■------'); break;
        case 2: console.log('----■■■   ■■■■   ■■■----'); break;
        case 3: console.log('---■■■■■■■    ■■■■■■■---'); break;
        case 4: console.log('----■■■■■      ■■■■■----'); break;
        case 5: console.log('------■■■■    ■■■■------'); break;
        case 6: console.log('---------■■■■■■---------'); break;
        case 7: console.log('------------------------'); break;
    }
}
faceBtn.addEventListener('click', () => {
    if (window.confirm('?')) {
        consoleID = setInterval(consoleFace, 20);
        drawFace();
    }
});
let once = true;
document.body.addEventListener('keydown', e => {
    if (e.key === ' ' && once) {
        once = false;
        consoleID = setInterval(consoleFace, 50);
        drawFace(true);
    }
})

/**
 * draw canvas
 */
const centerX = cvs.width/2;
const centerY = cvs.height/2;
let drawID, ghostID;
(function () {
    setColor();
    draw();
}());
function draw() {
    clearInterval(drawID);
    clearInterval(consoleID);
    {
        document.getElementById('title').style.color = color[1];
        document.getElementById('cc').style.color = color[1];

        changeBtn.style.borderColor = color[2];
        changeBtn.style.boxShadow = '0 0 0 10px ' + color[1] + ' inset';
        changeBtn.style.backgroundColor = color[0];
        changeBtn.style.color = color[1];

        showBtn.style.borderColor = color[2];
        showBtn.style.boxShadow = '0 0 0 10px ' + color[1] + ' inset';
        showBtn.style.backgroundColor = color[0];
        showBtn.style.color = color[1]; 

        faceBtn.style.borderColor = color[2];
        faceBtn.style.boxShadow = '0 0 0 10px ' + color[1] + ' inset';
        faceBtn.style.backgroundColor = color[0];
        faceBtn.style.color = color[1];

        let modalOverlay = document.getElementById('modal-overlay');
        modalOverlay.style.backgroundColor = 'black';
        modalOverlay.style.opacity = .6;
        
    }

    // background color
    ctx.fillStyle = color[0];
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    // center circle
    {
        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.arc(centerX, centerY, cvs.height/4, 0, 2*Math.PI);
        ctx.fillStyle = color[1];
        ctx.fill();

        ctx.beginPath();
        let theta = Math.PI/2;
        ctx.strokeStyle = color[0];
        for (let i=0; i<=2; i++) {
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX+Math.cos(theta+2*Math.PI/3*i)*cvs.height/4,
                    centerY+Math.sin(theta+2*Math.PI/3*i)*cvs.height/4);
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.arc(centerX, centerY, cvs.height/11, 0, 2*Math.PI);
        ctx.fillStyle = color[0];
        ctx.fill();
    }


    // outer circle1
    ctx.lineWidth = 100;
    ctx.strokeStyle = color[1];
    ctx.beginPath();
    ctx.arc(centerX, centerY, cvs.height/2, 0, 2*Math.PI);
    ctx.stroke();

    // inner spikes
    const division = 32;
    ctx.lineWidth = 1;
    radius = cvs.height/1.8;
    ctx.fillStyle = color[1];
    for (let i=1; i<division; i+=2) {
        ctx.beginPath();
        let theta = i/division*2*Math.PI;
        ctx.moveTo(centerX+Math.cos(theta)*radius, centerY+Math.sin(theta)*radius);
        theta += 1/division*2*Math.PI/.7;
        let sx = centerX+Math.cos(theta)*radius;
        let sy = centerY+Math.sin(theta)*radius;
        ctx.lineTo(sx, sy);
        theta += 1/division*2*Math.PI*.1;
        let x = centerX+Math.cos(theta-(1/division*2*Math.PI/.5))*radius*1.5;
        let y = centerY+Math.sin(theta-(1/division*2*Math.PI/.5))*radius*1.5;
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fill();
    }

    // outer circle2
    ctx.lineWidth = 100;
    ctx.beginPath();
    ctx.arc(centerX, centerY, cvs.height*.9, 0, 2*Math.PI);
    ctx.stroke();

    // outer spikes
    ctx.lineWidth = 1;
    radius = cvs.height;
    if (window.matchMedia('(max-width: 767px)').matches) {
        radius /= 1.8; // for sp
    }
    ctx.fillStyle = color[2];
    for (let i=1; i<division; i+=2) {
        ctx.beginPath();
        let theta = i/division*2*Math.PI + 1*Math.PI/division;
        ctx.moveTo(centerX+Math.cos(theta)*radius*1.5, centerY+Math.sin(theta)*radius*1.5);
        theta += 1/division*2*Math.PI/2;
        let sx = centerX+Math.cos(theta)*radius/2;
        let sy = centerY+Math.sin(theta)*radius/2;
        ctx.lineTo(sx, sy);
        theta += 1/division*2*Math.PI/2;
        let x = centerX+Math.cos(theta)*radius*1.5;
        let y = centerY+Math.sin(theta)*radius*1.5;
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fill();
    }
}

/**
 * ghost
 */
function drawFace(ghostNeverGo) {
    ghostIsHere = true;

    document.getElementById('contents').style.display = 'none';
    ctx.fillStyle = color[1];
    ctx.fillRect(0, 0, 2000, 1000);

    let a = 1.;
    if (window.matchMedia('(max-width: 767px)').matches) {
        a *= 0.7;
    }
    // face
    ctx.fillStyle = color[2];
    ctx.beginPath();
    ctx.arc(centerX, centerY, a*cvs.height/2.1, 0, 2*Math.PI);
    ctx.fill();

    // mouth
    ctx.fillStyle = color[1];
    ctx.beginPath();
    ctx.arc(centerX, centerY+a*cvs.height/4.6, a*cvs.height/4.5, 0, 2*Math.PI);
    ctx.fill();

    // eyes
    ctx.beginPath();
    ctx.arc(centerX+a*cvs.height/5, centerY-a*cvs.height/4.1, a*cvs.height/8, 0, 2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX-a*cvs.height/5, centerY-a*cvs.height/4.1, a*cvs.height/8, 0, 2*Math.PI);
    ctx.fill();

    if (!ghostNeverGo) {
        drawID = setInterval(() => {
            ghostIsHere = false;
            document.getElementById('contents').style.display = 'block';
            draw();
        }, 1000);
    }
}