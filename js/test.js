var questions = [
    {
        text: 'Если человека назвали мордофиля, то это…',
        answers: [
            { text: 'Значит, что он тщеславный.', correct: true },
            { text: 'Значит, что у него лицо как у хряка.', correct: false },
            { text: 'Значит, что чумазый.', correct: false }
        ],
        note: 'Ну зачем же вы так... В Этимологическом словаре русского языка Макса Фасмера поясняется, что мордофилей называют чванливого человека. Ну а «чванливый» — это высокомерный, тщеславный.'
    },
    {
        text: '«Да этот Ярополк — фуфлыга!» Что не так с Ярополком?',
        answers: [
            { text: 'Он маленький и невзрачный.', correct: true },
            { text: 'Он тот еще алкоголик.', correct: false },
            { text: 'Он не держит свое слово.', correct: false }
        ],
        note: 'Точно! Словарь Даля говорит, что фуфлыгой называют невзрачного малорослого человека. А еще так называют прыщи.'
    },
    {
        text: 'Если человека прозвали пятигузом, значит, он…',
        answers: [
            { text: 'Не держит слово.', correct: true },
            { text: 'Изменяет жене', correct: false },
            { text: 'Без гроша в кармане.', correct: false }
        ],
        note: 'Может сесть сразу на пять стульев. Согласно Этимологическому словарю русского языка Макса Фасмера, пятигуз — это ненадежный, непостоянный человек.'
    },
    {
        text: 'Кто такой шлындра?',
        answers: [
            { text: 'Обманщик.', correct: false },
            { text: 'Нытик.', correct: false },
            { text: 'Бродяга.', correct: true }
        ],
        note: 'Да! В Словаре русского арго «шлындрать» означает бездельничать, шляться.'
    },
    {
        text: 'В каком случае про человека можно сказать, что он охренел (в смысле "обнаглел/перешёл границы"), а не просто удивился?',
        answers: [
            { text: 'Он без спроса берёт твои вещи и делает вид, что так и надо.', correct: true },
            { text: 'Он в наглую лезет без очереди и ещё возмущается, что его не пропускают.', correct: true },
            { text: 'Он съел много хрена и искренне удивился: «Какой жгучий, вот это да!»', correct: false },
            { text: 'В осеннем лесу наблюдается завихрение листьев.', correct: false }
        ],
        note: 'Слово «охренел» многозначно, оно означает «обнаглел, потерял совесть».'
    }
];

var button = document.getElementById('test-button');
var area = document.getElementById('test-area');
var result = document.getElementById('test-end');

var order = shuffle(questions);
var num = 0;
var score = 0;
var canNext = true;
var finished = false;
var answerBlocks = [];

function shuffle(arr) {
    var copy = [];
    for (var i = 0; i < arr.length; i++) {
        copy.push(arr[i]);
    }
    for (var j = copy.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var temp = copy[j];
        copy[j] = copy[k];
        copy[k] = temp;
    }
    return copy;
}

function shake(elem) {
    elem.classList.add('test__shake');
    setTimeout(function () {
        elem.classList.remove('test__shake');
    }, 400);
}

function hide(elem, delay) {
    setTimeout(function () {
        elem.classList.add('test__answer--hide');
        setTimeout(function () {
            elem.parentNode.removeChild(elem);
        }, 500);
    }, delay);
}

function addMark(block, isRight) {
    var mark = document.createElement('span');
    if (isRight) {
        mark.className = 'test__mark test__mark--right';
        mark.innerHTML = '✔';
    } else {
        mark.className = 'test__mark test__mark--wrong';
        mark.innerHTML = '✘';
    }
    block.appendChild(mark);
}

function showResult() {
    finished = true;

    var title = document.createElement('p');
    title.className = 'test__end-title';
    title.innerHTML = 'Вопросы закончились';
    result.appendChild(title);

    var stats = document.createElement('p');
    stats.innerHTML = 'Правильных ответов: ' + score + ' из ' + order.length;
    result.appendChild(stats);
}

function endQuestion() {
    if (num == order.length) {
        showResult();
    } else {
        canNext = true;
        button.classList.remove('test__button--off');
    }
}

function showCorrect(question, answersBlock) {
    for (var i = 0; i < answerBlocks.length; i++) {
        answerBlocks[i].innerHTML = '';
    }
    answersBlock.classList.remove('test__answers--closed');

    for (var j = 0; j < question.answers.length; j++) {
        if (question.answers[j].correct) {
            var elem = document.createElement('div');
            elem.className = 'test__answer';
            elem.innerHTML = question.answers[j].text;
            elem.addEventListener('click', function () {
                shake(this);
            });
            answersBlock.appendChild(elem);
        }
    }
}

function check(answer, elem, question, questionBlock, answersBlock) {
    var blocks = answersBlock.querySelectorAll('.test__answer');
    var delay = 1000;

    if (answer.correct) {
        score++;
        elem.classList.add('test__answer--right');

        var note = document.createElement('p');
        note.className = 'test__note';
        note.innerHTML = question.note;
        elem.appendChild(note);

        for (var i = 0; i < blocks.length; i++) {
            if (blocks[i] != elem) {
                hide(blocks[i], delay);
                delay = delay + 400;
            }
        }
        setTimeout(function () {
            addMark(questionBlock, true);
        }, delay + 100);
        hide(elem, delay + 1500);
        setTimeout(endQuestion, delay + 2100);
    } else {
        for (var j = 0; j < blocks.length; j++) {
            hide(blocks[j], delay);
            delay = delay + 400;
        }
        setTimeout(function () {
            addMark(questionBlock, false);
        }, delay + 100);
        setTimeout(endQuestion, delay + 200);
    }
}

function addAnswer(answer, question, questionBlock, answersBlock) {
    var elem = document.createElement('div');
    elem.className = 'test__answer';
    elem.innerHTML = answer.text;

    elem.addEventListener('click', function () {
        if (answersBlock.classList.contains('test__answers--closed')) {
            return;
        }
        answersBlock.classList.add('test__answers--closed');
        shake(elem);
        setTimeout(function () {
            check(answer, elem, question, questionBlock, answersBlock);
        }, 400);
    });

    answersBlock.appendChild(elem);
}

function showQuestion() {
    if (!canNext || finished) {
        return;
    }
    canNext = false;
    button.classList.add('test__button--off');

    var question = order[num];
    num++;

    var row = document.createElement('div');
    row.className = 'test__row';

    var questionBlock = document.createElement('div');
    questionBlock.className = 'test__question';
    questionBlock.innerHTML = num + '. ' + question.text;

    var answersBlock = document.createElement('div');
    answersBlock.className = 'test__answers';
    answerBlocks.push(answersBlock);

    questionBlock.addEventListener('click', function () {
        shake(questionBlock);
        if (finished) {
            showCorrect(question, answersBlock);
        }
    });

    var answers = shuffle(question.answers);
    for (var i = 0; i < answers.length; i++) {
        addAnswer(answers[i], question, questionBlock, answersBlock);
    }

    row.appendChild(questionBlock);
    row.appendChild(answersBlock);
    area.appendChild(row);
}

button.addEventListener('click', showQuestion);
