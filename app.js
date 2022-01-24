const StorageCtrl = (function() {
    return {
        storeItem: function(item) {
            console.log(item);
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        removeItemFromStorageByName: function(itemName) {
            const items = JSON.parse(localStorage.getItem('items'));
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.name === itemName) {
                    items.splice(i, 1);
                }
            }
            localStorage.setItem('items', JSON.stringify(items));
        },
        getItemsFromStorage: function() {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        }
    }
})();

const ItemCtrl = (function() {
  
    class Item {
        constructor(id, name, calories) {
            this.id = id;
            this.name = name;
            this.calories = calories;
        }
    }

    const data = {
        items: [],
        total: 0,
        currentItem: null
    }

    data.items = StorageCtrl.getItemsFromStorage();

    return {
        getItems: function() {
            return data.items;
        },
        refreshItems: function() {
            data.items = StorageCtrl.getItemsFromStorage();
        },
        addItem: function(name, calories) {
            let itemId;
            if (data.items.length > 0) {
                itemId = data.items[data.items.length - 1].id + 1;
            } else {
                itemId = 0;
            }
            calories = parseInt(calories);
            newItem = new Item(itemId, name, calories);
            data.items.push(newItem);
            return newItem;
        },
        getCurrentItem: function(itemId) {
            const id = itemId.split('-')[1];
            for (let i = 0; i < data.items.length; i++) {
                const item = data.items[i];
                if (item.id.toString() === id) {
                    data.currentItem = item;
                }
            }
            return data.currentItem;
        },
        getTotalCalories: function() {
            let total = 0;
            data.items.forEach(function(item) {
                total = total + item.calories;
            });
            data.total = total;
            return data.total;
        },
        logData: function() {
            return data;
        }
    }
})();

const UICtrl = (function() {
    const UISelectors = {
        itemList: '#item-list',
        itemNameInput:'#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
        addBtn: '.add-btn',
        removeBtn: '.remove-btn',
        editBtn: '.edit-item'
    }

    return {
        getSelectors: function() {
            return UISelectors;
        },
        getItemInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value, 
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        setItemInput: function(name, cal) {
            document.querySelector(UISelectors.itemNameInput).value = name;
            document.querySelector(UISelectors.itemCaloriesInput).value = cal;
        },
        showItemList: function(items) {
            let html = '';

            items.forEach(function(item) {
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                <i id="item-${item.id}" class="edit-item fa fa-pencil"></i>
                </a>
                </li>`;
            });
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        addListItem: function(item) {
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong>
            <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
            <i id="item-${item.id}" class="edit-item fa fa-pencil"></i>
            </a>`;
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        hideAddBtn: function() {
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        showAddBtn: function() {
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        hideRemoveBtn: function() {
            document.querySelector(UISelectors.removeBtn).style.display = 'none';
        },
        showRemoveBtn: function() {
            document.querySelector(UISelectors.removeBtn).style.display = 'inline';
        }
    }
})();

const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
    const loadEventListeners = function() {
        const UISelectors = UICtrl.getSelectors();
        const addBtnElement = document.querySelector(UISelectors.addBtn);
        const removeBtnElement = document.querySelector(UISelectors.removeBtn);
        const editBtnElement = document.getElementById('item-list');
        
        removeBtnElement.addEventListener('click', itemRemoveSubmit);
        addBtnElement.addEventListener('click', itemAddSubmit);
        editBtnElement.addEventListener('click', itemEditSubmit);
        document.addEventListener('DOMContentLoaded', getItemsFromStorage);
    }
    const itemAddSubmit = function(event) {
        event.preventDefault();
        console.log('item add event function');
        const input = UICtrl.getItemInput();
        if (input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            StorageCtrl.storeItem(newItem);
            UICtrl.addListItem(newItem);
            UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
            UICtrl.clearInput();
        }
        UICtrl.hideRemoveBtn();
    }
    const itemRemoveSubmit = function(event) {
        event.preventDefault();

        StorageCtrl.removeItemFromStorageByName(UICtrl.getItemInput().name);
        ItemCtrl.refreshItems();   
        UICtrl.showItemList(StorageCtrl.getItemsFromStorage());
        UICtrl.showTotalCalories(ItemCtrl.getTotalCalories());
        UICtrl.showAddBtn();
        UICtrl.hideRemoveBtn();
        UICtrl.clearInput();
    }
    const itemEditSubmit = function(event) {
        event.preventDefault();

        const currentItem = ItemCtrl.getCurrentItem(event.target.id);
        UICtrl.setItemInput(currentItem.name, currentItem.calories);
        UICtrl.showRemoveBtn();

    }
    const getItemsFromStorage = function() {
        const items = StorageCtrl.getItemsFromStorage();
        UICtrl.showItemList(items);
    }
    return {
        init: function() {
            console.log("Initializing App");
         
            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);

            const items = ItemCtrl.getItems();
            if (items !== null && items.length !== 0) {
                UICtrl.showItemList(items);
            }
            
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl,  UICtrl);

App.init();