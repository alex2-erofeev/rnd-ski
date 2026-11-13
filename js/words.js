var input = document.getElementById('words-input');
var button = document.getElementById('words-button');
var block2 = document.getElementById('block2');
var block3 = document.getElementById('block3');
var output = document.getElementById('words-output');

var startColor = randomColor();
var dragged = null;
var shiftX = 0;
var shiftY = 0;

function randomColor() {
    var r = Math.floor(Math.random() * 201);
    var g = Math.floor(Math.random() * 201);
    var b = Math.floor(Math.random() * 201);
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

function parse(text) {
    var parts = text.split(/[-–]/);
    var lower = [];
    var upper = [];
    var numbers = [];

    for (var i = 0; i < parts.length; i++) {
        var part = parts[i].trim();
        if (part == '') {
            continue;
        }
        if (!isNaN(part)) {
            numbers.push(Number(part));
        } else if (part[0] == part[0].toLowerCase()) {
            lower.push(part);
        } else {
            upper.push(part);
        }
    }

    lower.sort(function (a, b) {
        return a.localeCompare(b);
    });
    upper.sort(function (a, b) {
        return a.localeCompare(b);
    });
    numbers.sort(function (a, b) {
        return a - b;
    });

    var words = {};
    for (var j = 0; j < lower.length; j++) {
        words['a' + (j + 1)] = lower[j];
    }
    for (var k = 0; k < upper.length; k++) {
        words['b' + (k + 1)] = upper[k];
    }
    for (var n = 0; n < numbers.length; n++) {
        words['n' + (n + 1)] = numbers[n];
    }
    return words;
}

function addWord(item) {
    var span = document.createElement('span');
    span.style.color = item.style.backgroundColor;
    span.textContent = item.dataset.word;

    if (output.innerHTML != '') {
        output.appendChild(document.createTextNode(' '));
    }
    output.appendChild(span);
}

function createItem(key, word, index) {
    var item = document.createElement('div');
    item.className = 'words__item';
    item.textContent = key + ' ' + word;
    item.draggable = true;
    item.dataset.index = index;
    item.dataset.word = word;
    item.style.backgroundColor = startColor;

    item.addEventListener('dragstart', function (e) {
        dragged = item;
        var rect = item.getBoundingClientRect();
        shiftX = e.clientX - rect.left;
        shiftY = e.clientY - rect.top;
        e.dataTransfer.setData('text', key);
    });

    item.addEventListener('dragend', function () {
        dragged = null;
    });

    item.addEventListener('click', function () {
        if (item.parentNode == block2) {
            addWord(item);
        }
    });

    block3.appendChild(item);
}

function showWords() {
    var words = parse(input.value);

    block2.innerHTML = '';
    block3.innerHTML = '';
    output.innerHTML = '';

    var index = 0;
    for (var key in words) {
        index++;
        createItem(key, words[key], index);
    }
}

function dropToBlock2(e) {
    e.preventDefault();
    if (dragged == null) {
        return;
    }

    if (dragged.parentNode != block2) {
        dragged.style.backgroundColor = randomColor();
        dragged.classList.add('words__item--placed');
        block2.appendChild(dragged);
    }

    var rect = block2.getBoundingClientRect();
    var left = e.clientX - rect.left - block2.clientLeft - shiftX;
    var top = e.clientY - rect.top - block2.clientTop - shiftY;

    var maxLeft = block2.clientWidth - dragged.offsetWidth;
    var maxTop = block2.clientHeight - dragged.offsetHeight;
    left = Math.max(0, Math.min(left, maxLeft));
    top = Math.max(0, Math.min(top, maxTop));

    dragged.style.left = left + 'px';
    dragged.style.top = top + 'px';
}

function dropToBlock3(e) {
    e.preventDefault();
    if (dragged == null || dragged.parentNode == block3) {
        return;
    }

    dragged.classList.remove('words__item--placed');
    dragged.style.left = '';
    dragged.style.top = '';
    dragged.style.backgroundColor = startColor;

    var items = block3.querySelectorAll('.words__item');
    var index = Number(dragged.dataset.index);
    for (var i = 0; i < items.length; i++) {
        if (Number(items[i].dataset.index) > index) {
            block3.insertBefore(dragged, items[i]);
            return;
        }
    }
    block3.appendChild(dragged);
}

function allowDrop(e) {
    e.preventDefault();
}

button.addEventListener('click', showWords);
block2.addEventListener('dragover', allowDrop);
block2.addEventListener('drop', dropToBlock2);
block3.addEventListener('dragover', allowDrop);
block3.addEventListener('drop', dropToBlock3);
