const input = document.getElementById('todo-input');
let list = document.getElementById('todo-list');
let count = document.getElementsByClassName('todo-app__total')[0];
let itemArr = [];
let idNum = 0;
let status = 'all';

input.addEventListener('keyup', event => {
  if (event.keyCode == 13 && event.target.value !== '') {
    const newItem = createItem(event.target.value);
    itemArr.push({ itemId: idNum++, itemDOM: newItem, completed: false });
    renderItems(itemArr, status);
    event.target.value = '';
  }
});

document.getElementById('filter-all').addEventListener('click', event => {
  status = 'all';
  renderItems(itemArr, status);
});

document.getElementById('filter-active').addEventListener('click', event => {
  status = 'active';
  renderItems(itemArr, status);
});

document.getElementById('filter-completed').addEventListener('click', event => {
  status = 'completed';
  renderItems(itemArr, status);
});

document.getElementById('clean').addEventListener('click', event => {
  itemArr = itemArr.filter(item => {
    return !item.completed;
  });
  renderItems(itemArr, status);
});

function createItem(itemValue) {
  const itemNode = document.createElement('LI');
  const wrapper = document.createElement('DIV');
  const input = document.createElement('INPUT');
  const label = document.createElement('LABEL');
  const h1 = document.createElement('H1');
  const delDiv = document.createElement('DIV');
  const sortDiv = document.createElement('DIV');

  itemNode.setAttribute('class', 'todo-app__item');
  wrapper.setAttribute('class', 'todo-app__checkbox');
  input.setAttribute('id', idNum);
  input.onclick = checkboxOnClick;
  input.setAttribute('type', 'checkbox');
  label.setAttribute('for', idNum);

  h1.setAttribute('class', 'todo-app__item-detail');
  h1.innerHTML = itemValue;
  delDiv.setAttribute('class', 'todo-app__item-delete');
  delDiv.onclick = deleteOnClick;
  delIcon = document.createElement('I');
  delIcon.setAttribute('class', 'fas fa-trash-alt');
  delDiv.appendChild(delIcon);

  sortDiv.setAttribute('class', 'todo-app__item-sort');
  sortIcon = document.createElement('I');
  sortIcon.setAttribute('class', 'fas fa-bars');
  sortDiv.appendChild(sortIcon);

  wrapper.appendChild(input);
  wrapper.appendChild(label);
  itemNode.appendChild(wrapper);
  itemNode.appendChild(h1);
  itemNode.appendChild(delDiv);
  itemNode.appendChild(sortDiv);

  return itemNode;
}

function renderItems(itemArr, status) {
  list.innerHTML = '';
  if (status === 'all') {
    itemArr.forEach(item => {
      list.appendChild(item.itemDOM);
    });
  } else if (status === 'active') {
    itemArr
      .filter(item => {
        return !item.completed;
      })
      .forEach(item => {
        list.appendChild(item.itemDOM);
      });
  } else if (status === 'completed') {
    itemArr
      .filter(item => {
        return item.completed;
      })
      .forEach(item => {
        list.appendChild(item.itemDOM);
      });
  }
  countLeft();
}

function checkboxOnClick() {
  let item = itemArr.find(item => {
    return item.itemId == this.id;
  });
  let node = item.itemDOM.querySelector('.todo-app__item-detail');
  if (!item.completed) {
    node.style['textDecoration'] = 'line-through';
    node.style['opacity'] = 0.5;
  } else {
    node.style['textDecoration'] = '';
    node.style['opacity'] = 1;
  }
  item.completed = !item.completed;
  renderItems(itemArr, status);
  countLeft();
}
function deleteOnClick() {
  const itemId = this.parentNode.firstChild.firstChild.id;
  itemArr = itemArr.filter(item => {
    return item.itemId != itemId;
  });
  renderItems(itemArr, status);
  countLeft();
}
function countLeft() {
  count.innerHTML =
    itemArr.filter(item => {
      return !item.completed;
    }).length + ' left';
}

// DRAG
var el = document.getElementById('todo-list');
Sortable.create(el, {
  animation: 150, // 物件移動時間(單位:毫秒)
  handle: '.todo-app__item-sort', // 可拖曳的區域
  draggable: '.todo-app__item', // 可拖曳的物件
  forceFallback: false, // 忽略HTML5 DnD
  onEnd: onEnd
});

Array.prototype.move = function(from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};

function onEnd(event) {
  console.log(event.oldIndex, event.newIndex);
  if (status === 'all') {
    itemArr.move(event.oldIndex, event.newIndex);
    renderItems(itemArr, status);
  }
}
